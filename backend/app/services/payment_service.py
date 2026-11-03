import hmac
import hashlib
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from ..models.order import Order, Payment
from ..models.product import Product
from ..core.config import settings


def create_gateway_order(order: Order, db: Session) -> Dict[str, Any]:
    """
    Initialize payment order with online gateway (e.g. Razorpay).
    If credentials are not configured in .env, returns explicit status without simulated success.
    """
    if not (settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error": "Online payment gateway is unconfigured. RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required.",
                "requires_credentials": True,
            },
        )

    try:
        import razorpay
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        amount_paisa = int(order.total_amount * 100)
        
        razorpay_order = client.order.create({
            "amount": amount_paisa,
            "currency": "INR",
            "receipt": order.order_number,
            "notes": {
                "order_number": order.order_number,
                "customer_name": order.customer_name,
            }
        })

        # Update payment record with provider order id
        payment = db.query(Payment).filter(Payment.order_id == order.id).first()
        if payment:
            payment.provider_order_id = razorpay_order.get("id")
            db.commit()

        return {
            "key_id": settings.RAZORPAY_KEY_ID,
            "razorpay_order_id": razorpay_order.get("id"),
            "amount": amount_paisa,
            "currency": "INR",
            "order_number": order.order_number,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Payment gateway error: {str(e)}",
        )


def verify_gateway_payment(
    order_number: str,
    razorpay_order_id: str,
    razorpay_payment_id: str,
    signature: str,
    db: Session,
) -> Dict[str, Any]:
    """
    Strict cryptographic verification of online payment signatures.
    Never trusts client input; validates HMAC SHA-256 before confirming order and deducting inventory.
    """
    if not (settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment gateway credentials not configured.",
        )

    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order '{order_number}' not found.",
        )

    payment = db.query(Payment).filter(Payment.order_id == order.id).first()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment record for order not found.",
        )

    # Validate HMAC SHA-256 signature
    msg = f"{razorpay_order_id}|{razorpay_payment_id}".encode("utf-8")
    expected_signature = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode("utf-8"),
        msg,
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected_signature, signature.strip()):
        payment.payment_status = "failed"
        payment.error_message = "Cryptographic signature verification mismatch."
        order.order_status = "Payment Failed"
        db.commit()
        return {
            "success": False,
            "payment_status": "failed",
            "order_status": "Payment Failed",
            "error": "Payment verification failed: invalid signature.",
        }

    # Verified Payment: atomically update payment, order status and deduct inventory
    payment.payment_status = "paid"
    payment.provider_order_id = razorpay_order_id
    payment.provider_payment_id = razorpay_payment_id
    payment.signature = signature

    order.payment_status = "paid"
    order.order_status = "Confirmed"

    # Deduct stock for all order items
    for item in order.items:
        if item.product_id:
            prod = db.query(Product).filter(Product.id == item.product_id).with_for_update().first()
            if prod:
                if prod.item_type == "unique":
                    prod.status = "sold"
                    prod.stock_quantity = 0
                else:
                    prod.stock_quantity = max(0, prod.stock_quantity - item.quantity)
                    if prod.stock_quantity == 0:
                        prod.status = "unavailable"

    db.commit()
    db.refresh(order)

    return {
        "success": True,
        "payment_status": "paid",
        "order_status": "Confirmed",
    }

