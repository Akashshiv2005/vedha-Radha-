import asyncio
from datetime import datetime, timezone, timedelta
import logging
import math
import time
from typing import Any, Dict, Optional, Tuple
from fastapi import HTTPException, status
import httpx

from app.core.config import settings
from app.schemas.price import (
    OroPocketResponse,
    PriceResponse,
    FormattedRates,
    RawRates,
    RatesContainer,
)

logger = logging.getLogger("vedharadha_api.prices")

# Indian Standard Time (IST) is UTC+5:30
IST = timezone(timedelta(hours=5, minutes=30))


def format_inr(amount: float, decimals: int = 0) -> str:
    """Format numeric value into Indian Rupee style notation (e.g. 13,751 or 216.17)."""
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
            # Parse ISO timestamp (e.g. 2026-10-21T20:55:00.135Z)
            clean_str = ts_input.replace("Z", "+00:00")
            dt = datetime.fromisoformat(clean_str)
        elif isinstance(ts_input, (int, float)):
            dt = datetime.fromtimestamp(ts_input, tz=timezone.utc)
        elif isinstance(ts_input, datetime):
            dt = ts_input
        else:
            dt = datetime.now(timezone.utc)

        dt_ist = dt.astimezone(IST)
        # e.g. "22 Oct 2026, 02:25 AM IST"
        return dt_ist.strftime("%d %b %Y, %I:%M %p IST")
    except Exception:
        return "Today, Market Hours"


class PriceService:
    """
    Manages live gold and silver prices from OroPocket public API.
    Enforces a strict 120-second (2-minute) cache TTL with concurrency protection
    and graceful fallback to stale cache when the provider is temporarily unavailable.
    """

    def __init__(self, price_url: Optional[str] = None, ttl_seconds: Optional[int] = None):
        self.price_url = price_url or settings.OROPOCKET_PRICE_URL
        self.ttl_seconds = ttl_seconds or settings.PRICE_CACHE_TTL_SECONDS
        self._cached_response: Optional[Dict[str, Any]] = None
        self._cached_at: Optional[float] = None
        self._previous_gold22k: Optional[float] = None
        self._lock = asyncio.Lock()

    def clear_cache(self) -> None:
        """Resets in-memory cache (primarily used in tests)."""
        self._cached_response = None
        self._cached_at = None
        self._previous_gold22k = None

    def _build_price_response(
        self,
        gold_buy: float,
        gold_sell: float,
        silver_buy: float,
        silver_sell: float,
        gold_change_pct: Optional[float],
        timestamp_str: str,
        status_name: str = "live",
        is_stale: bool = False,
        is_cached: bool = False,
        cache_age_seconds: int = 0,
        raw_provider_data: Optional[Dict[str, Any]] = None,
    ) -> PriceResponse:
        """Calculates 22K, 18K gold and 925 silver rates and formats response."""
        # 1. Purity calculations:
        # Standard BIS 916 Indian Jewellery Gold = 22/24 of 24K pure bullion
        gold24k_buy = float(gold_buy)
        gold24k_sell = float(gold_sell)
        gold22k_buy = gold24k_buy * (22.0 / 24.0)
        gold18k_buy = gold24k_buy * (18.0 / 24.0)

        # 999 Fine Silver and 925 Sterling Jewellery Silver
        silver999_buy = float(silver_buy)
        silver999_sell = float(silver_sell)
        silver925_buy = silver999_buy * 0.925

        # 2. Price Change Indicator calculation:
        change_amount_22k: Optional[float] = None
        is_up = True
        formatted_change = None

        if gold_change_pct is not None:
            # Change percentage provided by OroPocket (e.g. -0.39% or +0.47%)
            change_amount_22k = gold22k_buy * (gold_change_pct / 100.0)
            is_up = gold_change_pct >= 0
            abs_change = abs(int(round(change_amount_22k)))
            if abs_change > 0:
                formatted_change = f"{'+' if is_up else '-'} ₹{abs_change}"
            else:
                formatted_change = "₹0"
        elif self._previous_gold22k is not None:
            # Fallback to difference against previously polled price
            diff = gold22k_buy - self._previous_gold22k
            is_up = diff >= 0
            abs_change = abs(int(round(diff)))
            change_amount_22k = diff
            if abs_change > 0:
                formatted_change = f"{'+' if is_up else '-'} ₹{abs_change}"
            else:
                formatted_change = "₹0"

        last_updated_str = format_timestamp_ist(timestamp_str)

        formatted = FormattedRates(
            gold22k=format_inr(gold22k_buy),
            gold24k=format_inr(gold24k_buy),
            gold18k=format_inr(gold18k_buy),
            silver1g=format_inr(silver925_buy, decimals=2),
            silver999=format_inr(silver999_buy, decimals=2),
            change=formatted_change,
            isUp=is_up,
            lastUpdated=last_updated_str,
        )

        raw = RawRates(
            gold24k_buy=gold24k_buy,
            gold24k_sell=gold24k_sell,
            gold22k_buy=round(gold22k_buy, 2),
            gold18k_buy=round(gold18k_buy, 2),
            silver999_buy=silver999_buy,
            silver999_sell=silver999_sell,
            silver925_buy=round(silver925_buy, 2),
            change_pct=gold_change_pct,
            change_amount_22k=round(change_amount_22k, 2) if change_amount_22k is not None else None,
            is_up=is_up,
            timestamp=timestamp_str,
        )

        meta = {
            "provider": "OroPocket",
            "provider_endpoint": self.price_url,
            "currency": "INR",
            "unit": "gram",
            "cache_ttl_seconds": self.ttl_seconds,
            "gold_purity_22k": "22K BIS 916 Hallmark Jewellery Standard (22/24)",
            "gold_purity_24k": "24K 999 Fine Gold Bullion",
            "silver_purity_925": "92.5% Sterling Silver Jewellery Standard",
            "silver_purity_999": "99.9% Fine Pure Silver",
            "gst_note": "Showroom board rate benchmark is base metal rate exclusive of 3% GST.",
        }

        gold_summary = {
            "buy": gold24k_buy,
            "sell": gold24k_sell,
            "rate_22k": round(gold22k_buy, 2),
            "rate_18k": round(gold18k_buy, 2),
            "unit": "gram",
            "currency": "INR",
        }

        silver_summary = {
            "buy": silver999_buy,
            "sell": silver999_sell,
            "rate_925": round(silver925_buy, 2),
            "unit": "gram",
            "currency": "INR",
        }

        disclaimer = (
            "Market benchmark rates are indicative. Spot prices updated every 2 minutes via OroPocket."
            if not is_stale
            else "Temporary provider network issue. Displaying last confirmed spot benchmark rates."
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
            timestamp=timestamp_str,
        )

    async def get_live_prices(
        self, force_refresh: bool = False, http_client: Optional[httpx.AsyncClient] = None
    ) -> PriceResponse:
        """
        Retrieves gold and silver prices with 120-second caching.
        Thread/task safe with async double-checked locking.
        """
        now = time.time()

        # 1. Quick read under no-lock for cached data within TTL
        if not force_refresh and self._cached_response is not None and self._cached_at is not None:
            age = int(now - self._cached_at)
            if age < self.ttl_seconds:
                # Return fresh cache
                cached_data = self._cached_response
                return self._build_price_response(
                    gold_buy=cached_data["gold_buy"],
                    gold_sell=cached_data["gold_sell"],
                    silver_buy=cached_data["silver_buy"],
                    silver_sell=cached_data["silver_sell"],
                    gold_change_pct=cached_data["gold_change_pct"],
                    timestamp_str=cached_data["timestamp_str"],
                    status_name="live_cached",
                    is_stale=False,
                    is_cached=True,
                    cache_age_seconds=age,
                )

        # 2. Acquire lock to refresh from OroPocket (preventing thundering herd)
        async with self._lock:
            now = time.time()
            # Double-check inside lock
            if not force_refresh and self._cached_response is not None and self._cached_at is not None:
                age = int(now - self._cached_at)
                if age < self.ttl_seconds:
                    cached_data = self._cached_response
                    return self._build_price_response(
                        gold_buy=cached_data["gold_buy"],
                        gold_sell=cached_data["gold_sell"],
                        silver_buy=cached_data["silver_buy"],
                        silver_sell=cached_data["silver_sell"],
                        gold_change_pct=cached_data["gold_change_pct"],
                        timestamp_str=cached_data["timestamp_str"],
                        status_name="live_cached",
                        is_stale=False,
                        is_cached=True,
                        cache_age_seconds=age,
                    )

            # 3. Call OroPocket Public API
            try:
                client_to_use = http_client
                should_close = False
                if client_to_use is None:
                    client_to_use = httpx.AsyncClient(timeout=8.0)
                    should_close = True

                try:
                    logger.debug("Fetching live spot prices from %s", self.price_url)
                    resp = await client_to_use.get(self.price_url)
                finally:
                    if should_close:
                        await client_to_use.aclose()

                if resp.status_code != 200:
                    logger.warning(
                        "OroPocket price provider returned HTTP %d: %s",
                        resp.status_code,
                        resp.text[:200],
                    )
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail=f"Price provider responded with status {resp.status_code}",
                    )

                json_body = resp.json()
                # Validate response schema
                validated = OroPocketResponse.model_validate(json_body)
                data = validated.data

                gold_buy = data.gold.buy
                gold_sell = data.gold.sell
                silver_buy = data.silver.buy
                silver_sell = data.silver.sell

                gold_change_pct = None
                if data.gold.change24h and data.gold.change24h.buy is not None:
                    gold_change_pct = data.gold.change24h.buy

                timestamp_str = data.timestamp or datetime.now(timezone.utc).isoformat()

                # If we have an existing cache, record previous 22K gold rate
                if self._cached_response:
                    self._previous_gold22k = self._cached_response["gold_buy"] * (22.0 / 24.0)

                # Update in-memory cache
                self._cached_response = {
                    "gold_buy": gold_buy,
                    "gold_sell": gold_sell,
                    "silver_buy": silver_buy,
                    "silver_sell": silver_sell,
                    "gold_change_pct": gold_change_pct,
                    "timestamp_str": timestamp_str,
                }
                self._cached_at = time.time()

                return self._build_price_response(
                    gold_buy=gold_buy,
                    gold_sell=gold_sell,
                    silver_buy=silver_buy,
                    silver_sell=silver_sell,
                    gold_change_pct=gold_change_pct,
                    timestamp_str=timestamp_str,
                    status_name="live",
                    is_stale=False,
                    is_cached=False,
                    cache_age_seconds=0,
                )

            except Exception as exc:
                logger.warning("OroPocket price fetch failed: %s", exc)

                # If we have an existing cached response (even if expired), serve stale fallback
                if self._cached_response is not None and self._cached_at is not None:
                    age = int(time.time() - self._cached_at)
                    logger.info("Serving stale price cache (age %d seconds) as fallback", age)
                    cached_data = self._cached_response
                    return self._build_price_response(
                        gold_buy=cached_data["gold_buy"],
                        gold_sell=cached_data["gold_sell"],
                        silver_buy=cached_data["silver_buy"],
                        silver_sell=cached_data["silver_sell"],
                        gold_change_pct=cached_data["gold_change_pct"],
                        timestamp_str=cached_data["timestamp_str"],
                        status_name="stale_fallback",
                        is_stale=True,
                        is_cached=True,
                        cache_age_seconds=age,
                    )

                # No cache exists: return 503 Service Unavailable without inventing fake prices
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Gold and silver price service temporarily unavailable. Please retry shortly.",
                )


# Global singleton instance
price_service = PriceService()
