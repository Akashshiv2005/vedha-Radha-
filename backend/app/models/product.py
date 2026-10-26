import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import (
    String,
    Boolean,
    DateTime,
    Numeric,
    Integer,
    Text,
    CheckConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
from ..db.base import Base


class Product(Base):
    __tablename__ = "products"
    __table_args__ = (
        CheckConstraint("price >= 0", name="chk_product_price_non_negative"),
        CheckConstraint("stock_quantity >= 0", name="chk_product_stock_non_negative"),
        CheckConstraint(
            "item_type IN ('unique', 'regular')",
            name="chk_product_item_type",
        ),
        CheckConstraint(
            "status IN ('available', 'reserved', 'sold', 'sold_showroom', 'unavailable')",
            name="chk_product_status",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )
    sku: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True,
        nullable=False,
    )
    name: Mapped[str] = mapped_column(
        String(255),
        index=True,
        nullable=False,
    )
    subtitle: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        default=None,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        default=None,
    )
    product_type: Mapped[str | None] = mapped_column(
        String(50),
        index=True,
        nullable=True,
        default=None,
    )
    category: Mapped[str] = mapped_column(
        String(100),
        index=True,
        nullable=False,
    )
    sub_category: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        default=None,
    )
    sub_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        default=None,
    )
    occasion: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        default=None,
    )
    item_type: Mapped[str] = mapped_column(
        String(20),
        default="unique",
        nullable=False,
    )
    price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )
    status: Mapped[str] = mapped_column(
        String(30),
        default="available",
        nullable=False,
    )
    image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
        default=None,
    )
    images: Mapped[list[str] | None] = mapped_column(
        JSONB,
        nullable=True,
        default=list,
    )
    stock_quantity: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
    )
    purity: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        default=None,
    )
    gross_weight: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        default=None,
    )
    net_weight: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        default=None,
    )
    hallmark_details: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        default=None,
    )
    location: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        default=None,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
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

    def __repr__(self) -> str:
        return f"<Product(sku='{self.sku}', name='{self.name}', price={self.price})>"
