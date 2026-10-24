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
    gold22k: str = Field(..., description="Standard 22K (916) jewellery rate per gram formatted e.g. 13,751")
    gold24k: str = Field(..., description="Pure 24K (999) bullion rate per gram formatted e.g. 15,001")
    gold18k: str = Field(..., description="18K jewellery rate per gram formatted e.g. 11,250")
    silver1g: str = Field(..., description="925 sterling silver rate per gram formatted e.g. 200.00")
    silver999: str = Field(..., description="Pure 999 fine silver rate per gram formatted e.g. 216.17")
    change: Optional[str] = Field(None, description="24h price movement formatted e.g. '+ ₹32' or '- ₹26'")
    isUp: bool = Field(True, description="True if price moved up or remained neutral")
    lastUpdated: str = Field(..., description="Display timestamp formatted in IST")


class RawRates(BaseModel):
    gold24k_buy: float
    gold24k_sell: float
    gold22k_buy: float
    gold18k_buy: float
    silver999_buy: float
    silver999_sell: float
    silver925_buy: float
    change_pct: Optional[float] = None
    change_amount_22k: Optional[float] = None
    is_up: bool = True
    timestamp: str


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
    disclaimer: str = Field("Live spot benchmark rates from OroPocket (24K Gold & 999 Silver). Jewellery retail prices calculated per gram.")
    rates: RatesContainer
    gold: Dict[str, Any]
    silver: Dict[str, Any]
    timestamp: str

    model_config = ConfigDict(populate_by_name=True)
