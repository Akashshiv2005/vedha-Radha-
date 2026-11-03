import uuid
from typing import Optional
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from ...db.session import get_db
from ...schemas.checkout import (
    CheckoutQuoteResponse,
    CreateOrderRequest,
    OrderDetailResponse,
)
from ...models.customer import Customer
from ...api.deps import get_optional_customer
from ...services.cart_service import get_cart_by_token
from ...services.checkout_service import (
    get_checkout_quote,
    create_order_from_cart,
)

router = APIRouter(prefix="/checkout", tags=["Storefront Checkout"])


@router.post("/validate", response_model=CheckoutQuoteResponse)
def validate_checkout(
    x_cart_token: Optional[str] = Header(None, alias="X-Cart-Token"),
    db: Session = Depends(get_db),
):
    """
    Validate shopping cart availability, product statuses, and quantity limits prior to purchasing.
    """
    if not x_cart_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing cart token header (X-Cart-Token).",
        )

    cart = get_cart_by_token(db, x_cart_token)
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active shopping cart not found.",
        )

    return get_checkout_quote(cart, db)


@router.post("/quote", response_model=CheckoutQuoteResponse)
def get_quote(
    x_cart_token: Optional[str] = Header(None, alias="X-Cart-Token"),
    db: Session = Depends(get_db),
):
    """
    Retrieve authoritative pricing, breakdown of 3% jewellery GST, complimentary delivery,
    and verified payment methods for current shopping cart.
    """
    if not x_cart_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing cart token header (X-Cart-Token).",
        )

    cart = get_cart_by_token(db, x_cart_token)
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active shopping cart not found.",
        )

    return get_checkout_quote(cart, db)


@router.post("/create-order", response_model=OrderDetailResponse, status_code=status.HTTP_201_CREATED)
def place_order(
    payload: CreateOrderRequest,
    x_cart_token: Optional[str] = Header(None, alias="X-Cart-Token"),
    db: Session = Depends(get_db),
    customer: Optional[Customer] = Depends(get_optional_customer),
):
    """
    Submit customer and delivery details to place an official order from the shopping cart.
    - Operates for both guests and authenticated customers.
    - Atomically locks inventory and enforces unique jewellery single-buyer guarantees.
    - Returns order details and secure access token for tracking.
    """
    if not x_cart_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing cart token header (X-Cart-Token).",
        )

    cart = get_cart_by_token(db, x_cart_token)
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shopping cart not found or expired.",
        )

    order, guest_token = create_order_from_cart(cart, payload, db, customer)

    # Format response
    response_data = OrderDetailResponse(
        id=order.id,
        order_number=order.order_number,
        customer_name=order.customer_name,
        phone=order.phone,
        alternate_phone=order.alternate_phone,
        email=order.email,
        shipping_address=order.delivery_address,
        city=order.city,
        state=order.state,
        pin_code=order.pin_code,
        subtotal=float(order.subtotal or 0.0),
        tax_amount=float(order.tax or 0.0),
        delivery_charge=float(order.delivery_charge or 0.0),
        discount_amount=float(order.discount or 0.0),
        total_amount=float(order.total_amount),
        payment_method=order.payment_method,
        payment_status=order.payment_status,
        order_status=order.order_status,
        created_at=order.created_at,
        updated_at=order.updated_at,
        items=[
            {
                "id": it.id,
                "product_sku": it.product_sku,
                "product_name": it.product_name,
                "product_image": it.product_image,
                "purity": it.purity,
                "weight_grams": float(it.weight_grams) if it.weight_grams else None,
                "unit_price": float(it.unit_price),
                "quantity": it.quantity,
                "subtotal": float(it.subtotal),
            }
            for it in order.items
        ],
        payments=[
            {
                "id": p.id,
                "provider": p.provider,
                "provider_order_id": p.provider_order_id,
                "provider_payment_id": p.provider_payment_id,
                "amount": float(p.amount),
                "currency": p.currency,
                "payment_method": p.payment_method,
                "payment_status": p.payment_status,
                "created_at": p.created_at,
            }
            for p in order.payments
        ],
        order_token=guest_token,
    )
    return response_data

