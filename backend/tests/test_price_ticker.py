import time
import pytest
import httpx
from unittest.mock import AsyncMock, patch
from fastapi import HTTPException
from app.services.price_service import price_service, format_inr, format_timestamp_ist
from app.schemas.price import OroPocketResponse


SAMPLE_OROPOCKET_RESPONSE = {
    "statusCode": 200,
    "message": "Asset prices retrieved successfully",
    "data": {
        "gold": {
            "buy": 15000.0,
            "sell": 14500.0,
            "gst": 450.0,
            "currency": "INR",
            "unit": "gram",
            "change24h": {
                "buy": 0.47,
                "sell": 0.25,
            },
        },
        "silver": {
            "buy": 200.0,
            "sell": 190.0,
            "gst": 6.0,
            "currency": "INR",
            "unit": "gram",
            "change24h": {
                "buy": -1.2,
                "sell": -1.5,
            },
        },
        "timestamp": "2026-10-22T02:00:00.000Z",
    },
}


def test_01_currency_formatting_indian_notation():
    """Validates Indian numbering system grouping for various price scales."""
    assert format_inr(6742) == "6,742"
    assert format_inr(13750) == "13,750"
    assert format_inr(128500) == "1,28,500"
    assert format_inr(10000000) == "1,00,00,000"
    assert format_inr(94.5, decimals=2) == "94.50"
    assert format_inr(216.24, decimals=2) == "216.24"


def test_02_timestamp_ist_conversion():
    """Validates ISO UTC timestamp correctly formats into IST (UTC+5:30)."""
    # 2026-10-22 00:00:00 UTC = 05:30 AM IST
    ist_str = format_timestamp_ist("2026-10-22T00:00:00.000Z")
    assert "IST" in ist_str
    assert "22 Oct 2026" in ist_str
    assert "05:30 AM" in ist_str


def test_03_oropocket_validation_rejects_malformed_data():
    """Validates OroPocket response schema rejects non-numeric or negative prices."""
    # Negative price rejected
    bad_data = {
        "data": {
            "gold": {"buy": -100, "sell": 100},
            "silver": {"buy": 50, "sell": 40},
        }
    }
    with pytest.raises(Exception):
        OroPocketResponse.model_validate(bad_data)

    # String non-numeric rejected
    bad_data2 = {
        "data": {
            "gold": {"buy": "invalid-price", "sell": 100},
            "silver": {"buy": 50, "sell": 40},
        }
    }
    with pytest.raises(Exception):
        OroPocketResponse.model_validate(bad_data2)


@pytest.mark.asyncio
async def test_04_get_live_prices_success():
    """Validates full parsing, 22K/18K/925 calculation, and response structure."""
    price_service.clear_cache()

    mock_resp = httpx.Response(200, json=SAMPLE_OROPOCKET_RESPONSE)
    mock_client = AsyncMock(spec=httpx.AsyncClient)
    mock_client.get.return_value = mock_resp

    result = await price_service.get_live_prices(force_refresh=True, http_client=mock_client)

    assert result.success is True
    assert result.status == "live"
    assert result.is_live is True
    assert result.is_stale is False
    assert result.is_cached is False
    assert result.cache_age_seconds == 0

    # 24K gold buy was 15,000
    # 22K gold rate = 15000 * 22 / 24 = 13,750
    assert result.rates.raw.gold24k_buy == 15000.0
    assert result.rates.raw.gold22k_buy == 13750.0
    assert result.rates.formatted.gold22k == "13,750"
    assert result.rates.formatted.gold24k == "15,000"

    # 18K gold rate = 15000 * 18 / 24 = 11,250
    assert result.rates.raw.gold18k_buy == 11250.0
    assert result.rates.formatted.gold18k == "11,250"

    # Silver: 999 = 200.0, 925 sterling = 200.0 * 0.925 = 185.0
    assert result.rates.raw.silver999_buy == 200.0
    assert result.rates.raw.silver925_buy == 185.0
    assert result.rates.formatted.silver999 == "200.00"
    assert result.rates.formatted.silver1g == "185.00"

    # Positive change: +0.47% on 13,750 = +64.6 -> "+ ₹65"
    assert result.rates.formatted.isUp is True
    assert "+ ₹65" in result.rates.formatted.change


@pytest.mark.asyncio
async def test_05_caching_within_120_seconds():
    """Validates that consecutive calls within 120s return cached response without calling provider."""
    price_service.clear_cache()

    mock_resp = httpx.Response(200, json=SAMPLE_OROPOCKET_RESPONSE)
    mock_client = AsyncMock(spec=httpx.AsyncClient)
    mock_client.get.return_value = mock_resp

    # First call calls provider
    res1 = await price_service.get_live_prices(http_client=mock_client)
    assert res1.is_cached is False
    assert mock_client.get.call_count == 1

    # Second call within 120s serves from memory cache
    res2 = await price_service.get_live_prices(http_client=mock_client)
    assert res2.is_cached is True
    assert res2.status == "live_cached"
    # Provider was NOT called a second time
    assert mock_client.get.call_count == 1


@pytest.mark.asyncio
async def test_06_force_refresh_bypasses_cache():
    """Validates that force_refresh=True queries provider even if cache is still fresh."""
    price_service.clear_cache()

    mock_resp = httpx.Response(200, json=SAMPLE_OROPOCKET_RESPONSE)
    mock_client = AsyncMock(spec=httpx.AsyncClient)
    mock_client.get.return_value = mock_resp

    # Call 1
    await price_service.get_live_prices(http_client=mock_client)
    assert mock_client.get.call_count == 1

    # Call 2 with force_refresh=True
    res = await price_service.get_live_prices(force_refresh=True, http_client=mock_client)
    assert res.is_cached is False
    assert mock_client.get.call_count == 2


@pytest.mark.asyncio
async def test_07_fallback_to_stale_cache_when_provider_fails():
    """When provider fails after cache exists, returns stale cache with is_stale=True."""
    price_service.clear_cache()

    mock_resp_ok = httpx.Response(200, json=SAMPLE_OROPOCKET_RESPONSE)
    mock_client = AsyncMock(spec=httpx.AsyncClient)
    mock_client.get.return_value = mock_resp_ok

    # Initial success populates cache
    await price_service.get_live_prices(http_client=mock_client)

    # Next call encounters HTTP 502 / timeout error from provider
    mock_client.get.side_effect = httpx.ConnectTimeout("Connection timed out")

    stale_res = await price_service.get_live_prices(force_refresh=True, http_client=mock_client)
    assert stale_res.success is True
    assert stale_res.status == "stale_fallback"
    assert stale_res.is_stale is True
    assert stale_res.is_cached is True
    assert "Temporary provider network issue" in stale_res.disclaimer
    # Preserves actual rates
    assert stale_res.rates.formatted.gold22k == "13,750"


@pytest.mark.asyncio
async def test_08_error_503_when_no_cache_and_provider_fails():
    """When cache is empty and provider fails, returns 503 Service Unavailable without fake numbers."""
    price_service.clear_cache()

    mock_client = AsyncMock(spec=httpx.AsyncClient)
    mock_client.get.side_effect = httpx.ConnectError("Network unreachable")

    with pytest.raises(HTTPException) as exc_info:
        await price_service.get_live_prices(force_refresh=True, http_client=mock_client)

    assert exc_info.value.status_code == 503
    assert "temporarily unavailable" in exc_info.value.detail


def test_09_fastapi_endpoints_via_testclient(client):
    """Verifies that FastAPI router exposes /api/prices/gold-silver and /api/rates."""
    # Test main endpoint
    res1 = client.get("/api/prices/gold-silver")
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["success"] is True
    assert "rates" in data1
    assert "gold22k" in data1["rates"]["formatted"]
    assert "silver1g" in data1["rates"]["formatted"]

    # Test backward-compatible alias
    res2 = client.get("/api/rates")
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["success"] is True
    assert data2["rates"]["formatted"]["gold22k"] == data1["rates"]["formatted"]["gold22k"]
