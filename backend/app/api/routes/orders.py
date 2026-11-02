import random
import uuid
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ...db.session import get_db
from ...models.admin_user import AdminUser
from ...models.product import Product
from ...models.order import Order
from ...schemas.order import OrderCreate, OrderStatusUpdate, OrderPublic
from ..deps import get_current_admin
from ...services.product_service import get_product_by_id_or_sku

router = APIRouter(prefix="/admin/orders", tags=["Admin Orders"])


def generate_unique_order_number(db: Session) -> str:
    """Generate a unique order number formatted like VR-2024-XXXXX or VR-2026-XXXXX."""
    year = datetime.now().year
    for _ in range(50):
        candidate = f"VR-{year}-{random.randint(10000, 99999)}"
        exists = db.query(Order).filter(Order.order_number == candidate).first()
        if not exists:
            return candidate
    return f"VR-{year}-{int(datetime.now().timestamp())}"


@router.get("", response_model=List[OrderPublic])
async def list_orders(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """Retrieve all customer orders from the database, newest first."""
    orders = db.query(Order).order_by(desc(Order.created_at)).all()
    return [OrderPublic.model_validate(o) for o in orders]


@router.post("", response_model=OrderPublic, status_code=status.HTTP_201_CREATED)
async def create_new_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Create a new customer order with authoritative server-calculated pricing,
    product validation from the database, and persistent storage.
    """
    # 1. Authoritative product lookup
    product = get_product_by_id_or_sku(db, payload.product_sku, include_inactive=True)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"success": False, "error": f"Product with SKU '{payload.product_sku}' not found in inventory."}
        )

    # 2. Authoritative calculations
    unit_price = Decimal(str(product.price))
    quantity = payload.quantity
    subtotal = unit_price * quantity
    discount = Decimal(str(payload.discount))

    # Calculate 3% standard jewellery GST if tax not provided
    if payload.tax is not None:
        tax = Decimal(str(payload.tax))
    else:
        tax = (subtotal * Decimal("0.03")).quantize(Decimal("1.00"))

    total_amount = max(Decimal("0.00"), subtotal - discount + tax)

    # 3. Generate unique order number
    order_number = generate_unique_order_number(db)

    # 4. Resolve primary image for order line
    primary_image = product.image_url
    if not primary_image and product.images and len(product.images) > 0:
        primary_image = product.images[0]

    # 5. Create Order record
    new_order = Order(
        order_number=order_number,
        customer_name=payload.customer_name.strip(),
        phone=payload.phone.strip(),
        email=payload.email.strip() if payload.email else None,
        product_sku=product.sku,
        product_name=product.name,
        product_image=primary_image,
        unit_price=unit_price,
        quantity=quantity,
        discount=discount,
        tax=tax,
        total_amount=total_amount,
        channel=payload.channel,
        payment_method=payload.payment_method,
        payment_status=payload.payment_status,
        order_status=payload.order_status,
        city=payload.city or "Madurai",
        delivery_address=payload.delivery_address or f"{payload.city or 'Madurai'}, Tamil Nadu",
        notes=payload.notes.strip() if payload.notes else None,
    )

    db.add(new_order)

    # If it's a unique 1-of-1 piece, update its status to sold to protect against duplicate sales
    if product.item_type == "unique" and payload.payment_status == "paid":
        product.status = "sold_showroom" if payload.channel == "Showroom" else "sold"

    db.commit()
    db.refresh(new_order)

    return OrderPublic.model_validate(new_order)


@router.patch("/{order_id_or_number}/status", response_model=OrderPublic)
@router.put("/{order_id_or_number}/status", response_model=OrderPublic)
async def update_order_status(
    order_id_or_number: str,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Update the status of an order by its UUID id or order_number (e.g. VR-2026-90750).
    Optionally appends a note / audit log entry.
    """
    order = None
    try:
        val_uuid = uuid.UUID(order_id_or_number)
        order = db.query(Order).filter(Order.id == val_uuid).first()
    except (ValueError, AttributeError):
        pass

    if not order:
        order = db.query(Order).filter(Order.order_number == order_id_or_number).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"success": False, "error": f"Order '{order_id_or_number}' not found."}
        )

    order.order_status = payload.status.strip().lower()
    if payload.notes:
        existing_notes = order.notes or ""
        order.notes = f"{existing_notes}\n[{datetime.now().strftime('%Y-%m-%d %H:%M')}: {payload.notes}]".strip()

    db.commit()
    db.refresh(order)

    return OrderPublic.model_validate(order)
