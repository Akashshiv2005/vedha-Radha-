from math import ceil
from typing import Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from ...db.session import get_db
from ...models.admin_user import AdminUser
from ...schemas.product import (
    ProductCreate,
    ProductImageUploadResponse,
    ProductImportResponse,
    ProductListResponse,
    ProductPublic,
    ProductUpdate,
)
from ...services.minio_service import minio_service
from ...services.product_service import (
    create_product,
    delete_product_permanent,
    get_product_by_id_or_sku,
    get_products,
    soft_delete_product,
    update_product,
)
from ...services.product_import_service import (
    extract_rows_from_file,
    validate_and_process_import,
)
from ..deps import get_current_admin

router = APIRouter(prefix="/admin/products", tags=["Product Inventory"])


@router.get("", response_model=ProductListResponse)
async def list_admin_products(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(50, ge=1, le=200, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by name, SKU, or category"),
    product_type: Optional[str] = Query(None, description="Filter by product type (gold, silver, coins_bars)"),
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status (available, reserved, sold)"),
    item_type: Optional[str] = Query(None, description="Filter by item type (unique, regular)"),
    availability: Optional[str] = Query(None, description="Filter by stock availability (in_stock, out_of_stock)"),
    sort_by: Optional[str] = Query("created_at", description="Sort field (created_at, price, name, sku)"),
    sort_order: Optional[str] = Query("desc", description="Sort order (asc, desc)"),
    include_inactive: bool = Query(False, description="Include soft-deleted or archived products"),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    List inventory products with search, multi-faceted filtering, and pagination.
    Protected endpoint: Requires staff administrator authentication.
    """
    items, total = get_products(
        db=db,
        page=page,
        page_size=page_size,
        search=search,
        product_type=product_type,
        category=category,
        status_filter=status,
        item_type=item_type,
        availability=availability,
        sort_by=sort_by,
        sort_order=sort_order,
        include_inactive=include_inactive or (status == "unavailable"),
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
async def get_single_product(
    product_id_or_sku: str,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Retrieve single product details by UUID or SKU.
    """
    product = get_product_by_id_or_sku(db, product_id_or_sku)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"success": False, "error": f"Product '{product_id_or_sku}' not found."},
        )
    return ProductPublic.model_validate(product)


@router.post("", response_model=ProductPublic, status_code=status.HTTP_201_CREATED)
async def create_new_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Create a new inventory product.
    Enforces SKU uniqueness, valid status, non-negative price, and stock rules.
    """
    product = create_product(db, payload)
    return ProductPublic.model_validate(product)


@router.put("/{product_id_or_sku}", response_model=ProductPublic)
async def update_existing_product(
    product_id_or_sku: str,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Update editable product fields with conflict safeguards.
    """
    product = get_product_by_id_or_sku(db, product_id_or_sku, include_inactive=True)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"success": False, "error": f"Product '{product_id_or_sku}' not found."},
        )

    updated = update_product(db, product, payload)
    return ProductPublic.model_validate(updated)


@router.delete("/{product_id_or_sku}")
async def delete_existing_product(
    product_id_or_sku: str,
    hard: bool = Query(False, description="Permanently delete from database if unreferenced"),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Remove product from inventory. Soft-deactivates by default to preserve historical integrity,
    or hard-deletes if hard=True.
    """
    product = get_product_by_id_or_sku(db, product_id_or_sku, include_inactive=True)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"success": False, "error": f"Product '{product_id_or_sku}' not found."},
        )

    if hard:
        delete_product_permanent(db, product)
        return {"success": True, "message": f"Product '{product.sku}' permanently deleted from database."}
    else:
        soft_delete_product(db, product)
        return {"success": True, "message": f"Product '{product.sku}' removed from inventory."}


@router.post("/import", response_model=ProductImportResponse)
async def import_products_file(
    file: UploadFile = File(...),
    dry_run: Optional[bool] = Query(None, description="Dry run mode: validates file without inserting rows into database"),
    dry_run_form: Optional[str] = Form(None, alias="dry_run"),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Batch import products via CSV or XLSX.
    
    Supports:
    - dry_run=True: Validates file without persisting any rows to database.
    - dry_run=False: Atomic database transaction importing all valid rows.
    """
    is_dry_run = False
    if dry_run is not None:
        is_dry_run = dry_run
    elif dry_run_form is not None:
        is_dry_run = dry_run_form.strip().lower() in ("true", "1", "yes", "t")

    rows, filename = await extract_rows_from_file(file)
    result = validate_and_process_import(
        db=db,
        rows=rows,
        filename=filename,
        admin=current_admin,
        dry_run=is_dry_run,
    )

    return result


@router.post("/upload-image", response_model=ProductImageUploadResponse)
async def upload_product_image(
    file: UploadFile = File(..., description="Product jewellery photo (JPEG, PNG, WebP up to 5MB)"),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Upload a product image to MinIO object storage.

    Requirements:
    - Requires authenticated administrator session.
    - Accepts JPEG, PNG, and WebP images up to 5MB.
    - Decodes image content with Pillow to verify image headers and integrity.
    - Stores file in MinIO under collision-resistant key: products/{uuid}.{ext}.
    - Returns persistent object_key and browser-ready presigned image_url.
    """
    content = await file.read()
    upload_result = minio_service.upload_image(
        content=content,
        original_filename=file.filename or "product_image.jpg",
    )

    return ProductImageUploadResponse(**upload_result)


@router.get("/images/{object_key:path}")
async def get_product_image_redirect(
    object_key: str,
):
    """
    Redirects browser to presigned MinIO URL for the requested product image object key.
    Allows browsers to load images directly through a backend-managed route.
    """
    url = minio_service.get_presigned_url(object_key)
    return RedirectResponse(url=url)

