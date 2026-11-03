from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ...db.session import get_db
from ...models.order import Order
from ...schemas.checkout import PaymentVerifyRequest
from ...services.payment_service import (
    create_gateway_order,
    verify_gateway_payment,
)

router = APIRouter(prefix="/payments", tags=["Payment Gateway"])


class PaymentCreateRequest(BaseModel):
    order_number: str


@router.post("/create")
def create_payment(
    payload: PaymentCreateRequest,
    db: Session = Depends(get_db),
):
    """
    Initialize an online payment order with the payment provider.
    Verifies that the order exists and generates gateway order credentials.
    """
    order = db.query(Order).filter(Order.order_number == payload.order_number.strip()).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order '{payload.order_number}' not found.",
        )

    return create_gateway_order(order, db)


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
    # Webhook listener boundary
    return {"status": "received"}

