from decimal import Decimal
from math import ceil
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ...db.session import get_db
from ...schemas.product import ProductListResponse, ProductPublic
from ...services.product_service import get_product_by_id_or_sku, get_products

router = APIRouter(prefix="/products", tags=["Storefront Products"])


@router.get("", response_model=ProductListResponse)
def list_public_products(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(100, ge=1, le=500, description="Items per page"),
    search: Optional[str] = Query(None, description="Search term for name, description, category or SKU"),
    product_type: Optional[str] = Query(None, description="Product type filter (gold, silver, coins_bars)"),
    category: Optional[str] = Query(None, description="Category filter (gold, silver, coins, bridal, etc.)"),
    sub_category: Optional[str] = Query(None, description="Sub-category filter (e.g. earrings, bangles, studs)"),
    status: Optional[str] = Query(None, description="Status filter (available, reserved, sold)"),
    item_type: Optional[str] = Query(None, description="Item type filter (unique, regular)"),
    availability: Optional[str] = Query(None, description="Stock availability (in_stock, out_of_stock)"),
    min_price: Optional[Decimal] = Query(None, ge=0, description="Minimum price (INR)"),
    max_price: Optional[Decimal] = Query(None, ge=0, description="Maximum price (INR)"),
    sort_by: Optional[str] = Query("featured", description="Sort parameter (featured, price-low, price-high, name, created_at)"),
    sort_order: Optional[str] = Query("desc", description="Sort order (asc, desc)"),
    db: Session = Depends(get_db),
):
    """
    Public storefront catalogue endpoint returning real, active products from PostgreSQL.
    No authentication required.
    Does NOT auto-seed mock products.
    """
    items, total = get_products(
        db=db,
        page=page,
        page_size=page_size,
        search=search,
        product_type=product_type,
        category=category,
        sub_category=sub_category,
        status_filter=status,
        item_type=item_type,
        availability=availability,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by,
        sort_order=sort_order,
    )

    total_pages = max(1, ceil(total / page_size)) if total > 0 else 1

    return {
        "items": [ProductPublic.model_validate(p) for p in items],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


@router.get("/{product_id_or_sku}", response_model=ProductPublic)
def get_public_product(
    product_id_or_sku: str,
    db: Session = Depends(get_db),
):
    """
    Retrieve single public product details by UUID or SKU.
    Only returns active showroom products.
    """
    product = get_product_by_id_or_sku(db, product_id_or_sku)
    if not product or not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"success": False, "error": f"Product '{product_id_or_sku}' not found."},
        )
    return ProductPublic.model_validate(product)
