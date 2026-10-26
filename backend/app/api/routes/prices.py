from typing import Optional
from fastapi import APIRouter, Query
from app.schemas.price import PriceResponse
from app.services.price_service import price_service

router = APIRouter(tags=["Precious Metal Rates"])


@router.get(
    "/gold-rates/live",
    response_model=PriceResponse,
    summary="Get live gold and silver rates from The Jewellers Association (MJDTA)",
    description="Returns live benchmark rates for 22K, 18K, 14K gold and silver per gram from The Jewellers Association.",
)
async def get_live_gold_rates(
    force: bool = Query(False, description="Bypass cache and force-fetch fresh rates from source"),
    refresh: Optional[bool] = Query(None, description="Alias for force refresh"),
):
    should_force = force or bool(refresh)
    return await price_service.get_live_prices(force_refresh=should_force)


@router.get(
    "/prices/gold-silver",
    response_model=PriceResponse,
    summary="Get live gold and silver rates (backward-compatible alias)",
    description="Returns rates for 22K, 18K, 14K gold and silver per gram.",
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
