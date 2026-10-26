import math
from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class OroPocketChange24h(BaseModel):
    buy: Optional[float] = None
    sell: Optional[float] = None

    model_config = ConfigDict(extra="ignore")


class OroPocketMetalItem(BaseModel):
    buy: float = Field(..., description="Buy price per gram in INR")
    sell: float = Field(..., description="Sell price per gram in INR")
    gst: Optional[float] = None
    currency: str = "INR"
    unit: str = "gram"
    change24h: Optional[OroPocketChange24h] = None

    model_config = ConfigDict(extra="ignore")

    @field_validator("buy", "sell", mode="before")
    @classmethod
    def validate_price(cls, v: Any) -> float:
        try:
            val = float(v)
        except (ValueError, TypeError):
            raise ValueError(f"Price must be a valid numeric value, got: {v}")
        if not math.isfinite(val):
            raise ValueError(f"Price must be a finite number, got: {val}")
        if val <= 0:
            raise ValueError(f"Price must be greater than zero, got: {val}")
        return val


class OroPocketData(BaseModel):
    gold: OroPocketMetalItem
    silver: OroPocketMetalItem
    timestamp: Optional[str] = None

    model_config = ConfigDict(extra="ignore")


class OroPocketResponse(BaseModel):
    statusCode: Optional[int] = 200
    message: Optional[str] = None
    data: OroPocketData

    model_config = ConfigDict(extra="ignore")


class FormattedRates(BaseModel):
    gold22k: str = Field(..., description="Standard 22K (916) jewellery rate per gram formatted e.g. 13,085")
    gold24k: Optional[str] = Field(None, description="Pure 24K bullion rate per gram formatted e.g. 14,275")
    gold18k: str = Field(..., description="18K jewellery rate per gram formatted e.g. 10,705")
    gold14k: Optional[str] = Field(None, description="14K jewellery rate per gram formatted e.g. 8,550")
    silver1g: str = Field(..., description="Silver rate per gram formatted e.g. 220.00")
    silver999: Optional[str] = Field(None, description="Pure 999 fine silver rate per gram formatted e.g. 237.60")
    change: Optional[str] = Field(None, description="Daily price movement formatted e.g. '+ ₹15' or '- ₹20'")
    isUp: bool = Field(True, description="True if price moved up or remained neutral")
    lastUpdated: str = Field(..., description="Actual rate update date and time from source")


class RawRates(BaseModel):
    gold22k: float
    gold18k: float
    gold14k: Optional[float] = None
    silver1g: float
    gold24k: Optional[float] = None
    gold22k_buy: Optional[float] = None
    gold24k_buy: Optional[float] = None
    gold24k_sell: Optional[float] = None
    gold18k_buy: Optional[float] = None
    silver999_buy: Optional[float] = None
    silver999_sell: Optional[float] = None
    silver925_buy: Optional[float] = None
    change_pct: Optional[float] = None
    change_amount_22k: Optional[float] = None
    is_up: bool = True
    timestamp: str

    model_config = ConfigDict(extra="ignore")


class RatesContainer(BaseModel):
    formatted: FormattedRates
    raw: RawRates
    meta: Dict[str, Any]


class PriceResponse(BaseModel):
    success: bool = True
    status: str = Field("live", description="'live', 'live_cached', or 'stale_fallback'")
    is_live: bool = Field(True, description="True if rate is live or fresh cache")
    is_stale: bool = Field(False, description="True if served as fallback after provider failure")
    is_cached: bool = Field(False, description="True if served from memory cache")
    cache_age_seconds: int = Field(0, description="Age of the cached rate in seconds")
    disclaimer: str = Field("Official market rates from The Jewellers Association (MJDTA).")
    rates: RatesContainer
    gold: Dict[str, Any]
    silver: Dict[str, Any]
    timestamp: str

    model_config = ConfigDict(populate_by_name=True)
