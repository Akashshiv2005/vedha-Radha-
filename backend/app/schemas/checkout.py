import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict, computed_field


class CustomerDetailsSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    customer_name: str = Field(..., min_length=2, max_length=255, alias="customerName")
    mobile_number: str = Field(..., min_length=10, max_length=15, alias="mobileNumber")
    email: Optional[str] = Field(None, max_length=255)
    alternative_mobile_number: Optional[str] = Field(None, max_length=15, alias="alternativeMobileNumber")


class DeliveryAddressSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    full_address: str = Field(..., min_length=5, alias="fullAddress")
    city: str = Field(..., min_length=2, max_length=100)
    state: str = Field(..., min_length=2, max_length=100)
    pin_code: str = Field(..., min_length=6, max_length=10, alias="pinCode")
    delivery_instructions: Optional[str] = Field(None, alias="deliveryInstructions")


class CheckoutQuoteItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    product_id: uuid.UUID
    sku: str
    name: str
    image: Optional[str] = None
    purity: Optional[str] = None
    weight: Optional[str] = None
    quantity: int
    unit_price: float
    subtotal: float
    item_type: str = "unique"
    available: bool = True
    error: Optional[str] = None


class PaymentProviderStatus(BaseModel):
    provider: str
    display_name: str
    is_available: bool
    requires_credentials: bool = False
    message: Optional[str] = None


class CheckoutQuoteResponse(BaseModel):
    subtotal: float
    tax: float
    delivery_charge: float
    discount: float
    total_amount: float
    item_count: int
    items: List[CheckoutQuoteItem]
    available_payment_methods: List[PaymentProviderStatus]
    can_proceed: bool
    validation_errors: List[str] = []


class CreateOrderRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    customer: CustomerDetailsSchema
    delivery: DeliveryAddressSchema
    payment_method: str = Field(default="COD", alias="paymentMethod")  # 'COD', 'SHOWROOM_PAY', 'RAZORPAY'
    idempotency_key: Optional[str] = Field(None, alias="idempotencyKey")
    notes: Optional[str] = None


class OrderItemPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: uuid.UUID
    product_sku: str
    product_name: str
    product_image: Optional[str] = None
    purity: Optional[str] = None
    weight_grams: Optional[float] = None
    unit_price: float
    quantity: int
    subtotal: float


class PaymentPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: uuid.UUID
    provider: str
    provider_order_id: Optional[str] = None
    provider_payment_id: Optional[str] = None
    amount: float
    currency: str = "INR"
    payment_method: str
    payment_status: str
    created_at: datetime


class OrderDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: uuid.UUID
    order_number: str
    customer_name: str
    phone: str
    alternate_phone: Optional[str] = None
    email: Optional[str] = None
    shipping_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pin_code: Optional[str] = None
    subtotal: float
    tax_amount: float
    delivery_charge: float
    discount_amount: float
    total_amount: float
    payment_method: str
    payment_status: str
    order_status: str
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemPublic] = []
    payments: List[PaymentPublic] = []
    order_token: Optional[str] = None


class PaymentVerifyRequest(BaseModel):
    order_number: str
    provider: str = "razorpay"
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    razorpay_signature: Optional[str] = None

