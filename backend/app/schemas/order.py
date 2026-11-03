from pydantic import BaseModel, Field, ConfigDict, computed_field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid


class OrderItemPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: uuid.UUID
    product_sku: str = Field(alias="productSku")
    product_name: str = Field(alias="productName")
    product_image: Optional[str] = Field(None, alias="productImage")
    purity: Optional[str] = None
    weight_grams: Optional[float] = Field(None, alias="weightGrams")
    unit_price: float = Field(alias="unitPrice")
    quantity: int
    subtotal: float


class PaymentPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: uuid.UUID
    provider: str
    provider_order_id: Optional[str] = Field(None, alias="providerOrderId")
    provider_payment_id: Optional[str] = Field(None, alias="providerPaymentId")
    amount: float
    currency: str = "INR"
    payment_method: str = Field(alias="paymentMethod")
    payment_status: str = Field(alias="paymentStatus")
    created_at: datetime = Field(alias="createdAt")


class OrderCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    customer_name: str = Field(..., min_length=1, max_length=255, alias="customerName")
    phone: str = Field(..., min_length=1, max_length=50)
    email: Optional[str] = Field(None, max_length=255)
    alternate_phone: Optional[str] = Field(None, max_length=50, alias="alternatePhone")
    product_sku: str = Field(..., min_length=1, max_length=50, alias="productSku")
    quantity: int = Field(default=1, ge=1)
    discount: float = Field(default=0.0, ge=0.0)
    tax: Optional[float] = Field(default=None, ge=0.0)
    channel: str = Field(default="Showroom", max_length=50)
    payment_method: str = Field(default="UPI", max_length=50, alias="paymentMethod")
    payment_status: str = Field(default="paid", max_length=50, alias="paymentStatus")
    order_status: str = Field(default="processing", max_length=50, alias="orderStatus")
    city: Optional[str] = Field(default="Madurai", max_length=100)
    state: Optional[str] = Field(default=None, max_length=100)
    pin_code: Optional[str] = Field(default=None, max_length=20, alias="pinCode")
    delivery_address: Optional[str] = Field(default=None, alias="deliveryAddress")
    notes: Optional[str] = None


class OrderStatusUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    status: str = Field(..., min_length=1, max_length=50)
    notes: Optional[str] = None


class OrderPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: uuid.UUID
    order_number: str
    customer_id: Optional[uuid.UUID] = None
    customer_name: str
    phone: str
    alternate_phone: Optional[str] = None
    email: Optional[str] = None
    product_sku: str
    product_name: str
    product_image: Optional[str] = None
    unit_price: float
    quantity: int
    subtotal: Optional[float] = None
    discount: float
    tax: float
    delivery_charge: Optional[float] = 0.0
    total_amount: float
    channel: str
    payment_method: str
    payment_status: str
    order_status: str
    city: Optional[str] = None
    state: Optional[str] = None
    pin_code: Optional[str] = None
    delivery_address: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemPublic] = []
    payments: List[PaymentPublic] = []

    @computed_field
    def orderNumber(self) -> str:
        return self.order_number

    @computed_field
    def customerName(self) -> str:
        return self.customer_name

    @computed_field
    def productSku(self) -> str:
        return self.product_sku

    @computed_field
    def productName(self) -> str:
        return self.product_name

    @computed_field
    def productImage(self) -> Optional[str]:
        return self.product_image

    @computed_field
    def unitPrice(self) -> float:
        return self.unit_price

    @computed_field
    def totalAmount(self) -> float:
        return self.total_amount

    @computed_field
    def paymentMethod(self) -> str:
        return self.payment_method

    @computed_field
    def paymentStatus(self) -> str:
        return self.payment_status

    @computed_field
    def orderStatus(self) -> str:
        return self.order_status

    @computed_field
    def status(self) -> str:
        return self.order_status

    @computed_field
    def deliveryAddress(self) -> Optional[str]:
        return self.delivery_address

    @computed_field
    def receivedDate(self) -> str:
        return self.created_at.strftime("%d %b %Y")

    @computed_field
    def receivedTime(self) -> str:
        return self.created_at.strftime("%I:%M %p")

    @computed_field
    def receivedAt(self) -> str:
        return self.created_at.isoformat()

    @computed_field
    def productPrice(self) -> str:
        return f"₹ {int(self.unit_price):,}"

    @computed_field
    def numericPrice(self) -> float:
        return self.unit_price


# --- Checkout & Payment Schemas ---

class CheckoutItemDetail(BaseModel):
    product_id: uuid.UUID
    sku: str
    name: str
    image: Optional[str] = None
    purity: Optional[str] = None
    gross_weight: Optional[str] = None
    item_type: str = "unique"
    quantity: int
    unit_price: float
    subtotal: float
    available: bool = True
    error: Optional[str] = None


class CheckoutQuoteResponse(BaseModel):
    subtotal: float
    tax: float
    delivery_charge: float
    discount: float
    total_amount: float
    item_count: int
    items: List[CheckoutItemDetail]
    available_payment_methods: List[Dict[str, Any]]
    can_proceed: bool
    validation_errors: List[str] = []


class CheckoutOrderCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    customer_name: str = Field(..., min_length=2, max_length=255, alias="customerName")
    phone: str = Field(..., min_length=10, max_length=15)
    alternate_phone: Optional[str] = Field(None, max_length=15, alias="alternatePhone")
    email: Optional[str] = Field(None, max_length=255)
    delivery_address: str = Field(..., min_length=5, alias="deliveryAddress")
    city: str = Field(..., min_length=2, max_length=100)
    state: str = Field(..., min_length=2, max_length=100)
    pin_code: str = Field(..., min_length=6, max_length=10, alias="pinCode")
    payment_method: str = Field(default="COD", alias="paymentMethod")
    notes: Optional[str] = None
    idempotency_key: Optional[str] = Field(None, alias="idempotencyKey")


class CheckoutOrderResponse(BaseModel):
    success: bool
    order_number: Optional[str] = None
    order_token: Optional[str] = None
    total_amount: Optional[float] = None
    payment_method: Optional[str] = None
    payment_status: Optional[str] = None
    order_status: Optional[str] = None
    payment_gateway_payload: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class PaymentVerificationRequest(BaseModel):
    order_number: str
    provider: str = "razorpay"
    provider_order_id: Optional[str] = None
    provider_payment_id: Optional[str] = None
    signature: Optional[str] = None


class PaymentVerificationResponse(BaseModel):
    success: bool
    payment_status: str
    order_status: str
    error: Optional[str] = None
