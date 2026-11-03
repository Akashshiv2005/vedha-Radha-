import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator, ConfigDict


class AddCartItemRequest(BaseModel):
    product_id: str = Field(..., description="Product UUID or SKU identifier")
    quantity: int = Field(1, ge=1, le=50, description="Quantity to add")

    @field_validator("product_id")
    @classmethod
    def validate_product_id(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Product identifier cannot be empty.")
        return v


class UpdateCartItemRequest(BaseModel):
    quantity: int = Field(..., ge=1, le=50, description="New quantity")


class ApplyCouponRequest(BaseModel):
    code: str = Field(..., min_length=1, max_length=50, description="Coupon promotional code")

    @field_validator("code")
    @classmethod
    def normalize_code(cls, v: str) -> str:
        code = v.strip().upper()
        if not code:
            raise ValueError("Coupon code cannot be empty.")
        return code


class CartItemResponse(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    name: str
    sku: str
    category: Optional[str] = None
    item_type: str = "unique"
    is_unique: bool = True
    unit_price_snapshot: Decimal
    current_price: Decimal
    price_changed: bool = False
    price_change_diff: Decimal = Decimal("0.00")
    quantity: int = 1
    item_subtotal: Decimal
    image_url: Optional[str] = None
    is_available: bool = True
    stock_quantity: int = 1
    details: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class CartResponse(BaseModel):
    success: bool = True
    cart_token: str
    cart_id: Optional[uuid.UUID] = None
    status: str = "active"
    items: List[CartItemResponse] = []
    item_count: int = 0
    subtotal: Decimal = Decimal("0.00")
    applied_coupon_code: Optional[str] = None
    coupon_discount: Decimal = Decimal("0.00")
    tax: Decimal = Decimal("0.00")
    delivery_charge: Decimal = Decimal("0.00")
    cart_total: Decimal = Decimal("0.00")
    has_price_changes: bool = False
    has_unavailable_items: bool = False
    coupon_details: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class CartItemSummary(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    name: str
    sku: str
    quantity: int
    current_price: Decimal
    item_subtotal: Decimal
    is_available: bool


class CartSummaryResponse(BaseModel):
    success: bool = True
    cart_token: Optional[str] = None
    item_count: int = 0
    subtotal: Decimal = Decimal("0.00")
    applied_coupon_code: Optional[str] = None
    coupon_discount: Decimal = Decimal("0.00")
    tax: Decimal = Decimal("0.00")
    delivery_charge: Decimal = Decimal("0.00")
    cart_total: Decimal = Decimal("0.00")
    is_available: bool = True
    item_summaries: List[CartItemSummary] = []
