import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import (
    String,
    DateTime,
    Numeric,
    Integer,
    Text,
    func
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from ..db.base import Base


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
    email: Mapped[str | None] = mapped_column(
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
    product_image: Mapped[str | None] = mapped_column(
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
    total_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=Decimal("0.00"),
    )
    channel: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="Showroom",
    )
    payment_method: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="UPI",
    )
    payment_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="paid",
    )
    order_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="processing",
    )
    city: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        default="Madurai",
    )
    delivery_address: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        default=None,
    )
    notes: Mapped[str | None] = mapped_column(
        Text,
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
