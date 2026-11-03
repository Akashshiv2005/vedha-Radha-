import uuid
import secrets
import hashlib
from datetime import datetime, timezone, timedelta
from decimal import Decimal
from typing import Optional, Tuple, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status

from ..models.cart import ShoppingCart, ShoppingCartItem
from ..models.product import Product
from ..models.coupon import Coupon
from ..schemas.cart import (
    CartResponse,
    CartItemResponse,
    CartSummaryResponse,
    CartItemSummary,
)
from .product_service import get_product_by_id_or_sku


def generate_cart_token() -> Tuple[str, str]:
    """Generate a secure random cart token and its SHA-256 hash."""
    raw_token = secrets.token_urlsafe(32)
    token_hash = hash_cart_token(raw_token)
    return raw_token, token_hash


def hash_cart_token(token: str) -> str:
    """Hash an anonymous cart token using SHA-256."""
    return hashlib.sha256(token.strip().encode("utf-8")).hexdigest()


def get_or_create_cart(
    db: Session, cart_token: Optional[str] = None
) -> Tuple[ShoppingCart, str, bool]:
    """
    Retrieve an active cart by token, or create a fresh one if missing or expired.
    Returns (cart, raw_token, is_new_cart).
    """
    now = datetime.now(timezone.utc)

    if cart_token and cart_token.strip():
        token_hash = hash_cart_token(cart_token)
        cart = (
            db.query(ShoppingCart)
            .filter(
                ShoppingCart.cart_token_hash == token_hash,
                ShoppingCart.status == "active",
            )
            .first()
        )
        if cart:
            if cart.expires_at and cart.expires_at < now:
                # Expired cart -> mark abandoned and create fresh cart below
                cart.status = "expired"
                db.commit()
            else:
                return cart, cart_token.strip(), False

    # Create new guest cart
    raw_token, token_hash = generate_cart_token()
    expires_at = now + timedelta(days=30)

    cart = ShoppingCart(
        cart_token_hash=token_hash,
        status="active",
        expires_at=expires_at,
    )
    db.add(cart)
    db.commit()
    db.refresh(cart)
    return cart, raw_token, True


def get_cart_by_token(db: Session, cart_token: Optional[str]) -> Optional[ShoppingCart]:
    """Retrieve active shopping cart strictly by its token without auto-creating."""
    if not cart_token or not cart_token.strip():
        return None

    token_hash = hash_cart_token(cart_token)
    now = datetime.now(timezone.utc)
    cart = (
        db.query(ShoppingCart)
        .filter(
            ShoppingCart.cart_token_hash == token_hash,
            ShoppingCart.status == "active",
        )
        .first()
    )
    if cart and cart.expires_at and cart.expires_at < now:
        cart.status = "expired"
        db.commit()
        return None
    return cart


def build_cart_response(
    cart: ShoppingCart, cart_token: str, db: Optional[Session] = None
) -> CartResponse:
    """Format full CartResponse with live pricing, availability, coupon, and change detection."""
    items_response: List[CartItemResponse] = []
    item_count = 0
    subtotal = Decimal("0.00")
    has_price_changes = False
    has_unavailable_items = False

    for item in cart.items:
        product: Optional[Product] = item.product
        if not product:
            continue

        current_price = product.price
        snapshot_price = item.unit_price_snapshot
        price_diff = current_price - snapshot_price
        price_changed = price_diff != Decimal("0.00")
        if price_changed:
            has_price_changes = True

        # Availability check: active, available status, and stock
        is_available = (
            product.is_active
            and product.status == "available"
            and product.stock_quantity >= item.quantity
        )
        if not is_available:
            has_unavailable_items = True

        is_unique = (product.item_type == "unique") or (product.stock_quantity == 1)
        item_subtotal = current_price * Decimal(item.quantity)
        item_count += item.quantity
        subtotal += item_subtotal

        # Image resolution
        img_url = product.image_url
        if not img_url and product.images and len(product.images) > 0:
            img_url = product.images[0]
        if not img_url:
            img_url = "/images/neutral_product_placeholder.svg"

        details = product.hallmark_details or product.purity or product.subtitle or "22K BIS 916"

        items_response.append(
            CartItemResponse(
                id=item.id,
                product_id=product.id,
                name=product.name,
                sku=product.sku,
                category=product.category,
                item_type=product.item_type,
                is_unique=is_unique,
                unit_price_snapshot=snapshot_price,
                current_price=current_price,
                price_changed=price_changed,
                price_change_diff=price_diff,
                quantity=item.quantity,
                item_subtotal=item_subtotal,
                image_url=img_url,
                is_available=is_available,
                stock_quantity=product.stock_quantity,
                details=details,
            )
        )

    # Coupon discount processing
    applied_coupon_code = None
    coupon_discount = Decimal("0.00")
    coupon_details = None

    if cart.applied_coupon_code and db:
        coupon = (
            db.query(Coupon)
            .filter(Coupon.code == cart.applied_coupon_code, Coupon.is_active == True)
            .first()
        )
        if coupon:
            is_valid, _ = coupon.is_valid(subtotal)
            if is_valid:
                applied_coupon_code = coupon.code
                coupon_discount = coupon.calculate_discount(subtotal)
                coupon_details = {
                    "code": coupon.code,
                    "description": coupon.description,
                    "discount_type": coupon.discount_type,
                    "discount_value": float(coupon.discount_value),
                    "discount_amount": float(coupon_discount),
                }
            else:
                cart.applied_coupon_code = None
                db.commit()
    elif cart.applied_coupon_code:
        applied_coupon_code = cart.applied_coupon_code

    # Taxes & Totals
    taxable_subtotal = max(Decimal("0.00"), subtotal - coupon_discount)
    tax = (taxable_subtotal * Decimal("0.03")).quantize(Decimal("1.00"))
    delivery_charge = Decimal("0.00")
    final_cart_total = taxable_subtotal

    return CartResponse(
        success=True,
        cart_token=cart_token,
        cart_id=cart.id,
        status=cart.status,
        items=items_response,
        item_count=item_count,
        subtotal=subtotal,
        applied_coupon_code=applied_coupon_code,
        coupon_discount=coupon_discount,
        tax=tax,
        delivery_charge=delivery_charge,
        cart_total=final_cart_total,
        has_price_changes=has_price_changes,
        has_unavailable_items=has_unavailable_items,
        coupon_details=coupon_details,
        created_at=cart.created_at,
        updated_at=cart.updated_at,
    )


def add_item_to_cart(
    db: Session,
    cart: ShoppingCart,
    product_identifier: str,
    quantity: int = 1,
) -> ShoppingCartItem:
    """
    Add a product to the cart with strict unique item and stock validation.
    Uses pessimistic row locking to prevent concurrent race conditions on unique jewellery.
    """
    if quantity < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quantity must be at least 1.",
        )

    # 1. Resolve product
    clean_id = product_identifier.strip()
    is_uuid = False
    try:
        p_uuid = uuid.UUID(clean_id)
        is_uuid = True
    except (ValueError, AttributeError):
        is_uuid = False

    # Query with row lock for transaction safety
    if is_uuid:
        product = (
            db.query(Product)
            .filter(Product.id == p_uuid)
            .with_for_update()
            .first()
        )
    else:
        product = (
            db.query(Product)
            .filter(func.lower(Product.sku) == clean_id.lower())
            .with_for_update()
            .first()
        )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{product_identifier}' does not exist in inventory.",
        )

    # 2. Availability validation
    if not product.is_active or product.status != "available":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Jewellery piece '{product.name}' is currently unavailable ({product.status}).",
        )

    if product.stock_quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Jewellery piece '{product.name}' is out of stock.",
        )

    is_unique = (product.item_type == "unique")

    # 3. Check existing item in this cart
    existing_item = (
        db.query(ShoppingCartItem)
        .filter(
            ShoppingCartItem.cart_id == cart.id,
            ShoppingCartItem.product_id == product.id,
        )
        .first()
    )

    if is_unique:
        if quantity > 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unique jewellery pieces can only be ordered in a quantity of 1.",
            )
        if existing_item:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unique jewellery piece '{product.name}' is already in your shopping cart.",
            )
        item = ShoppingCartItem(
            cart_id=cart.id,
            product_id=product.id,
            quantity=1,
            unit_price_snapshot=product.price,
        )
        db.add(item)
    else:
        # Regular jewellery piece
        if existing_item:
            new_qty = existing_item.quantity + quantity
            if new_qty > product.stock_quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Requested total quantity ({new_qty}) exceeds available stock ({product.stock_quantity}).",
                )
            existing_item.quantity = new_qty
            existing_item.updated_at = func.now()
            item = existing_item
        else:
            if quantity > product.stock_quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Requested quantity ({quantity}) exceeds available stock ({product.stock_quantity}).",
                )
            item = ShoppingCartItem(
                cart_id=cart.id,
                product_id=product.id,
                quantity=quantity,
                unit_price_snapshot=product.price,
            )
            db.add(item)

    cart.updated_at = func.now()
    db.commit()
    db.refresh(cart)
    db.refresh(item)
    return item


def update_cart_item_quantity(
    db: Session,
    cart: ShoppingCart,
    item_id: uuid.UUID,
    quantity: int,
) -> ShoppingCartItem:
    """Update item quantity strictly scoped to the requesting cart."""
    if quantity < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quantity must be at least 1.",
        )

    item = (
        db.query(ShoppingCartItem)
        .filter(
            ShoppingCartItem.id == item_id,
            ShoppingCartItem.cart_id == cart.id,
        )
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found in your shopping cart.",
        )

    product = item.product
    if not product or not product.is_active or product.status != "available":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This product is no longer available in inventory.",
        )

    is_unique = (product.item_type == "unique")
    if is_unique and quantity > 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unique jewellery pieces cannot exceed a quantity of 1.",
        )

    if quantity > product.stock_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Requested quantity ({quantity}) exceeds available stock ({product.stock_quantity}).",
        )

    item.quantity = quantity
    item.updated_at = func.now()
    cart.updated_at = func.now()
    db.commit()
    db.refresh(item)
    db.refresh(cart)
    return item


def remove_cart_item(
    db: Session,
    cart: ShoppingCart,
    item_id: uuid.UUID,
) -> None:
    """Remove a specific item from the cart, ensuring cart isolation."""
    item = (
        db.query(ShoppingCartItem)
        .filter(
            ShoppingCartItem.id == item_id,
            ShoppingCartItem.cart_id == cart.id,
        )
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found in your shopping cart.",
        )

    db.delete(item)
    cart.updated_at = func.now()
    db.commit()
    db.refresh(cart)


def clear_cart_items(db: Session, cart: ShoppingCart) -> None:
    """Remove all items belonging to the guest cart."""
    db.query(ShoppingCartItem).filter(
        ShoppingCartItem.cart_id == cart.id
    ).delete(synchronize_session=False)

    cart.applied_coupon_code = None
    cart.updated_at = func.now()
    db.commit()
    db.refresh(cart)


def apply_coupon_to_cart(db: Session, cart: ShoppingCart, code: str) -> ShoppingCart:
    """Validate and apply a coupon to the cart."""
    clean_code = code.strip().upper()
    coupon = (
        db.query(Coupon)
        .filter(Coupon.code == clean_code, Coupon.is_active == True)
        .first()
    )
    if not coupon:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Coupon '{clean_code}' is invalid or expired.",
        )

    # Calculate current live subtotal
    subtotal = Decimal("0.00")
    for it in cart.items:
        if it.product and it.product.is_active and it.product.status == "available":
            subtotal += it.product.price * Decimal(it.quantity)

    is_valid, err_msg = coupon.is_valid(subtotal)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=err_msg or "Coupon conditions not met.",
        )

    cart.applied_coupon_code = coupon.code
    cart.updated_at = func.now()
    db.commit()
    db.refresh(cart)
    return cart


def remove_coupon_from_cart(db: Session, cart: ShoppingCart) -> ShoppingCart:
    """Remove applied coupon from the cart."""
    cart.applied_coupon_code = None
    cart.updated_at = func.now()
    db.commit()
    db.refresh(cart)
    return cart


def build_cart_summary(
    cart: ShoppingCart, cart_token: Optional[str] = None, db: Optional[Session] = None
) -> CartSummaryResponse:
    """Lightweight summary format for header badges and floating drawers."""
    item_summaries: List[CartItemSummary] = []
    item_count = 0
    subtotal = Decimal("0.00")
    all_available = True

    for item in cart.items:
        product = item.product
        if not product:
            continue

        item_avail = (
            product.is_active
            and product.status == "available"
            and product.stock_quantity >= item.quantity
        )
        if not item_avail:
            all_available = False

        item_sub = product.price * Decimal(item.quantity)
        item_count += item.quantity
        subtotal += item_sub

        item_summaries.append(
            CartItemSummary(
                id=item.id,
                product_id=product.id,
                name=product.name,
                sku=product.sku,
                quantity=item.quantity,
                current_price=product.price,
                item_subtotal=item_sub,
                is_available=item_avail,
            )
        )

    coupon_discount = Decimal("0.00")
    applied_coupon_code = None
    if cart.applied_coupon_code and db:
        coupon = (
            db.query(Coupon)
            .filter(Coupon.code == cart.applied_coupon_code, Coupon.is_active == True)
            .first()
        )
        if coupon and coupon.is_valid(subtotal)[0]:
            coupon_discount = coupon.calculate_discount(subtotal)
            applied_coupon_code = coupon.code

    taxable_subtotal = max(Decimal("0.00"), subtotal - coupon_discount)
    tax = (taxable_subtotal * Decimal("0.03")).quantize(Decimal("1.00"))
    final_cart_total = max(Decimal("0.00"), taxable_subtotal + tax)

    return CartSummaryResponse(
        success=True,
        cart_token=cart_token,
        item_count=item_count,
        subtotal=subtotal,
        applied_coupon_code=applied_coupon_code,
        coupon_discount=coupon_discount,
        tax=tax,
        delivery_charge=Decimal("0.00"),
        cart_total=final_cart_total,
        is_available=all_available,
        item_summaries=item_summaries,
    )
