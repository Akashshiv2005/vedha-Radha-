from typing import Optional
from fastapi import APIRouter, Query
from app.schemas.price import PriceResponse
from app.services.price_service import price_service

router = APIRouter(tags=["Precious Metal Rates"])


@router.get(
    "/prices/gold-silver",
    response_model=PriceResponse,
    summary="Get live gold and silver rates (cached for 120s from OroPocket)",
    description="Returns live spot rates for 24K, 22K, 18K gold and 999, 925 silver in INR per gram, refreshed every 2 minutes.",
)
async def get_gold_silver_prices(
    force: bool = Query(False, description="Bypass cache and force-fetch fresh rates from provider"),
    refresh: Optional[bool] = Query(None, description="Alias for force refresh"),
):
    should_force = force or bool(refresh)
    return await price_service.get_live_prices(force_refresh=should_force)


@router.get(
    "/rates",
    response_model=PriceResponse,
    summary="Get precious metal rates (alias compatible with existing ticker and modal)",
    description="Backward-compatible alias pointing to the live gold & silver rates endpoint.",
)
async def get_rates_alias(
    force: bool = Query(False, description="Bypass cache and force-fetch fresh rates"),
    refresh: Optional[bool] = Query(None, description="Alias for force refresh"),
):
    should_force = force or bool(refresh)
    return await price_service.get_live_prices(force_refresh=should_force)
