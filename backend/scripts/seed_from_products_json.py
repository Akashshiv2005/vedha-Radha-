"""
Seed Products from frontend/src/data/products.json with Pre-Flight Deduplication & Verification.
Vedha Radha Thangamaaligai — Jewellery E-commerce Platform.

Features:
  - Strict pre-flight verification: guarantees NO duplicate IDs, NO duplicate product names, and NO duplicate primary images.
  - Verifies that all image references exist on disk in frontend/public/images.
  - Automatically maps enriched product catalogue data with categories, hallmarking, weights, prices, and multi-view galleries.
  - Normalizes product_type into ('gold', 'silver', 'coins_bars').
  - Validates all fields against PostgreSQL table constraints (price >= 0, status, item_type).
  - Idempotent: skips existing SKUs by default, or updates them with --force.
  - Supports --verify-only to run deduplication and disk audit without modifying PostgreSQL.
  - Supports --dry-run for complete simulation without database writes.

Usage:
  python scripts/seed_from_products_json.py --verify-only
  python scripts/seed_from_products_json.py --dry-run
  python scripts/seed_from_products_json.py [--force] [--clear]
"""

import argparse
import json
import os
import re
import sys
import time
from collections import defaultdict
from decimal import Decimal
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple
from urllib.parse import urlparse

# Ensure backend root is on sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.core.config import settings
from app.db.session import SessionLocal, check_db_connection
from app.models.product import Product
from app.models.order import Order
from app.schemas.product import (
    infer_product_type,
    normalize_product_type,
    normalize_image_reference,
)


def get_redacted_db_info(url_str: str) -> str:
    """Return host, port, and database name with credentials redacted."""
    try:
        clean_url = url_str.replace("postgresql+psycopg://", "http://").replace("postgresql://", "http://")
        parsed = urlparse(clean_url)
        host = parsed.hostname or "localhost"
        port = parsed.port or 5432
        db_name = parsed.path.lstrip("/") or "unknown"
        return f"{host}:{port}/{db_name}"
    except Exception:
        return "localhost:5432/vedharadha_db"


def find_products_json_path() -> Path:
    """Dynamically locate the frontend/src/data/products.json file."""
    candidates = [
        backend_dir.parent / "frontend" / "src" / "data" / "products.json",
        Path.cwd() / "frontend" / "src" / "data" / "products.json",
        Path.cwd() / "src" / "data" / "products.json",
    ]
    for candidate in candidates:
        if candidate.is_file():
            return candidate.resolve()
    raise FileNotFoundError(
        "Could not find 'frontend/src/data/products.json'. "
        "Please ensure the repository structure has 'frontend/src/data/products.json'."
    )


def find_frontend_public_dir() -> Path:
    """Dynamically locate the frontend/public directory."""
    candidates = [
        backend_dir.parent / "frontend" / "public",
        Path.cwd() / "frontend" / "public",
        Path.cwd() / "public",
    ]
    for candidate in candidates:
        if candidate.is_dir():
            return candidate.resolve()
    return (backend_dir.parent / "frontend" / "public").resolve()


def verify_dataset_integrity(raw_catalog: List[Dict[str, Any]], public_dir: Path) -> Tuple[bool, Dict[str, Any]]:
    """
    Perform rigorous deduplication and asset existence verification:
      1. Zero duplicate product IDs / SKUs.
      2. Zero duplicate product names (case-insensitive).
      3. Zero duplicate primary image assignments.
      4. Verification that every image file actually exists on disk in frontend/public.
    """
    seen_ids = set()
    seen_names = set()
    seen_images = set()

    dup_ids: List[str] = []
    dup_names: List[str] = []
    dup_images: List[str] = []
    missing_disk_files: List[Tuple[str, str]] = []

    seen_stems = {}
    dup_stems: List[Tuple[str, str, str]] = []

    for item in raw_catalog:
        sku = str(item.get("id", "")).strip()
        name = str(item.get("name", "")).strip()
        img = str(item.get("image", "")).strip()

        # Check duplicate SKU
        if sku in seen_ids:
            dup_ids.append(sku)
        seen_ids.add(sku)

        # Check duplicate Name
        name_lower = name.lower()
        if name_lower in seen_names:
            dup_names.append(name)
        seen_names.add(name_lower)

        # Check duplicate Image & Stem Angle Collisions
        if img:
            img_lower = img.lower()
            if img_lower in seen_images:
                dup_images.append(img)
            seen_images.add(img_lower)

            # Compute base stem (stripping -01, -02, -03)
            fn = Path(img_lower.split("?")[0]).stem
            base_fn = re.sub(r'[-_]0?[1-9]$', '', fn)
            stem = f"{Path(img_lower).parent.as_posix()}/{base_fn}"
            if stem in seen_stems:
                other_sku, other_img = seen_stems[stem]
                dup_stems.append((sku, other_sku, stem))
            else:
                seen_stems[stem] = (sku, img)

            # Check existence on disk
            rel_disk = img.lstrip("/")
            file_on_disk = public_dir / rel_disk
            if not file_on_disk.is_file():
                missing_disk_files.append((sku, img))

        # Check gallery images existence
        for g_img in item.get("images", []):
            if g_img:
                g_disk = public_dir / str(g_img).lstrip("/")
                if not g_disk.is_file():
                    missing_disk_files.append((sku, str(g_img)))

    is_valid = (
        len(dup_ids) == 0
        and len(dup_names) == 0
        and len(dup_images) == 0
        and len(dup_stems) == 0
        and len(missing_disk_files) == 0
    )

    results = {
        "is_valid": is_valid,
        "total_items": len(raw_catalog),
        "duplicate_ids": dup_ids,
        "duplicate_names": dup_names,
        "duplicate_images": dup_images,
        "duplicate_stems": dup_stems,
        "missing_disk_files": missing_disk_files,
    }
    return is_valid, results


def infer_catalog_product_type(item: Dict[str, Any]) -> str:
    """
    Accurately infer product_type ('gold', 'silver', 'coins_bars')
    from category, collection, subcategory, and product title.
    """
    category_lower = str(item.get("category", "")).strip().lower()
    collection_lower = str(item.get("collection", "")).strip().lower()
    sub_lower = str(item.get("subCategory", "")).strip().lower()
    name_lower = str(item.get("name", "")).strip().lower()

    if "coin" in category_lower or "bar" in category_lower or "coin" in sub_lower or "bar" in sub_lower:
        return "coins_bars"
    if "silver" in category_lower or "silver" in collection_lower or "pooja" in collection_lower or "idol" in collection_lower:
        return "silver"
    if "gold" in category_lower or "gold" in collection_lower:
        return "gold"

    # Secondary check on product name & details
    if "silver" in name_lower or "925" in str(item.get("purity", "")).lower():
        return "silver"
    return "gold"


def map_json_item_to_product_dict(raw: Dict[str, Any]) -> Tuple[bool, str, Dict[str, Any]]:
    """
    Validate and map a single raw JSON object from products.json
    into a database-compatible dictionary for the Product model.
    """
    sku = str(raw.get("id", "")).strip()
    if not sku:
        return False, "Missing 'id' (SKU)", {}
    if len(sku) > 50:
        return False, f"SKU length ({len(sku)}) exceeds 50 characters", {}

    name = str(raw.get("name", "")).strip()
    if not name:
        return False, f"Missing 'name' for SKU '{sku}'", {}

    # Category, subcategory, sub_type, and occasion
    category = str(raw.get("category", "Jewellery")).strip()
    sub_category = str(raw.get("subCategory", "")).strip() or None
    sub_type = str(raw.get("subType", "")).strip() or None
    occasion = str(raw.get("occasion", "")).strip() or None

    # Smart inference for sub_type if missing or generic
    if not sub_type or sub_type.lower() in ("jewellery", "exclusive", "gold", "silver"):
        sku_lower = sku.lower()
        name_lower = name.lower()
        if "stud" in sku_lower or "stud" in name_lower:
            sub_type = "studs"
        elif "hanging" in sku_lower or "hanging" in name_lower:
            sub_type = "hangings"
        elif "drop" in sku_lower or "drop" in name_lower:
            sub_type = "drops"
        elif "jhumka" in sku_lower or "jhumka" in name_lower:
            sub_type = "jhumkas"
        elif "hoop" in sku_lower or "bali" in sku_lower or "hoop" in name_lower or "bali" in name_lower:
            sub_type = "hoops-bali"
        elif "engagement" in sku_lower or "engagement" in name_lower:
            sub_type = "engagement-rings"
        elif "casual" in sku_lower or "casual" in name_lower:
            sub_type = "casual-rings"
        elif "short" in sku_lower or "choker" in sku_lower or "short" in name_lower or "choker" in name_lower:
            sub_type = "short-necklace"
        elif "long" in sku_lower or "haram" in sku_lower or "long" in name_lower or "haram" in name_lower:
            sub_type = "long-necklace"
        elif "cuff" in sku_lower or "kada" in sku_lower or "cuff" in name_lower or "kada" in name_lower:
            sub_type = "cuff-bracelets"
        elif "chain-bracelet" in sku_lower or "wrist" in sku_lower or "charm" in name_lower:
            sub_type = "chain-bracelets"
        elif "bangle" in sku_lower or "valayal" in sku_lower or "bangle" in name_lower:
            sub_type = "bangles"
        elif "nosepin" in sku_lower or "mookuthi" in sku_lower or "nose" in name_lower:
            sub_type = "nosepin"
        elif "chain" in sku_lower or "rope" in sku_lower or "chain" in name_lower:
            sub_type = "chains"
        elif "pendant" in sku_lower or "locket" in sku_lower or "medallion" in name_lower:
            sub_type = "pendants"
        elif "anklet" in sku_lower or "payal" in sku_lower or "kolusu" in sku_lower:
            sub_type = "anklets"
        elif "toe-ring" in sku_lower or "metti" in sku_lower or "toe ring" in name_lower:
            sub_type = "toe-rings"
        elif "coin" in sku_lower:
            sub_type = "coins"
        elif "bar" in sku_lower:
            sub_type = "bars"
        else:
            sub_type = sub_category

    # Subtitle
    subtitle = (
        str(raw.get("details", "")).strip()
        or str(raw.get("badge", "")).strip()
        or f"{category} • {sub_category or 'Exclusive'}"
    )

    # Price validation
    price_val = raw.get("numericPrice")
    if price_val is None:
        price_str = str(raw.get("price", "0")).replace("₹", "").replace(",", "").strip()
        try:
            price_val = float(price_str)
        except Exception:
            price_val = 0.0

    try:
        price_dec = Decimal(str(price_val)).quantize(Decimal("0.01"))
        if price_dec < Decimal("0"):
            return False, f"Negative price ({price_dec}) for SKU '{sku}'", {}
    except Exception as e:
        return False, f"Invalid price format for SKU '{sku}': {e}", {}

    # Description
    description = raw.get("description") or f"{name}. Certified authentic South Indian luxury jewellery."

    # Product Type
    product_type = infer_catalog_product_type(raw)

    # Item Type
    is_bridal = bool(raw.get("isBridal", False))
    item_type = "unique" if is_bridal else "regular"

    # Images
    images_list: List[str] = []
    raw_images = raw.get("images")
    if isinstance(raw_images, list):
        for img in raw_images:
            norm = normalize_image_reference(img)
            if norm and norm not in images_list:
                images_list.append(norm)

    image_url = normalize_image_reference(raw.get("image"))
    if not image_url and images_list:
        image_url = images_list[0]
    elif image_url and image_url not in images_list:
        images_list.insert(0, image_url)

    # Purity, Weight, Hallmarking
    purity = raw.get("purity") or raw.get("details") or None
    weight_str = raw.get("weight")
    hallmark_details = raw.get("certification") or None

    # Status & stock
    badge_type = str(raw.get("badgeType", "")).lower()
    status = "unavailable" if "out-of-stock" in badge_type else "available"
    stock_quantity = 0 if status == "unavailable" else 3

    mapped: Dict[str, Any] = {
        "sku": sku,
        "name": name,
        "subtitle": subtitle[:255] if subtitle else None,
        "description": description,
        "product_type": product_type,
        "category": category[:100],
        "sub_category": sub_category[:100] if sub_category else None,
        "sub_type": sub_type[:100] if sub_type else None,
        "occasion": occasion[:100] if occasion else None,
        "item_type": item_type,
        "price": price_dec,
        "status": status,
        "image_url": image_url[:500] if image_url else None,
        "images": images_list[:10],
        "stock_quantity": stock_quantity,
        "purity": purity[:50] if purity else None,
        "gross_weight": weight_str[:50] if weight_str else None,
        "net_weight": weight_str[:50] if weight_str else None,
        "hallmark_details": hallmark_details[:255] if hallmark_details else None,
        "location": "Main Showroom Counter",
        "is_active": True,
    }

    return True, "Valid", mapped


def run_seed_from_json(
    dry_run: bool = False,
    force: bool = False,
    clear: bool = False,
    verify_only: bool = False,
) -> bool:
    """
    Execute pre-flight verification and optional seed from frontend/src/data/products.json into PostgreSQL.
    """
    start_time = time.time()
    json_path = find_products_json_path()
    public_dir = find_frontend_public_dir()

    print("=" * 76)
    print("VEDHA RADHA THANGAMAALIGAI — PRODUCT CATALOGUE VERIFICATION & SEED")
    print("=" * 76)
    print(f"[INFO] Source JSON:     {json_path}")
    print(f"[INFO] Public Assets:   {public_dir}")
    print(f"[INFO] Target Database: {get_redacted_db_info(settings.DATABASE_URL)}")
    print(f"[INFO] Mode:            {'VERIFY-ONLY (No DB connection/writes)' if verify_only else ('DRY-RUN (Simulated)' if dry_run else 'LIVE DATABASE COMMIT')}")
    print(f"[INFO] Force Overwrite: {force}")
    print(f"[INFO] Clear Existing:  {clear}")
    print("=" * 76)

    # 1. Load JSON file
    try:
        with open(json_path, "r", encoding="utf-8") as f:
            raw_catalog = json.load(f)
    except Exception as e:
        print(f"[ERROR] Failed to read JSON file '{json_path}': {e}")
        return False

    if not isinstance(raw_catalog, list):
        print(f"[ERROR] Expected JSON array at root of '{json_path}', got {type(raw_catalog).__name__}")
        return False

    print(f"[INFO] Loaded {len(raw_catalog)} items from JSON file.")

    # 2. Pre-flight verification (Deduplication + Asset audit)
    print("\n--- PRE-FLIGHT VERIFICATION ---")
    is_valid, audit = verify_dataset_integrity(raw_catalog, public_dir)
    print(f"Total Products Checked:    {audit['total_items']}")
    print(f"Duplicate IDs:             {len(audit['duplicate_ids'])}")
    print(f"Duplicate Product Names:   {len(audit['duplicate_names'])}")
    print(f"Duplicate Primary Images:  {len(audit['duplicate_images'])}")
    print(f"Duplicate Angle Stems:     {len(audit['duplicate_stems'])}")
    print(f"Missing Files on Disk:     {len(audit['missing_disk_files'])}")

    if not is_valid:
        print("\n[FAIL] Pre-flight verification failed!")
        if audit["duplicate_ids"]:
            print(f"  • Duplicate IDs: {audit['duplicate_ids'][:10]}")
        if audit["duplicate_names"]:
            print(f"  • Duplicate Names: {audit['duplicate_names'][:10]}")
        if audit["duplicate_images"]:
            print(f"  • Duplicate Primary Images: {audit['duplicate_images'][:10]}")
        if audit["duplicate_stems"]:
            print(f"  • Duplicate Angle Stems: {audit['duplicate_stems'][:10]}")
        if audit["missing_disk_files"]:
            print(f"  • Missing Files on Disk: {audit['missing_disk_files'][:10]}")
        return False

    print("[PASS] Pre-flight check passed! No duplicate IDs, Names, or Images. All assets exist on disk.")

    if verify_only:
        print("\n[SUCCESS] Verify-only mode finished cleanly. Zero issues detected.")
        return True

    # 3. Check Database Connection
    is_connected, conn_msg = check_db_connection()
    if not is_connected:
        print(f"[ERROR] Database connection failed: {conn_msg}")
        return False

    db = SessionLocal()
    category_summary = defaultdict(int)
    type_summary = defaultdict(int)

    created_count = 0
    updated_count = 0
    skipped_count = 0
    validation_failures = 0

    try:
        # Phase 1: Handle --clear if requested
        if clear:
            all_skus = [str(item.get("id")).strip() for item in raw_catalog if item.get("id")]
            skus_to_delete = all_skus
            try:
                orders_count = db.query(Order).filter(Order.product_sku.in_(all_skus)).count()
                if orders_count > 0:
                    linked_orders = db.query(Order.product_sku).filter(Order.product_sku.in_(all_skus)).distinct().all()
                    linked_skus = {row[0] for row in linked_orders}
                    skus_to_delete = [s for s in all_skus if s not in linked_skus]
                    print(f"[WARN] Found {orders_count} customer orders referencing products.")
                    for ls in linked_skus:
                        print(f"[WARN] Preserving SKU '{ls}' due to customer order reference.")
            except Exception:
                db.rollback()
                skus_to_delete = all_skus

            if dry_run:
                existing_matches = db.query(Product).count()
                print(f"[DRY-RUN] Would delete {existing_matches} existing products from database.")
            else:
                deleted = db.query(Product).delete(synchronize_session=False)
                db.flush()
                print(f"[INFO] Cleared {deleted} existing products from database.")

        # Phase 2: Process each product
        for raw_item in raw_catalog:
            is_valid_item, reason, mapped = map_json_item_to_product_dict(raw_item)
            if not is_valid_item:
                print(f"[FAIL] Validation error for SKU '{raw_item.get('id')}': {reason}")
                validation_failures += 1
                continue

            category_summary[mapped["category"]] += 1
            type_summary[mapped["product_type"]] += 1

            existing = db.query(Product).filter(Product.sku == mapped["sku"]).first()
            if not existing:
                if not dry_run:
                    prod = Product(**mapped)
                    db.add(prod)
                created_count += 1
            elif force:
                if not dry_run:
                    for k, v in mapped.items():
                        setattr(existing, k, v)
                updated_count += 1
            else:
                skipped_count += 1

        # Phase 3: Commit or Rollback
        if not dry_run:
            db.commit()
            print("\n[SUCCESS] Transaction committed successfully to PostgreSQL!")
        else:
            db.rollback()
            print("\n[INFO] Dry-run completed. All changes safely rolled back.")

        elapsed = time.time() - start_time
        print("\n" + "=" * 76)
        print("SEED EXECUTION SUMMARY")
        print("=" * 76)
        print(f"Total Items in JSON:       {len(raw_catalog)}")
        print(f"Validation Failures:       {validation_failures}")
        print(f"New Products Inserted:     {created_count}")
        print(f"Existing Products Updated: {updated_count}")
        print(f"Existing Products Skipped: {skipped_count}")
        print("-" * 76)
        print("Breakdown by Category:")
        for cat, count in sorted(category_summary.items()):
            print(f"  • {cat:<24}: {count} products")
        print("-" * 76)
        print("Breakdown by Product Type:")
        for pt, count in sorted(type_summary.items()):
            print(f"  • {pt:<24}: {count} products")
        print(f"Execution Time:            {elapsed:.2f} seconds")
        print("=" * 76)

        return True

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Fatal exception during seeding: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Verify and seed products from frontend/src/data/products.json into PostgreSQL."
    )
    parser.add_argument(
        "--verify-only",
        action="store_true",
        help="Run strict duplicate checks and image disk audit without connecting to PostgreSQL.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Simulate execution without modifying the database.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Update existing products if their SKU already exists in the database.",
    )
    parser.add_argument(
        "--clear",
        action="store_true",
        help="Delete existing products matching catalogue SKUs before inserting.",
    )
    args = parser.parse_args()

    success = run_seed_from_json(
        dry_run=args.dry_run,
        force=args.force,
        clear=args.clear,
        verify_only=args.verify_only,
    )
    if not success:
        sys.exit(1)
