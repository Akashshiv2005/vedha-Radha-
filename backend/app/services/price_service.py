import asyncio
from datetime import datetime, timezone, timedelta
import logging
import math
import re
import time
from typing import Any, Dict, Optional, Tuple
from fastapi import HTTPException, status
import httpx

from app.core.config import settings
from app.schemas.price import (
    PriceResponse,
    FormattedRates,
    RawRates,
    RatesContainer,
)

logger = logging.getLogger("vedharadha_api.prices")

# Indian Standard Time (IST) is UTC+5:30
IST = timezone(timedelta(hours=5, minutes=30))


def format_inr(amount: float, decimals: int = 0) -> str:
    """Format numeric value into Indian Rupee style notation (e.g. 13,085 or 220.00)."""
    if amount is None or not math.isfinite(amount):
        return "0"

    if decimals > 0:
        val_str = f"{amount:.{decimals}f}"
        int_part, dec_part = val_str.split(".")
    else:
        int_part = str(int(round(amount)))
        dec_part = ""

    # Indian numbering: last 3 digits, then groups of 2
    if len(int_part) <= 3:
        formatted_int = int_part
    else:
        last3 = int_part[-3:]
        remaining = int_part[:-3]
        groups = []
        while len(remaining) > 2:
            groups.insert(0, remaining[-2:])
            remaining = remaining[:-2]
        if remaining:
            groups.insert(0, remaining)
        formatted_int = ",".join(groups) + "," + last3

    if decimals > 0:
        return f"{formatted_int}.{dec_part}"
    return formatted_int


def format_timestamp_ist(ts_input: Any) -> str:
    """Converts ISO timestamp string or unix epoch to readable IST formatted string."""
    try:
        if isinstance(ts_input, str):
            clean_str = ts_input.replace("Z", "+00:00")
            dt = datetime.fromisoformat(clean_str)
        elif isinstance(ts_input, (int, float)):
            dt = datetime.fromtimestamp(ts_input, tz=timezone.utc)
        elif isinstance(ts_input, datetime):
            dt = ts_input
        else:
            dt = datetime.now(timezone.utc)

        dt_ist = dt.astimezone(IST)
        return dt_ist.strftime("%d %b %Y, %I:%M %p IST")
    except Exception:
        return "Today, Market Hours"


def parse_jewellers_association_html(html: str) -> Dict[str, Any]:
    """
    Parses The Jewellers Association website HTML to extract:
    - 22K Gold rate per gram
    - 18K Gold rate per gram
    - 14K Gold rate per gram
    - Silver rate per gram
    - Actual rate update date and time
    - 22K daily difference
    Uses dual extraction: primary via inline JavaScript variables, fallback via HTML table cells.
    """
    if not html or not isinstance(html, str):
        raise ValueError("Empty or invalid HTML content received")

    # 1. Extract 22K Gold rate
    m22 = re.search(r'goldrate_22ct\x27\)\.html\(\x22([0-9.]+)\x22', html)
    if not m22:
        m22 = re.search(r'1\s*Gm\s*Gold\s*22Kt.*?class=[\x22\x27]gold_rate[\x22\x27][^>]*>([0-9.]+)<', html, re.S | re.I)

    # 2. Extract 18K Gold rate
    m18 = re.search(r'goldrate_18ct\x27\)\.html\(\x22([0-9.]+)\x22', html)
    if not m18:
        m18 = re.search(r'1\s*Gm\s*Gold\s*18Kt.*?class=[\x22\x27]gold_rate[\x22\x27][^>]*>([0-9.]+)<', html, re.S | re.I)

    # 3. Extract 14K Gold rate
    m14 = re.search(r'goldrate_14ct\x27\)\.html\(\x22([0-9.]+)\x22', html)
    if not m14:
        m14 = re.search(r'1\s*Gm\s*Gold\s*14Kt.*?class=[\x22\x27]gold_rate[\x22\x27][^>]*>([0-9.]+)<', html, re.S | re.I)

    # 4. Extract Silver rate (1 Gm)
    # The source website explicitly displays the silver per gram rate in span.silver_rate (e.g. 220.00)
    msilver = re.search(r'<span\s+class=[\x22\x27]silver_rate[\x22\x27]>([0-9.]+)</span>', html, re.I)
    if not msilver:
        msilver = re.search(r'1\s*Gm\s*Silver.*?class=[\x22\x27]silver_rate[\x22\x27][^>]*>([0-9.]+)<', html, re.S | re.I)

    # 5. Extract Update Date & Time
    mtime = re.search(r'updatetime\x27\)\.html\(\x22([^\x22]+)\x22', html)
    if not mtime:
        mtime = re.search(r'id=[\x22\x27]updatetime[\x22\x27]>([^<]+)<', html, re.I)
    if not mtime:
        mtime_generic = re.search(r'Update\s*Time:\s*<[^>]+>([^<]+)<', html, re.I)
        if mtime_generic:
            mtime = mtime_generic

    # 6. Extract 22K change difference
    mdiff22 = re.search(r'goldrate_22ctdiff\s*=\s*\x22([^\x22]+)\x22', html)

    # Validation: Ensure all essential rate fields were located
    missing = []
    if not m22:
        missing.append("22K Gold")
    if not m18:
        missing.append("18K Gold")
    if not m14:
        missing.append("14K Gold")
    if not msilver:
        missing.append("Silver")

    if missing:
        raise ValueError(f"Failed to extract rate fields from source HTML: {', '.join(missing)}")

    try:
        gold22k_val = float(m22.group(1))
        gold18k_val = float(m18.group(1))
        gold14k_val = float(m14.group(1))
        silver1g_val = float(msilver.group(1))
    except (ValueError, TypeError) as conv_err:
        raise ValueError(f"Non-numeric rate value extracted: {conv_err}")

    # Boundary and sanity checks
    if gold22k_val <= 0 or gold18k_val <= 0 or gold14k_val <= 0 or silver1g_val <= 0:
        raise ValueError(f"Rate values must be greater than zero: 22K={gold22k_val}, 18K={gold18k_val}, 14K={gold14k_val}, Silver={silver1g_val}")

    update_time_str = mtime.group(1).strip() if mtime else datetime.now(IST).strftime("%d/%m/%Y Morning %I:%M %p")
    diff22k_val = None
    if mdiff22:
        try:
            diff22k_val = float(mdiff22.group(1))
        except ValueError:
            pass

    return {
        "gold22k": gold22k_val,
        "gold18k": gold18k_val,
        "gold14k": gold14k_val,
        "silver1g": silver1g_val,
        "update_time": update_time_str,
        "diff22k": diff22k_val,
    }


class PriceService:
    """
    Manages live gold and silver rates scraped from The Jewellers Association (MJDTA).
    Provides:
    - 22K Gold
    - 18K Gold
    - 14K Gold
    - Silver (1g)
    - Actual rate update date and time
    Includes async concurrency control, caching, and graceful stale fallback.
    """

    def __init__(
        self,
        source_url: Optional[str] = None,
        ttl_seconds: Optional[int] = None,
    ):
        self.source_url = source_url or getattr(settings, "JEWELLERS_ASSOCIATION_URL", "https://thejewellersassociation.org/")
        self.ttl_seconds = ttl_seconds or getattr(settings, "PRICE_CACHE_TTL_SECONDS", 300)
        self._cached_data: Optional[Dict[str, Any]] = None
        self._cached_at: Optional[float] = None
        self._lock = asyncio.Lock()

    def clear_cache(self) -> None:
        """Resets in-memory cache (used primarily in tests)."""
        self._cached_data = None
        self._cached_at = None

    def _build_price_response(
        self,
        data: Dict[str, Any],
        status_name: str = "live",
        is_stale: bool = False,
        is_cached: bool = False,
        cache_age_seconds: int = 0,
    ) -> PriceResponse:
        gold22k = data["gold22k"]
        gold18k = data["gold18k"]
        gold14k = data["gold14k"]
        silver1g = data["silver1g"]
        update_time = data["update_time"]
        diff22k = data.get("diff22k")

        # 24K Pure Bullion benchmark calculation for backwards-compatible consumers
        gold24k = round(gold22k * (24.0 / 22.0), 2)
        silver999 = round(silver1g * (0.999 / 0.925), 2)

        is_up = True
        formatted_change = None
        if diff22k is not None:
            is_up = diff22k >= 0
            abs_change = int(round(abs(diff22k)))
            if abs_change > 0:
                formatted_change = f"{'+' if is_up else '-'} ₹{abs_change}"
            else:
                formatted_change = "₹0"

        formatted = FormattedRates(
            gold22k=format_inr(gold22k),
            gold24k=format_inr(gold24k),
            gold18k=format_inr(gold18k),
            gold14k=format_inr(gold14k),
            silver1g=format_inr(silver1g, decimals=2),
            silver999=format_inr(silver999, decimals=2),
            change=formatted_change,
            isUp=is_up,
            lastUpdated=update_time,
        )

        iso_timestamp = datetime.now(timezone.utc).isoformat()

        raw = RawRates(
            gold22k=gold22k,
            gold18k=gold18k,
            gold14k=gold14k,
            silver1g=silver1g,
            gold24k=gold24k,
            gold22k_buy=gold22k,
            gold24k_buy=gold24k,
            gold24k_sell=round(gold24k * 0.965, 2),
            gold18k_buy=gold18k,
            silver999_buy=silver999,
            silver999_sell=round(silver999 * 0.945, 2),
            silver925_buy=silver1g,
            change_amount_22k=diff22k,
            is_up=is_up,
            timestamp=iso_timestamp,
        )

        meta = {
            "provider": "The Jewellers Association (MJDTA)",
            "provider_endpoint": self.source_url,
            "currency": "INR",
            "unit": "gram",
            "cache_ttl_seconds": self.ttl_seconds,
            "gold_purity_22k": "22K BIS 916 Hallmark Jewellery Standard",
            "gold_purity_18k": "18K (75.0%) Jewellery Gold",
            "gold_purity_14k": "14K (58.5%) Jewellery Gold",
            "silver_purity_1g": "1 Gm Silver Jewellery Standard",
            "update_schedule": "Published daily according to The Jewellers Association official board schedule.",
            "disclaimer": "Official market benchmark rates from The Jewellers Association (MJDTA)."
        }

        gold_summary = {
            "rate_22k": gold22k,
            "rate_18k": gold18k,
            "rate_14k": gold14k,
            "rate_24k_indicative": gold24k,
            "unit": "gram",
            "currency": "INR",
        }

        silver_summary = {
            "rate_1g": silver1g,
            "unit": "gram",
            "currency": "INR",
        }

        disclaimer = (
            "Official rates from The Jewellers Association (MJDTA)."
            if not is_stale
            else f"Temporary provider connection issue. Displaying last verified rates from {update_time}."
        )

        return PriceResponse(
            success=True,
            status=status_name,
            is_live=not is_stale,
            is_stale=is_stale,
            is_cached=is_cached,
            cache_age_seconds=cache_age_seconds,
            disclaimer=disclaimer,
            rates=RatesContainer(formatted=formatted, raw=raw, meta=meta),
            gold=gold_summary,
            silver=silver_summary,
            timestamp=iso_timestamp,
        )

    async def get_live_prices(
        self,
        force_refresh: bool = False,
        http_client: Optional[httpx.AsyncClient] = None,
    ) -> PriceResponse:
        """
        Retrieves gold and silver rates from The Jewellers Association with caching.
        Safe against race conditions with asyncio double-checked locking.
        """
        now = time.time()

        # 1. Check existing in-memory cache within TTL
        if not force_refresh and self._cached_data is not None and self._cached_at is not None:
            age = int(now - self._cached_at)
            if age < self.ttl_seconds:
                return self._build_price_response(
                    self._cached_data,
                    status_name="live_cached",
                    is_stale=False,
                    is_cached=True,
                    cache_age_seconds=age,
                )

        # 2. Acquire lock to fetch fresh rates
        async with self._lock:
            now = time.time()
            if not force_refresh and self._cached_data is not None and self._cached_at is not None:
                age = int(now - self._cached_at)
                if age < self.ttl_seconds:
                    return self._build_price_response(
                        self._cached_data,
                        status_name="live_cached",
                        is_stale=False,
                        is_cached=True,
                        cache_age_seconds=age,
                    )

            # 3. Request source website
            try:
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.5",
                }

                client_to_use = http_client
                should_close = False
                if client_to_use is None:
                    client_to_use = httpx.AsyncClient(timeout=10.0, follow_redirects=True, headers=headers)
                    should_close = True

                try:
                    logger.debug("Fetching rates from %s", self.source_url)
                    resp = await client_to_use.get(self.source_url)
                finally:
                    if should_close:
                        await client_to_use.aclose()

                if resp.status_code != 200:
                    logger.warning("The Jewellers Association returned HTTP %d", resp.status_code)
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail=f"The Jewellers Association returned HTTP {resp.status_code}",
                    )

                html_content = resp.text
                parsed_rates = parse_jewellers_association_html(html_content)

                # Store in memory cache
                self._cached_data = parsed_rates
                self._cached_at = time.time()

                return self._build_price_response(
                    parsed_rates,
                    status_name="live",
                    is_stale=False,
                    is_cached=False,
                    cache_age_seconds=0,
                )

            except Exception as exc:
                logger.warning("The Jewellers Association rate fetch failed: %s", exc)

                # Graceful stale fallback: Serve last confirmed rates if available
                if self._cached_data is not None and self._cached_at is not None:
                    age = int(time.time() - self._cached_at)
                    logger.info("Serving stale cached rates (age %d s) from %s", age, self._cached_data.get("update_time"))
                    return self._build_price_response(
                        self._cached_data,
                        status_name="stale_fallback",
                        is_stale=True,
                        is_cached=True,
                        cache_age_seconds=age,
                    )

                # Never invent fake prices when no confirmed cache is available
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Gold and silver rate service is temporarily unavailable. Please retry shortly.",
                )


# Global singleton instance
price_service = PriceService()
