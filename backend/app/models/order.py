import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from sqlalchemy import (
    String,
    DateTime,
    Numeric,
    Integer,
    Text,
    ForeignKey,
    func
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..db.base import Base
from .product import Product


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )
    order_number: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True,
        nullable=False,
    )
    customer_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("customers.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    customer_name: Mapped[str] = mapped_column(
        String(255),
        index=True,
        nullable=False,
    )
    phone: Mapped[str] = mapped_column(
        String(50),
        index=True,
        nullable=False,
    )
    alternate_phone: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
        default=None,
    )
    email: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        default=None,
    )
    product_sku: Mapped[str] = mapped_column(
        String(50),
        index=True,
        nullable=False,
    )
    product_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    product_image: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
        default=None,
    )
    unit_price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=Decimal("0.00"),
    )
    quantity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
    subtotal: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(12, 2),
        nullable=True,
        default=Decimal("0.00"),
    )
    discount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=Decimal("0.00"),
    )
    tax: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=Decimal("0.00"),
    )
    delivery_charge: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(12, 2),
        nullable=True,
        default=Decimal("0.00"),
    )
    total_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=Decimal("0.00"),
    )
    channel: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="Online",
    )
    payment_method: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="COD",
    )
    payment_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="pending",
    )
    order_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="Pending Payment",
    )
    razorpay_order_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        default=None,
        index=True,
    )
    razorpay_payment_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        default=None,
        index=True,
    )
    razorpay_signature: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        default=None,
    )
    city: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        default="Madurai",
    )
    state: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        default=None,
    )
    pin_code: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True,
        default=None,
    )
    delivery_address: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        default=None,
    )
    notes: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        default=None,
    )
    coupon_code: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
        default=None,
    )
    idempotency_key: Mapped[Optional[str]] = mapped_column(
        String(64),
        nullable=True,
        index=True,
    )
    guest_token_hash: Mapped[Optional[str]] = mapped_column(
        String(64),
        nullable=True,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    items: Mapped[List["OrderItem"]] = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
        order_by="OrderItem.created_at",
    )
    payments: Mapped[List["Payment"]] = relationship(
        "Payment",
        back_populates="order",
        cascade="all, delete-orphan",
        order_by="Payment.created_at",
    )

    def __repr__(self) -> str:
        return f"<Order(order_number='{self.order_number}', customer='{self.customer_name}', total={self.total_amount})>"


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )
    order_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("orders.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    product_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("products.id", ondelete="SET NULL"),
        index=True,
        nullable=True,
    )
    product_sku: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    product_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    product_image: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
        default=None,
    )
    purity: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
        default=None,
    )
    weight_grams: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(10, 3),
        nullable=True,
        default=None,
    )
    unit_price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=Decimal("0.00"),
    )
    quantity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
    subtotal: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=Decimal("0.00"),
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    order: Mapped["Order"] = relationship("Order", back_populates="items")
    product: Mapped[Optional[Product]] = relationship(Product)

    def __repr__(self) -> str:
        return f"<OrderItem(sku='{self.product_sku}', qty={self.quantity}, subtotal={self.subtotal})>"


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )
    order_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("orders.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    provider: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    provider_order_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        index=True,
        nullable=True,
        default=None,
    )
    provider_payment_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        default=None,
    )
    amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )
    currency: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="INR",
    )
    payment_method: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="COD",
    )
    payment_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="pending",
    )
    signature: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        default=None,
    )
    error_message: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        default=None,
    )
    refund_status: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
        default=None,
    )
    refund_amount: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(12, 2),
        nullable=True,
        default=None,
    )
    refund_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        default=None,
    )
    refund_reason: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        default=None,
    )
    refunded_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=None,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    order: Mapped["Order"] = relationship("Order", back_populates="payments")

    def __repr__(self) -> str:
        return f"<Payment(provider='{self.provider}', amount={self.amount}, status='{self.payment_status}')>"
