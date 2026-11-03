import uuid
from typing import Optional
from fastapi import APIRouter, Depends, Header, Response, HTTPException, status
from sqlalchemy.orm import Session

from ...db.session import get_db
from ...schemas.cart import (
    AddCartItemRequest,
    UpdateCartItemRequest,
    ApplyCouponRequest,
    CartResponse,
    CartSummaryResponse,
    CartItemSummary,
)
from ...services.cart_service import (
    get_or_create_cart,
    get_cart_by_token,
    build_cart_response,
    add_item_to_cart,
    update_cart_item_quantity,
    remove_cart_item,
    clear_cart_items,
    apply_coupon_to_cart,
    remove_coupon_from_cart,
)

router = APIRouter(prefix="/cart", tags=["Shopping Cart"])


@router.get("", response_model=CartResponse)
def get_cart(
    response: Response,
    x_cart_token: Optional[str] = Header(None, alias="X-Cart-Token"),
    db: Session = Depends(get_db),
):
    """
    Retrieve current guest cart by anonymous cart token.
    If no token is supplied or the cart does not exist, an empty cart with a new token is initialized.
    """
    cart, token, _ = get_or_create_cart(db, x_cart_token)
    response.headers["X-Cart-Token"] = token
    return build_cart_response(cart, token, db=db)


@router.post("/items", response_model=CartResponse, status_code=status.HTTP_201_CREATED)
def add_product_to_cart(
    request: AddCartItemRequest,
    response: Response,
    x_cart_token: Optional[str] = Header(None, alias="X-Cart-Token"),
    db: Session = Depends(get_db),
):
    """
    Add a product to the guest cart.
    Validates product existence, stock availability, and unique jewellery piece constraints.
    Prices are strictly retrieved from PostgreSQL and never trusted from frontend input.
    """
    cart, token, _ = get_or_create_cart(db, x_cart_token)
    response.headers["X-Cart-Token"] = token

    add_item_to_cart(
        db=db,
        cart=cart,
        product_identifier=request.product_id,
        quantity=request.quantity,
    )

    return build_cart_response(cart, token, db=db)


@router.patch("/items/{item_id}", response_model=CartResponse)
def update_item_quantity(
    item_id: uuid.UUID,
    request: UpdateCartItemRequest,
    response: Response,
    x_cart_token: Optional[str] = Header(None, alias="X-Cart-Token"),
    db: Session = Depends(get_db),
):
    """
    Update the quantity of an item within the current guest cart.
    Enforces product stock limits and prevents quantity > 1 for unique pieces.
    """
    if not x_cart_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing anonymous cart token.",
        )

    cart = get_cart_by_token(db, x_cart_token)
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shopping cart not found or expired.",
        )

    response.headers["X-Cart-Token"] = x_cart_token
    update_cart_item_quantity(db, cart, item_id, request.quantity)
    return build_cart_response(cart, x_cart_token, db=db)


@router.delete("/items/{item_id}", response_model=CartResponse)
def delete_cart_item(
    item_id: uuid.UUID,
    response: Response,
    x_cart_token: Optional[str] = Header(None, alias="X-Cart-Token"),
    db: Session = Depends(get_db),
):
    """
    Remove a single item from the guest cart.
    Only allows removing items owned by the requesting cart.
    """
    if not x_cart_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing anonymous cart token.",
        )

    cart = get_cart_by_token(db, x_cart_token)
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shopping cart not found or expired.",
        )

    response.headers["X-Cart-Token"] = x_cart_token
    remove_cart_item(db, cart, item_id)
    return build_cart_response(cart, x_cart_token, db=db)


@router.delete("", response_model=CartResponse)
def clear_cart(
    response: Response,
    x_cart_token: Optional[str] = Header(None, alias="X-Cart-Token"),
    db: Session = Depends(get_db),
):
    """
    Clear all items from the current guest cart.
    Does not affect products or other visitors' carts.
    """
    if not x_cart_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing anonymous cart token.",
        )

    cart = get_cart_by_token(db, x_cart_token)
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shopping cart not found or expired.",
        )

    response.headers["X-Cart-Token"] = x_cart_token
    clear_cart_items(db, cart)
    return build_cart_response(cart, x_cart_token, db=db)


@router.post("/coupon/apply", response_model=CartResponse)
def apply_coupon(
    request: ApplyCouponRequest,
    response: Response,
    x_cart_token: Optional[str] = Header(None, alias="X-Cart-Token"),
    db: Session = Depends(get_db),
):
    """
    Apply a promotional discount coupon code to the shopping cart.
    Validates minimum order requirements and expiry against PostgreSQL.
    """
    if not x_cart_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing cart token header.",
        )

    cart = get_cart_by_token(db, x_cart_token)
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shopping cart not found or expired.",
        )

    response.headers["X-Cart-Token"] = x_cart_token
    apply_coupon_to_cart(db, cart, request.code)
    return build_cart_response(cart, x_cart_token, db=db)


@router.delete("/coupon", response_model=CartResponse)
def remove_coupon(
    response: Response,
    x_cart_token: Optional[str] = Header(None, alias="X-Cart-Token"),
    db: Session = Depends(get_db),
):
    """
    Remove an applied coupon code from the shopping cart.
    """
    if not x_cart_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing cart token header.",
        )

    cart = get_cart_by_token(db, x_cart_token)
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shopping cart not found or expired.",
        )

    response.headers["X-Cart-Token"] = x_cart_token
    remove_coupon_from_cart(db, cart)
    return build_cart_response(cart, x_cart_token, db=db)


@router.get("/summary", response_model=CartSummaryResponse)
def get_cart_summary(
    x_cart_token: Optional[str] = Header(None, alias="X-Cart-Token"),
    db: Session = Depends(get_db),
):
    """
    Get lightweight summary of cart contents, totals, and stock availability for checkout preparation.
    """
    cart = get_cart_by_token(db, x_cart_token)
    if not cart:
        return CartSummaryResponse(
            success=True,
            cart_token=x_cart_token,
            item_count=0,
            subtotal=0,
            cart_total=0,
            is_available=True,
            item_summaries=[],
        )

    full_cart = build_cart_response(cart, x_cart_token or "", db=db)
    summaries = [
        CartItemSummary(
            id=item.id,
            product_id=item.product_id,
            name=item.name,
            sku=item.sku,
            quantity=item.quantity,
            current_price=item.current_price,
            item_subtotal=item.item_subtotal,
            is_available=item.is_available,
        )
        for item in full_cart.items
    ]

    return CartSummaryResponse(
        success=True,
        cart_token=x_cart_token,
        item_count=full_cart.item_count,
        subtotal=full_cart.subtotal,
        applied_coupon_code=full_cart.applied_coupon_code,
        coupon_discount=full_cart.coupon_discount,
        tax=full_cart.tax,
        delivery_charge=full_cart.delivery_charge,
        cart_total=full_cart.cart_total,
        is_available=not full_cart.has_unavailable_items,
        item_summaries=summaries,
    )
