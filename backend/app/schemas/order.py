from pydantic import BaseModel, Field, ConfigDict, computed_field
from typing import Optional
from datetime import datetime
import uuid


class OrderCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    customer_name: str = Field(..., min_length=1, max_length=255, alias="customerName")
    phone: str = Field(..., min_length=7, max_length=50)
    email: Optional[str] = Field(None, max_length=255)
    product_sku: str = Field(..., min_length=1, max_length=50, alias="productSku")
    quantity: int = Field(default=1, ge=1)
    discount: float = Field(default=0.0, ge=0.0)
    tax: Optional[float] = Field(default=None, ge=0.0)
    channel: str = Field(default="Showroom", max_length=50)
    payment_method: str = Field(default="UPI", max_length=50, alias="paymentMethod")
    payment_status: str = Field(default="paid", max_length=50, alias="paymentStatus")
    order_status: str = Field(default="processing", max_length=50, alias="orderStatus")
    city: Optional[str] = Field(default="Madurai", max_length=100)
    delivery_address: Optional[str] = Field(default=None, alias="deliveryAddress")
    notes: Optional[str] = None


class OrderPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: uuid.UUID
    order_number: str
    customer_name: str
    phone: str
    email: Optional[str] = None
    product_sku: str
    product_name: str
    product_image: Optional[str] = None
    unit_price: float
    quantity: int
    discount: float
    tax: float
    total_amount: float
    channel: str
    payment_method: str
    payment_status: str
    order_status: str
    city: Optional[str] = None
    delivery_address: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

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
