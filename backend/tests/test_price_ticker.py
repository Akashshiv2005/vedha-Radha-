import time
import pytest
import httpx
from unittest.mock import AsyncMock, patch
from fastapi import HTTPException
from app.services.price_service import (
    price_service,
    format_inr,
    format_timestamp_ist,
    parse_jewellers_association_html,
)

SAMPLE_JEWELLERS_ASSOCIATION_HTML = """
<!DOCTYPE html>
<html>
<head><title>The Jewellers and Diamond Traders' Association</title></head>
<body>
<div class="col-xs-12 rate_index">
    <table class="table">
        <tbody>
            <tr class="table1">
                <td class="text-center rate_title1">1 Gm Gold 22Kt</td>
                <td class="text-center">
                    <span id="goldrate_22ct" class="gold_rate"></span>
                    <span class="gold_rate" style="display:none;">13085.00</span>
                    <div class="rate_arrow">(<span id="goldrate_22ctdiff">15</span>)</div>
                </td>
            </tr>
            <tr class="table1">
                <td class="text-center rate_title1">1 Gm Gold 18Kt</td>
                <td class="text-center">
                    <span id="goldrate_18ct" class="gold_rate"></span>
                    <div class="rate_arrow">(<span id="goldrate_18ctdiff">10</span>)</div>
                </td>
            </tr>
            <tr class="table1">
                <td class="text-center rate_title1">1 Gm Gold 14Kt</td>
                <td class="text-center">
                    <span id="goldrate_14ct" class="gold_rate"></span>
                    <div class="rate_arrow">(<span id="goldrate_14ctdiff">0</span>)</div>
                </td>
            </tr>
            <tr class="table1">
                <td class="text-center rate_title1">1 Gm Silver</td>
                <td class="text-center">
                    <span class="silver_rate">220.00</span>
                    <span style="display:none;" id="silverrate_1gm" class="silver_rate"></span>
                    <div class="rate_arrow">(<span id="silverrate_1gmdiff">0</span>)</div>
                </td>
            </tr>
        </tbody>
    </table>
    <p class="lastupdatetime1">Update Time: <span id="updatetime"></span></p>
</div>
<script type="text/javascript">
function set_goldrate() {
    var goldrate_22ctdiff = "15";
    $('#goldrate_22ct').html("13085.00");
    var silverrate_1gmdiff = parseFloat("0").toFixed(2);
    $('#silverrate_1gm').html("9");
    var goldrate_18ctdiff = "10";
    $('#goldrate_18ct').html("10705.00");
    var goldrate_14ctdiff = "0";
    $('#goldrate_14ct').html("8550.00");
    $('#updatetime').html("26/10/2026 Morning 09:36 AM");
}
</script>
</body>
</html>
"""


def test_01_currency_formatting_indian_notation():
    """Validates Indian numbering system grouping for various price scales."""
    assert format_inr(6742) == "6,742"
    assert format_inr(13085) == "13,085"
    assert format_inr(10705) == "10,705"
    assert format_inr(8550) == "8,550"
    assert format_inr(128500) == "1,28,500"
    assert format_inr(10000000) == "1,00,00,000"
    assert format_inr(220.0, decimals=2) == "220.00"
    assert format_inr(216.24, decimals=2) == "216.24"


def test_02_timestamp_ist_conversion():
    """Validates ISO UTC timestamp correctly formats into IST (UTC+5:30)."""
    ist_str = format_timestamp_ist("2026-10-22T00:00:00.000Z")
    assert "IST" in ist_str
    assert "22 Oct 2026" in ist_str
    assert "05:30 AM" in ist_str


def test_03_parse_jewellers_association_html_success():
    """Validates accurate parsing of 22K, 18K, 14K, Silver, and timestamp from source HTML."""
    parsed = parse_jewellers_association_html(SAMPLE_JEWELLERS_ASSOCIATION_HTML)

    assert parsed["gold22k"] == 13085.0
    assert parsed["gold18k"] == 10705.0
    assert parsed["gold14k"] == 8550.0
    assert parsed["silver1g"] == 220.0
    assert parsed["update_time"] == "26/10/2026 Morning 09:36 AM"
    assert parsed["diff22k"] == 15.0


def test_04_parse_rejects_missing_or_invalid_fields():
    """Validates that parser raises ValueError when essential rate fields are missing or non-positive."""
    bad_html = "<html><body>No rate data here</body></html>"
    with pytest.raises(ValueError) as exc:
        parse_jewellers_association_html(bad_html)
    assert "Failed to extract rate fields" in str(exc.value)

    zero_rate_html = """
    function set_goldrate() {
        $('#goldrate_22ct').html("0.00");
        $('#goldrate_18ct').html("10705.00");
        $('#goldrate_14ct').html("8550.00");
        $('#updatetime').html("Today");
    }
    <span class="silver_rate">220.00</span>
    """
    with pytest.raises(ValueError) as exc2:
        parse_jewellers_association_html(zero_rate_html)
    assert "greater than zero" in str(exc2.value)


@pytest.mark.asyncio
async def test_05_get_live_prices_success():
    """Validates full parsing, formatting, and response structure for The Jewellers Association rates."""
    price_service.clear_cache()

    mock_resp = httpx.Response(200, text=SAMPLE_JEWELLERS_ASSOCIATION_HTML)
    mock_client = AsyncMock(spec=httpx.AsyncClient)
    mock_client.get.return_value = mock_resp

    result = await price_service.get_live_prices(force_refresh=True, http_client=mock_client)

    assert result.success is True
    assert result.status == "live"
    assert result.is_live is True
    assert result.is_stale is False
    assert result.is_cached is False
    assert result.cache_age_seconds == 0

    # Rates
    assert result.rates.raw.gold22k == 13085.0
    assert result.rates.formatted.gold22k == "13,085"
    assert result.rates.raw.gold18k == 10705.0
    assert result.rates.formatted.gold18k == "10,705"
    assert result.rates.raw.gold14k == 8550.0
    assert result.rates.formatted.gold14k == "8,550"
    assert result.rates.raw.silver1g == 220.0
    assert result.rates.formatted.silver1g == "220.00"

    # Timestamp & change
    assert result.rates.formatted.lastUpdated == "26/10/2026 Morning 09:36 AM"
    assert result.rates.formatted.isUp is True
    assert "+ ₹15" in result.rates.formatted.change


@pytest.mark.asyncio
async def test_06_caching_within_ttl():
    """Validates that consecutive calls within cache TTL return cached response without calling provider."""
    price_service.clear_cache()

    mock_resp = httpx.Response(200, text=SAMPLE_JEWELLERS_ASSOCIATION_HTML)
    mock_client = AsyncMock(spec=httpx.AsyncClient)
    mock_client.get.return_value = mock_resp

    # First call queries provider
    res1 = await price_service.get_live_prices(http_client=mock_client)
    assert res1.is_cached is False
    assert mock_client.get.call_count == 1

    # Second call within TTL serves from memory cache
    res2 = await price_service.get_live_prices(http_client=mock_client)
    assert res2.is_cached is True
    assert res2.status == "live_cached"
    # Provider was NOT queried a second time
    assert mock_client.get.call_count == 1


@pytest.mark.asyncio
async def test_07_force_refresh_bypasses_cache():
    """Validates that force_refresh=True queries provider even if cache is still fresh."""
    price_service.clear_cache()

    mock_resp = httpx.Response(200, text=SAMPLE_JEWELLERS_ASSOCIATION_HTML)
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
async def test_08_fallback_to_stale_cache_when_provider_fails():
    """When provider fails after cache exists, returns stale cache with is_stale=True."""
    price_service.clear_cache()

    mock_resp_ok = httpx.Response(200, text=SAMPLE_JEWELLERS_ASSOCIATION_HTML)
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
    assert "Temporary provider connection issue" in stale_res.disclaimer
    # Preserves actual rates
    assert stale_res.rates.formatted.gold22k == "13,085"
    assert stale_res.rates.formatted.gold18k == "10,705"
    assert stale_res.rates.formatted.gold14k == "8,550"
    assert stale_res.rates.formatted.silver1g == "220.00"


@pytest.mark.asyncio
async def test_09_error_503_when_no_cache_and_provider_fails():
    """When cache is empty and provider fails, returns 503 Service Unavailable without inventing prices."""
    price_service.clear_cache()

    mock_client = AsyncMock(spec=httpx.AsyncClient)
    mock_client.get.side_effect = httpx.ConnectError("Network unreachable")

    with pytest.raises(HTTPException) as exc_info:
        await price_service.get_live_prices(force_refresh=True, http_client=mock_client)

    assert exc_info.value.status_code == 503
    assert "temporarily unavailable" in exc_info.value.detail


def test_10_fastapi_endpoints_via_testclient(client):
    """Verifies that FastAPI router exposes /api/gold-rates/live, /api/prices/gold-silver, and /api/rates."""
    price_service.clear_cache()
    mock_resp = httpx.Response(200, text=SAMPLE_JEWELLERS_ASSOCIATION_HTML)

    with patch.object(httpx.AsyncClient, "get", new_callable=AsyncMock, return_value=mock_resp):
        # Test primary endpoint
        res_primary = client.get("/api/gold-rates/live")
        assert res_primary.status_code == 200
        data_primary = res_primary.json()
        assert data_primary["success"] is True
        assert "rates" in data_primary
        assert data_primary["rates"]["formatted"]["gold22k"] == "13,085"
        assert data_primary["rates"]["formatted"]["gold18k"] == "10,705"
        assert data_primary["rates"]["formatted"]["gold14k"] == "8,550"
        assert data_primary["rates"]["formatted"]["silver1g"] == "220.00"

        # Test backward-compatible alias 1
        res1 = client.get("/api/prices/gold-silver")
        assert res1.status_code == 200
        data1 = res1.json()
        assert data1["success"] is True
        assert data1["rates"]["formatted"]["gold22k"] == "13,085"

        # Test backward-compatible alias 2
        res2 = client.get("/api/rates")
        assert res2.status_code == 200
        data2 = res2.json()
        assert data2["success"] is True
        assert data2["rates"]["formatted"]["gold22k"] == "13,085"
