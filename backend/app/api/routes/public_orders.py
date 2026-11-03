from typing import Optional, List
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ...db.session import get_db
from ...models.order import Order
from ...models.customer import Customer
from ...schemas.checkout import OrderDetailResponse
from ...api.deps import get_current_customer, get_optional_customer
from ...services.checkout_service import verify_order_access

router = APIRouter(prefix="/orders", tags=["Storefront Orders"])


@router.get("", response_model=List[OrderDetailResponse])
def list_my_orders(
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    """
    Retrieve all past orders placed by the currently authenticated customer.
    """
    orders = (
        db.query(Order)
        .filter(Order.customer_id == customer.id)
        .order_by(desc(Order.created_at))
        .all()
    )
    return [
        OrderDetailResponse(
            id=o.id,
            order_number=o.order_number,
            customer_name=o.customer_name,
            phone=o.phone,
            alternate_phone=o.alternate_phone,
            email=o.email,
            shipping_address=o.delivery_address,
            city=o.city,
            state=o.state,
            pin_code=o.pin_code,
            subtotal=float(o.subtotal or 0.0),
            tax_amount=float(o.tax or 0.0),
            delivery_charge=float(o.delivery_charge or 0.0),
            discount_amount=float(o.discount or 0.0),
            total_amount=float(o.total_amount),
            payment_method=o.payment_method,
            payment_status=o.payment_status,
            order_status=o.order_status,
            created_at=o.created_at,
            updated_at=o.updated_at,
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
                for it in o.items
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
                for p in o.payments
            ],
        )
        for o in orders
    ]


@router.get("/{order_number}", response_model=OrderDetailResponse)
def get_order_by_number(
    order_number: str,
    x_order_token: Optional[str] = Header(None, alias="X-Order-Token"),
    db: Session = Depends(get_db),
    customer: Optional[Customer] = Depends(get_optional_customer),
):
    """
    Retrieve order details securely.
    Requires either customer account ownership or a valid unguessable guest order access token.
    Prevents enumeration through sequential order numbers alone.
    """
    order = db.query(Order).filter(Order.order_number == order_number.strip()).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order '{order_number}' not found.",
        )

    has_access = verify_order_access(order, db, x_order_token, customer)
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You do not have permission to view this order.",
        )

    return OrderDetailResponse(
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
    )


@router.get("/{order_number}/status")
def get_order_status(
    order_number: str,
    x_order_token: Optional[str] = Header(None, alias="X-Order-Token"),
    db: Session = Depends(get_db),
    customer: Optional[Customer] = Depends(get_optional_customer),
):
    """
    Get lightweight order status for tracking without exposing customer sensitive data.
    """
    order = db.query(Order).filter(Order.order_number == order_number.strip()).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order '{order_number}' not found.",
        )

    # Basic tracking info is accessible
    return {
        "order_number": order.order_number,
        "payment_status": order.payment_status,
        "order_status": order.order_status,
        "total_amount": float(order.total_amount),
        "updated_at": order.updated_at,
    }

