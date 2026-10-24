import csv
import io
import json
import uuid
from decimal import Decimal, InvalidOperation
from typing import Any, Dict, List, Optional, Set, Tuple
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..models.product import Product
from ..models.product_import_job import ProductImportJob
from ..models.admin_user import AdminUser
from ..schemas.product import (
    ProductImportResponse,
    ProductImportRowError,
    normalize_image_reference,
)

# Maximum upload limits
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
MAX_ROW_COUNT = 2000

REQUIRED_HEADERS = {"sku", "name", "category", "price"}

HEADER_ALIASES = {
    "subcategory": "sub_category",
    "sub_category": "sub_category",
    "itemtype": "item_type",
    "item_type": "item_type",
    "isunique": "item_type",
    "image": "image_url",
    "imageurl": "image_url",
    "image_url": "image_url",
    "stock": "stock_quantity",
    "stockqty": "stock_quantity",
    "stock_qty": "stock_quantity",
    "stock_quantity": "stock_quantity",
    "grossweight": "gross_weight",
    "gross_weight": "gross_weight",
    "netweight": "net_weight",
    "net_weight": "net_weight",
    "hallmarkdetails": "hallmark_details",
    "hallmark_details": "hallmark_details",
}


def normalize_header(header: str) -> str:
    """Normalize raw column name by stripping punctuation and whitespace."""
    clean = header.strip().lower().replace(" ", "_").replace("-", "_")
    return HEADER_ALIASES.get(clean, clean)


async def extract_rows_from_file(file: UploadFile) -> Tuple[List[Dict[str, Any]], str]:
    """Parse CSV or XLSX file contents into standardized row dictionaries."""
    filename = file.filename or "unknown.csv"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if ext not in ("csv", "xlsx"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "error": f"Unsupported file type '.{ext}'. Only CSV and XLSX are accepted."},
        )

    content = await file.read()
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail={"success": False, "error": f"File exceeds maximum allowed size of {MAX_FILE_SIZE_BYTES // (1024*1024)}MB."},
        )

    rows: List[Dict[str, Any]] = []

    if ext == "csv":
        try:
            # Handle UTF-8 and UTF-8 with BOM
            text_stream = io.StringIO(content.decode("utf-8-sig"))
            reader = csv.reader(text_stream)
            raw_headers = next(reader, None)
            if not raw_headers:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail={"success": False, "error": "CSV file is empty or missing header row."},
                )

            headers = [normalize_header(h) for h in raw_headers]
            for row_idx, row_values in enumerate(reader, start=2):
                if not any(v.strip() for v in row_values):
                    continue  # skip blank lines
                row_dict = {}
                for h, val in zip(headers, row_values):
                    row_dict[h] = val.strip()
                rows.append({"_row_num": row_idx, **row_dict})
        except UnicodeDecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"success": False, "error": "CSV encoding error: Please upload a valid UTF-8 encoded CSV file."},
            )
    elif ext == "xlsx":
        try:
            import openpyxl
            wb = openpyxl.load_workbook(io.BytesIO(content), read_only=True, data_only=True)
            sheet = wb.active
            iter_rows = sheet.iter_rows(values_only=True)
            raw_headers = next(iter_rows, None)
            if not raw_headers:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail={"success": False, "error": "Excel sheet is empty."},
                )

            headers = [normalize_header(str(h or "")) for h in raw_headers]
            for row_idx, row_values in enumerate(iter_rows, start=2):
                if not any(v is not None and str(v).strip() for v in row_values):
                    continue
                row_dict = {}
                for h, val in zip(headers, row_values):
                    row_dict[h] = str(val).strip() if val is not None else ""
                rows.append({"_row_num": row_idx, **row_dict})
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"success": False, "error": f"Failed to parse Excel file: {str(e)}"},
            )

    if len(rows) > MAX_ROW_COUNT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "error": f"File row count ({len(rows)}) exceeds limit of {MAX_ROW_COUNT} rows."},
        )

    return rows, filename


def validate_and_process_import(
    db: Session,
    rows: List[Dict[str, Any]],
    filename: str,
    admin: AdminUser,
    dry_run: bool = False,
) -> ProductImportResponse:
    """Validate rows and optionally persist new products in an atomic transaction."""
    errors: List[ProductImportRowError] = []
    seen_file_skus: Set[str] = set()
    valid_products_to_create: List[Product] = []

    if not rows:
        return ProductImportResponse(
            success=True,
            dry_run=dry_run,
            total_rows=0,
            valid_rows=0,
            invalid_rows=0,
            created_count=0,
            skipped_count=0,
            errors=[],
        )

    # 1. Verify required headers are present in row keys
    first_row_keys = set(rows[0].keys()) - {"_row_num"}
    missing_required = REQUIRED_HEADERS - first_row_keys
    if missing_required:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error": f"Missing required headers: {sorted(list(missing_required))}. File must contain at minimum: sku, name, category, price.",
            },
        )

    # 2. Collect all existing SKUs from PostgreSQL for conflict checks
    existing_products = db.query(Product.sku, Product.status, Product.item_type).all()
    existing_sku_map = {p.sku.lower(): p for p in existing_products}

    # 3. Validate each row
    for row in rows:
        row_num = row.get("_row_num", 0)
        sku = str(row.get("sku", "")).strip()
        name = str(row.get("name", "")).strip()
        category = str(row.get("category", "")).strip()
        price_raw = str(row.get("price", "")).strip().replace(",", "")

        # A. Required field validation
        if not sku:
            errors.append(ProductImportRowError(row=row_num, field="sku", reason="SKU cannot be empty."))
            continue

        if not name:
            errors.append(ProductImportRowError(row=row_num, field="name", reason="Product name cannot be empty.", sku=sku))
            continue

        if not category:
            errors.append(ProductImportRowError(row=row_num, field="category", reason="Category cannot be empty.", sku=sku))
            continue

        # B. Duplicate SKU in file
        sku_lower = sku.lower()
        if sku_lower in seen_file_skus:
            errors.append(
                ProductImportRowError(
                    row=row_num,
                    field="sku",
                    reason=f"Duplicate SKU '{sku}' found within the uploaded file.",
                    sku=sku,
                )
            )
            continue
        seen_file_skus.add(sku_lower)

        # C. Existing SKU in database conflict check
        if sku_lower in existing_sku_map:
            existing = existing_sku_map[sku_lower]
            # Safeguard: Never overwrite sold or reserved items
            if existing.status in ("sold", "sold_showroom", "reserved"):
                errors.append(
                    ProductImportRowError(
                        row=row_num,
                        field="sku",
                        reason=f"SKU '{sku}' already exists in catalogue with protected status '{existing.status}'. Cannot overwrite.",
                        sku=sku,
                    )
                )
            else:
                errors.append(
                    ProductImportRowError(
                        row=row_num,
                        field="sku",
                        reason=f"SKU '{sku}' already exists in database. Overwrites are not permitted via import.",
                        sku=sku,
                    )
                )
            continue

        # D. Price validation
        try:
            price_dec = Decimal(price_raw)
            if price_dec < 0:
                errors.append(ProductImportRowError(row=row_num, field="price", reason="Price must be non-negative.", sku=sku))
                continue
        except (InvalidOperation, ValueError):
            errors.append(ProductImportRowError(row=row_num, field="price", reason=f"Invalid price value '{price_raw}'. Must be a valid numeric amount.", sku=sku))
            continue

        # E. Stock Quantity validation
        stock_raw = str(row.get("stock_quantity", "1")).strip()
        stock_qty = 1
        if stock_raw:
            try:
                stock_qty = int(float(stock_raw))
                if stock_qty < 0:
                    errors.append(ProductImportRowError(row=row_num, field="stock_quantity", reason="Stock quantity must be non-negative.", sku=sku))
                    continue
            except ValueError:
                errors.append(ProductImportRowError(row=row_num, field="stock_quantity", reason=f"Invalid stock quantity '{stock_raw}'.", sku=sku))
                continue

        # F. Item Type resolution
        raw_type = str(row.get("item_type", "unique")).strip().lower()
        if raw_type in ("true", "1", "yes", "unique"):
            item_type = "unique"
        elif raw_type in ("false", "0", "no", "regular"):
            item_type = "regular"
        else:
            item_type = "unique"

        # G. Status validation
        raw_status = str(row.get("status", "available")).strip().lower() or "available"
        if raw_status not in ("available", "reserved", "sold", "sold_showroom", "unavailable"):
            errors.append(ProductImportRowError(row=row_num, field="status", reason=f"Invalid status '{raw_status}'. Must be 'available', 'reserved', or 'sold'.", sku=sku))
            continue

        # Build clean Product entity
        prod = Product(
            sku=sku,
            name=name,
            subtitle=row.get("subtitle", "").strip() or None,
            description=row.get("description", "").strip() or None,
            category=category,
            sub_category=row.get("sub_category", "").strip() or None,
            item_type=item_type,
            price=price_dec,
            status=raw_status,
            image_url=normalize_image_reference(row.get("image_url", "").strip()) or None,
            stock_quantity=stock_qty,
            purity=row.get("purity", "").strip() or None,
            gross_weight=row.get("gross_weight", "").strip() or None,
            net_weight=row.get("net_weight", "").strip() or None,
            hallmark_details=row.get("hallmark_details", "").strip() or None,
            location=row.get("location", "").strip() or None,
            is_active=True,
        )
        valid_products_to_create.append(prod)

    total_rows = len(rows)
    invalid_rows = len(errors)
    valid_rows = len(valid_products_to_create)

    # In actual mode, all-or-nothing: if any row is invalid, rollback and return error report
    created_count = 0
    if not dry_run and invalid_rows == 0:
        # Commit transaction
        db.add_all(valid_products_to_create)
        db.commit()
        created_count = len(valid_products_to_create)

    # Record job in product_import_jobs
    job_status = "dry_run" if dry_run else ("completed" if invalid_rows == 0 else "failed")
    error_summary_json = json.dumps([e.model_dump() for e in errors[:50]]) if errors else None

    import_job = ProductImportJob(
        filename=filename,
        admin_id=admin.id,
        total_rows=total_rows,
        valid_rows=valid_rows,
        invalid_rows=invalid_rows,
        created_count=created_count,
        skipped_count=invalid_rows,
        status=job_status,
        error_summary=error_summary_json,
    )
    db.add(import_job)
    db.commit()

    return ProductImportResponse(
        success=(invalid_rows == 0),
        dry_run=dry_run,
        total_rows=total_rows,
        valid_rows=valid_rows,
        invalid_rows=invalid_rows,
        created_count=created_count,
        skipped_count=invalid_rows,
        errors=errors,
    )
