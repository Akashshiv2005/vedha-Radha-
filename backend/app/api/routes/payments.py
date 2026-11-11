from decimal import Decimal
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from ...db.session import get_db
from ...core.config import settings
from ...models.order import Order, OrderItem, Payment
from ...models.product import Product
from ...schemas.checkout import PaymentVerifyRequest
from ...services.payment_service import (
    create_gateway_order,
    verify_gateway_payment,
)
from ...services.checkout_service import generate_unique_order_number, generate_guest_order_token
from ...services.product_service import get_product_by_id_or_sku

router = APIRouter(prefix="/payments", tags=["Payment Gateway"])


class PaymentCreateRequest(BaseModel):
    order_number: str


class CartItemPayload(BaseModel):
    sku: str = Field(..., min_length=1)
    quantity: int = Field(default=1, ge=1)


class CreatePaymentOrderRequest(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=255)
    phone: str = Field(..., min_length=7, max_length=50)
    email: Optional[str] = Field(None, max_length=255)
    city: Optional[str] = Field(default="Madurai", max_length=100)
    delivery_address: Optional[str] = Field(default=None)
    items: List[CartItemPayload] = Field(..., min_length=1)
    notes: Optional[str] = None


@router.get("/config")
def get_payment_config():
    """
    Return public Razorpay configuration for frontend integration.
    """
    return {
        "success": True,
        "key_id": settings.RAZORPAY_KEY_ID or "",
        "currency": getattr(settings, "RAZORPAY_CURRENCY", "INR"),
    }


@router.post("/create")
def create_payment(
    payload: PaymentCreateRequest,
    db: Session = Depends(get_db),
):
    """
    Initialize an online payment order with Razorpay.
    Verifies that the order exists and generates gateway order credentials.
    """
    order = db.query(Order).filter(Order.order_number == payload.order_number.strip()).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order '{payload.order_number}' not found.",
        )

    return create_gateway_order(order, db)


@router.post("/create-order", status_code=status.HTTP_201_CREATED)
def create_direct_payment_order(
    payload: CreatePaymentOrderRequest,
    db: Session = Depends(get_db),
):
    """
    Direct payment order creation from cart items (drawer or quick checkout):
    1. Validates items availability and calculates subtotal + 3% GST.
    2. Atomically persists Order and OrderItems in 'Pending Payment' status.
    3. Calls Razorpay gateway to generate order ID and returns checkout metadata.
    """
    if not (settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error": "Razorpay keys (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) are unconfigured in backend environment.",
            },
        )

    subtotal = Decimal("0.00")
    total_qty = 0
    resolved_items = []

    for it in payload.items:
        prod = get_product_by_id_or_sku(db, it.sku.strip(), include_inactive=False)
        if not prod:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product SKU '{it.sku}' not found or unavailable."
            )
        if prod.item_type == "unique" and prod.status in ["sold", "sold_showroom", "unavailable"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product '{prod.name}' (SKU: {prod.sku}) is already sold or unavailable."
            )
        unit_price = Decimal(str(prod.price))
        line_subtotal = unit_price * it.quantity
        subtotal += line_subtotal
        total_qty += it.quantity
        resolved_items.append((prod, it.quantity, unit_price, line_subtotal))

    if subtotal <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order subtotal must be greater than zero."
        )

    tax = (subtotal * Decimal("0.03")).quantize(Decimal("1.00"))
    delivery_charge = Decimal("0.00")
    total_amount = subtotal + tax + delivery_charge

    primary_prod, primary_qty, primary_price, _ = resolved_items[0]
    multi_suffix = f" + {len(resolved_items) - 1} other item(s)" if len(resolved_items) > 1 else ""
    summary_product_name = f"{primary_prod.name}{multi_suffix}"

    order_number = generate_unique_order_number(db)
    raw_guest_token, guest_token_hash = generate_guest_order_token()

    order = Order(
        order_number=order_number,
        customer_name=payload.customer_name.strip(),
        phone=payload.phone.strip(),
        email=payload.email.strip() if payload.email else None,
        delivery_address=payload.delivery_address.strip() if payload.delivery_address else f"{payload.city or 'Madurai'}, Tamil Nadu",
        city=payload.city.strip() if payload.city else "Madurai",
        state="Tamil Nadu",
        pin_code="625001",
        product_sku=primary_prod.sku,
        product_name=summary_product_name,
        product_image=primary_prod.image_url or (primary_prod.images[0] if primary_prod.images else None),
        unit_price=primary_price,
        quantity=total_qty,
        subtotal=subtotal,
        tax=tax,
        delivery_charge=delivery_charge,
        discount=Decimal("0.00"),
        total_amount=total_amount,
        channel="Online Store",
        payment_method="Razorpay",
        payment_status="pending",
        order_status="Pending Payment",
        guest_token_hash=guest_token_hash,
        notes=payload.notes.strip() if payload.notes else None,
    )
    db.add(order)
    db.flush()

    for prod, qty, u_price, l_subtotal in resolved_items:
        oi = OrderItem(
            order_id=order.id,
            product_id=prod.id,
            product_sku=prod.sku,
            product_name=prod.name,
            product_image=prod.image_url or (prod.images[0] if prod.images else None),
            purity=prod.purity,
            weight_grams=prod.gross_weight,
            unit_price=u_price,
            quantity=qty,
            subtotal=l_subtotal,
        )
        db.add(oi)

    payment = Payment(
        order_id=order.id,
        provider="razorpay",
        amount=total_amount,
        currency="INR",
        payment_method="Razorpay",
        payment_status="pending",
    )
    db.add(payment)
    db.commit()
    db.refresh(order)

    # Initialize gateway order with Razorpay
    gateway_data = create_gateway_order(order, db)
    gateway_data["order_token"] = raw_guest_token
    return gateway_data


@router.post("/verify")
def verify_payment(
    payload: PaymentVerifyRequest,
    db: Session = Depends(get_db),
):
    """
    Cryptographically verify gateway response tokens and complete the transaction.
    """
    if not payload.razorpay_order_id or not payload.razorpay_payment_id or not payload.razorpay_signature:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing required verification fields (order_id, payment_id, signature).",
        )

    res = verify_gateway_payment(
        order_number=payload.order_number,
        razorpay_order_id=payload.razorpay_order_id,
        razorpay_payment_id=payload.razorpay_payment_id,
        signature=payload.razorpay_signature,
        db=db,
    )
    return res


@router.post("/webhook")
async def payment_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Handle asynchronous server-to-server gateway webhook events.
    """
    body = await request.body()
    return {"status": "received"}
