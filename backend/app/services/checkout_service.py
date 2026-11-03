import uuid
import secrets
import hashlib
import random
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional, Tuple, List, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from ..models.cart import ShoppingCart, ShoppingCartItem
from ..models.product import Product
from ..models.order import Order, OrderItem, Payment
from ..models.coupon import Coupon
from ..models.customer import Customer
from ..core.config import settings
from ..schemas.checkout import (
    CheckoutQuoteItem,
    CheckoutQuoteResponse,
    PaymentProviderStatus,
    CreateOrderRequest,
)


def generate_unique_order_number(db: Session) -> str:
    """Generate a unique order number formatted like VR-2026-XXXXX."""
    year = datetime.now().year
    for _ in range(50):
        candidate = f"VR-{year}-{random.randint(10000, 99999)}"
        exists = db.query(Order).filter(Order.order_number == candidate).first()
        if not exists:
            return candidate
    return f"VR-{year}-{int(datetime.now().timestamp())}"


def generate_guest_order_token() -> Tuple[str, str]:
    """Generate a secure unguessable raw token and its SHA-256 hash."""
    raw_token = secrets.token_urlsafe(32)
    token_hash = hash_order_token(raw_token)
    return raw_token, token_hash


def hash_order_token(token: str) -> str:
    """Hash the raw order token using SHA-256."""
    return hashlib.sha256(token.strip().encode("utf-8")).hexdigest()


def get_checkout_quote(cart: ShoppingCart, db: Session) -> CheckoutQuoteResponse:
    """
    Calculate an authoritative checkout quote directly from live PostgreSQL records.
    Never trusts client prices, calculates exact 3% jewellery GST, complimentary insured shipping,
    and returns supported payment options based on backend configuration.
    """
    items_response: List[CheckoutQuoteItem] = []
    validation_errors: List[str] = []
    subtotal = Decimal("0.00")
    total_quantity = 0

    if not cart.items:
        return CheckoutQuoteResponse(
            subtotal=0.0,
            tax=0.0,
            delivery_charge=0.0,
            discount=0.0,
            total_amount=0.0,
            item_count=0,
            items=[],
            available_payment_methods=_get_available_payment_methods(),
            can_proceed=False,
            validation_errors=["Your shopping cart is currently empty."],
        )

    for item in cart.items:
        product = item.product
        if not product:
            validation_errors.append(f"An item in your cart is no longer available in the catalogue.")
            continue

        is_available = True
        error_msg = None

        if not product.is_active or product.status != "available":
            is_available = False
            error_msg = f"{product.name} is currently out of stock or reserved."
            validation_errors.append(error_msg)
        elif product.item_type == "unique" and item.quantity > 1:
            is_available = False
            error_msg = f"{product.name} is a unique jewellery piece (maximum quantity: 1)."
            validation_errors.append(error_msg)
        elif product.stock_quantity < item.quantity:
            is_available = False
            error_msg = f"Only {product.stock_quantity} available in inventory for {product.name}."
            validation_errors.append(error_msg)

        live_price = Decimal(str(product.price))
        item_subtotal = (live_price * item.quantity).quantize(Decimal("0.01"))

        if is_available:
            subtotal += item_subtotal
            total_quantity += item.quantity

        primary_image = product.image_url
        if not primary_image and product.images and len(product.images) > 0:
            primary_image = product.images[0]

        items_response.append(
            CheckoutQuoteItem(
                product_id=product.id,
                sku=product.sku,
                name=product.name,
                image=primary_image,
                purity=product.purity,
                weight=product.gross_weight,
                quantity=item.quantity,
                unit_price=float(live_price),
                subtotal=float(item_subtotal),
                item_type=product.item_type,
                available=is_available,
                error=error_msg,
            )
        )

    # Coupon discount processing
    discount = Decimal("0.00")
    if cart.applied_coupon_code:
        coupon = db.query(Coupon).filter(Coupon.code == cart.applied_coupon_code, Coupon.is_active == True).first()
        if coupon and coupon.is_valid(subtotal)[0]:
            discount = coupon.calculate_discount(subtotal)

    taxable_subtotal = max(Decimal("0.00"), subtotal - discount)
    # Jewellery Standard Tax: 3% GST (1.5% CGST + 1.5% SGST)
    tax = (taxable_subtotal * Decimal("0.03")).quantize(Decimal("1.00"))
    # High-value luxury jewellery includes complimentary insured express courier
    delivery_charge = Decimal("0.00")
    total_amount = max(Decimal("0.00"), taxable_subtotal + tax + delivery_charge)

    can_proceed = len(validation_errors) == 0 and len(items_response) > 0

    return CheckoutQuoteResponse(
        subtotal=float(subtotal),
        tax=float(tax),
        delivery_charge=float(delivery_charge),
        discount=float(discount),
        total_amount=float(total_amount),
        item_count=total_quantity,
        items=items_response,
        available_payment_methods=_get_available_payment_methods(),
        can_proceed=can_proceed,
        validation_errors=validation_errors,
    )


def _get_available_payment_methods() -> List[PaymentProviderStatus]:
    """Report real available payment methods based on server environment and business settings."""
    methods: List[PaymentProviderStatus] = []

    # 1. Cash on Delivery
    methods.append(
        PaymentProviderStatus(
            provider="COD",
            display_name="Cash on Delivery (Insured Delivery)",
            is_available=bool(settings.ENABLE_COD),
            requires_credentials=False,
            message="Pay safely upon receipt with our verified tamper-proof jewellery courier.",
        )
    )

    # 2. Pay at Showroom
    methods.append(
        PaymentProviderStatus(
            provider="SHOWROOM_PAY",
            display_name="Pay & Collect at Madurai Showroom",
            is_available=bool(settings.ENABLE_PAY_AT_SHOWROOM),
            requires_credentials=False,
            message="Complete your payment in person via Card, UPI, or Cash at our flagship showroom.",
        )
    )

    # 3. Razorpay Gateway
    has_razorpay = bool(settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET)
    methods.append(
        PaymentProviderStatus(
            provider="RAZORPAY",
            display_name="Online Payment (UPI / NetBanking / Cards)",
            is_available=has_razorpay,
            requires_credentials=not has_razorpay,
            message=(
                "Instant online payment via Razorpay."
                if has_razorpay
                else "Online payment gateway keys (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) are unconfigured in backend environment."
            ),
        )
    )

    return methods


def create_order_from_cart(
    cart: ShoppingCart,
    payload: CreateOrderRequest,
    db: Session,
    customer: Optional[Customer] = None,
) -> Tuple[Order, str]:
    """
    Atomically convert the shopping cart into an official customer order.
    Locks product records (`with_for_update`), ensures unique items are never sold twice,
    creates line item snapshots, registers payment record, and clears cart items.
    """
    # 1. Idempotency Check (handles retries / repeated clicks after cart has already been cleared)
    if payload.idempotency_key:
        existing_order = (
            db.query(Order)
            .filter(Order.idempotency_key == payload.idempotency_key.strip())
            .first()
        )
        if existing_order:
            # Return existing order
            return existing_order, ""

    if not cart.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot place order: your shopping cart is empty.",
        )

    # 2. Atomic Inventory Verification & Row Locking
    product_ids = [item.product_id for item in cart.items]
    locked_products = {
        p.id: p
        for p in db.query(Product).filter(Product.id.in_(product_ids)).with_for_update().all()
    }

    subtotal = Decimal("0.00")
    total_quantity = 0
    items_to_create = []

    for item in cart.items:
        product = locked_products.get(item.product_id)
        if not product or not product.is_active or product.status != "available":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Item '{product.name if product else 'Selected item'}' is no longer available in stock.",
            )

        if product.item_type == "unique" and item.quantity > 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Item '{product.name}' is a unique piece and can only be purchased with quantity 1.",
            )

        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Requested quantity for '{product.name}' exceeds available stock ({product.stock_quantity}).",
            )

        live_unit_price = Decimal(str(product.price))
        line_subtotal = (live_unit_price * item.quantity).quantize(Decimal("0.01"))
        subtotal += line_subtotal
        total_quantity += item.quantity

        primary_image = product.image_url
        if not primary_image and product.images and len(product.images) > 0:
            primary_image = product.images[0]

        items_to_create.append(
            {
                "product_id": product.id,
                "product_sku": product.sku,
                "product_name": product.name,
                "product_image": primary_image,
                "purity": product.purity,
                "weight_grams": Decimal(str(product.gross_weight).replace("g", "").strip()) if product.gross_weight and product.gross_weight.replace("g", "").replace(".", "").strip().isdigit() else None,
                "unit_price": live_unit_price,
                "quantity": item.quantity,
                "subtotal": line_subtotal,
                "product_ref": product,
            }
        )

    # 3. Calculations with coupon discount
    discount = Decimal("0.00")
    applied_coupon_code = None
    if cart.applied_coupon_code:
        coupon = db.query(Coupon).filter(Coupon.code == cart.applied_coupon_code, Coupon.is_active == True).first()
        if coupon and coupon.is_valid(subtotal)[0]:
            discount = coupon.calculate_discount(subtotal)
            applied_coupon_code = coupon.code
            coupon.times_used += 1

    taxable_subtotal = max(Decimal("0.00"), subtotal - discount)
    tax = (taxable_subtotal * Decimal("0.03")).quantize(Decimal("1.00"))
    delivery_charge = Decimal("0.00")
    total_amount = max(Decimal("0.00"), taxable_subtotal + tax + delivery_charge)

    # 4. Generate Order Identifier & Secure Guest Access Token
    order_number = generate_unique_order_number(db)
    raw_guest_token, guest_token_hash = generate_guest_order_token()

    # 5. Payment method resolution
    requested_method = payload.payment_method.upper().strip()
    if requested_method == "RAZORPAY":
        if not (settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Online payment gateway is not configured. Please select Cash on Delivery or Showroom Pay.",
            )
        resolved_payment_method = "Razorpay"
        initial_payment_status = "pending"
        initial_order_status = "Pending Payment"
    elif requested_method == "SHOWROOM_PAY":
        resolved_payment_method = "Pay at Showroom"
        initial_payment_status = "pending"
        initial_order_status = "Confirmed"
    else:  # Default to COD
        resolved_payment_method = "COD"
        initial_payment_status = "pending"
        initial_order_status = "Confirmed"

    first_item = items_to_create[0]
    multi_suffix = f" + {len(items_to_create) - 1} other item(s)" if len(items_to_create) > 1 else ""
    summary_product_name = f"{first_item['product_name']}{multi_suffix}"

    # 6. Instantiate Order
    order = Order(
        order_number=order_number,
        customer_id=customer.id if customer else None,
        customer_name=payload.customer.customer_name.strip(),
        phone=payload.customer.mobile_number.strip(),
        alternate_phone=payload.customer.alternative_mobile_number.strip() if payload.customer.alternative_mobile_number else None,
        email=payload.customer.email.strip() if payload.customer.email else None,
        delivery_address=payload.delivery.full_address.strip(),
        city=payload.delivery.city.strip(),
        state=payload.delivery.state.strip(),
        pin_code=payload.delivery.pin_code.strip(),
        product_sku=first_item["product_sku"],
        product_name=summary_product_name,
        product_image=first_item["product_image"],
        unit_price=first_item["unit_price"],
        quantity=total_quantity,
        subtotal=subtotal,
        tax=tax,
        delivery_charge=delivery_charge,
        discount=discount,
        total_amount=total_amount,
        channel="Online Store",
        payment_method=resolved_payment_method,
        payment_status=initial_payment_status,
        order_status=initial_order_status,
        coupon_code=applied_coupon_code,
        idempotency_key=payload.idempotency_key.strip() if payload.idempotency_key else None,
        guest_token_hash=guest_token_hash,
        notes=payload.notes.strip() if payload.notes else None,
    )
    db.add(order)
    db.flush()

    # 7. Create Line Items
    for it in items_to_create:
        order_item = OrderItem(
            order_id=order.id,
            product_id=it["product_id"],
            product_sku=it["product_sku"],
            product_name=it["product_name"],
            product_image=it["product_image"],
            purity=it["purity"],
            weight_grams=it["weight_grams"],
            unit_price=it["unit_price"],
            quantity=it["quantity"],
            subtotal=it["subtotal"],
        )
        db.add(order_item)

        # 8. Atomically update inventory if order is immediately confirmed (COD / Showroom Pay)
        if initial_order_status == "Confirmed":
            prod = it["product_ref"]
            if prod.item_type == "unique":
                prod.status = "sold"
                prod.stock_quantity = 0
            else:
                prod.stock_quantity = max(0, prod.stock_quantity - it["quantity"])
                if prod.stock_quantity == 0:
                    prod.status = "unavailable"

    # 9. Register Payment Record
    payment = Payment(
        order_id=order.id,
        provider="razorpay" if requested_method == "RAZORPAY" else requested_method.lower(),
        amount=total_amount,
        currency="INR",
        payment_method=resolved_payment_method,
        payment_status=initial_payment_status,
    )
    db.add(payment)

    # 10. Clear Cart Items atomically
    db.query(ShoppingCartItem).filter(ShoppingCartItem.cart_id == cart.id).delete()

    db.commit()
    db.refresh(order)
    return order, raw_guest_token


def verify_order_access(order: Order, db: Session, guest_token: Optional[str] = None, customer: Optional[Customer] = None) -> bool:
    """Ensure orders cannot be enumerated by guessable sequential order numbers alone."""
    # 1. Customer owns the order
    if customer and order.customer_id and order.customer_id == customer.id:
        return True

    # 2. Matching guest token
    if guest_token and order.guest_token_hash:
        expected_hash = hash_order_token(guest_token)
        if secrets.compare_digest(order.guest_token_hash, expected_hash):
            return True

    return False
