import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional
from sqlalchemy import (
    String,
    Boolean,
    DateTime,
    Numeric,
    Integer,
    func
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from ..db.base import Base


class Coupon(Base):
    __tablename__ = "coupons"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )
    code: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True,
        nullable=False,
    )
    discount_type: Mapped[str] = mapped_column(
        String(20),
        default="percentage",  # 'percentage' or 'fixed'
        nullable=False,
    )
    discount_value: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )
    min_order_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=Decimal("0.00"),
        nullable=False,
    )
    max_discount_amount: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(12, 2),
        nullable=True,
        default=None,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    valid_from: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    valid_until: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=None,
    )
    times_used: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    description: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        default=None,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    def is_valid(self, subtotal: Decimal) -> tuple[bool, Optional[str]]:
        now = datetime.now(timezone.utc)
        if not self.is_active:
            return False, f"Coupon '{self.code}' is no longer active."
        if self.valid_from and self.valid_from > now:
            return False, f"Coupon '{self.code}' is not yet active."
        if self.valid_until and self.valid_until < now:
            return False, f"Coupon '{self.code}' has expired."
        if subtotal < self.min_order_amount:
            return False, f"Coupon '{self.code}' requires a minimum order subtotal of ₹{int(self.min_order_amount):,}."
        return True, None

    def calculate_discount(self, subtotal: Decimal) -> Decimal:
        if self.discount_type == "percentage":
            discount = (subtotal * (self.discount_value / Decimal("100"))).quantize(Decimal("1.00"))
            if self.max_discount_amount and discount > self.max_discount_amount:
                discount = self.max_discount_amount
            return min(discount, subtotal)
        else:  # fixed
            discount = min(self.discount_value, subtotal)
            return discount.quantize(Decimal("1.00"))

    def __repr__(self) -> str:
        return f"<Coupon(code='{self.code}', type='{self.discount_type}', value={self.discount_value})>"

