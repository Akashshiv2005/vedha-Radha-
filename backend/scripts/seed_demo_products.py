"""
Explicit Development-Only Demo Products Seed Script.
Vedha Radha Thangamaaligai — Jewellery E-commerce Platform.

Features:
    - Dynamically discovers real product images from frontend/public/images/products and coins-bars.
    - Matches authentic, multi-view gallery photos to products based on category, subcategory, and title.
    - Fixes placeholder and missing images across the PostgreSQL database.
    - Idempotent and safe: never deletes real inventory or customer-referenced products.
    - Supports --dry-run for complete simulation without database writes.
"""

import argparse
import os
import re
import sys
from collections import defaultdict
from decimal import Decimal
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple
from urllib.parse import urlparse

# Add backend directory to sys.path
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
from app.services.product_service import SEED_PRODUCTS

ALLOWED_IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}


def find_frontend_public_dir() -> Path:
    """Dynamically discover the frontend public directory."""
    candidates = [
        backend_dir.parent / "frontend" / "public",
        Path.cwd() / "frontend" / "public",
        Path.cwd() / "public",
    ]
    for c in candidates:
        if c.is_dir() and (c / "images").is_dir():
            return c.resolve()
    raise FileNotFoundError("Could not locate frontend/public/images directory. Please verify repository layout.")


class ImageAssetCatalog:
    """
    Dynamically discovers and indexes real jewellery image assets from the filesystem.
    No hardcoded file lists or assumptions — discovers all assets at runtime.
    """

    def __init__(self, public_dir: Path):
        self.public_dir = public_dir
        self.img_root = public_dir / "images"
        self.groups: Dict[str, Dict[str, Any]] = defaultdict(
            lambda: {"urls": [], "metal": "", "subcat": "", "tokens": set(), "base": "", "is_subfolder": False}
        )
        self.category_counts: Dict[str, int] = defaultdict(int)
        self.total_image_files = 0
        self._discover()

    def _discover(self) -> None:
        """Recursively scan filesystem and group multi-view variants (-01, -02, -03)."""
        pattern = re.compile(r"^(.*?)(?:[-_]0?([1-3]))?(\.[a-zA-Z0-9]+)$")

        for p in self.img_root.glob("**/*"):
            if not p.is_file() or p.suffix.lower() not in ALLOWED_IMAGE_EXTS:
                continue

            rel = p.relative_to(self.img_root)
            parts = rel.parts
            top = parts[0].lower()

            if top not in ("products", "coins-bars"):
                continue

            parent_dirs = rel.parent.parts
            is_subfolder = False

            if top == "products":
                metal = parent_dirs[1].lower() if len(parent_dirs) > 1 else "gold"
                if len(parent_dirs) > 2:
                    subcat = parent_dirs[2].lower()
                    is_subfolder = True
                else:
                    subcat = "general"
            else:
                metal = "coins_bars"
                subcat = "coins_bars"
                is_subfolder = True

            # Group category count
            cat_label = "Gold Jewellery" if metal == "gold" else ("Silver Jewellery" if metal == "silver" else "Coins & Bars")
            self.category_counts[cat_label] += 1
            self.total_image_files += 1

            # Match variant index
            m = pattern.match(p.name)
            base_name = m.group(1) if m else p.stem
            idx = int(m.group(2)) if (m and m.group(2)) else 1

            # Web URL relative to public directory (forward slashes, browser-safe)
            web_url = "/" + str(p.relative_to(self.public_dir)).replace(os.sep, "/")
            key = f"{metal}/{subcat}/{base_name}"

            self.groups[key]["urls"].append((idx, web_url))
            self.groups[key]["metal"] = metal
            self.groups[key]["subcat"] = subcat
            self.groups[key]["base"] = base_name
            self.groups[key]["is_subfolder"] = is_subfolder

            tokens = set(re.findall(r"[a-z0-9]+", f"{metal} {subcat} {base_name}".lower()))
            self.groups[key]["tokens"].update(tokens)

        # Sort urls by variant index and cap at 3 images
        for k, data in self.groups.items():
            sorted_urls = [u for idx, u in sorted(data["urls"], key=lambda x: x[0])]
            data["urls"] = sorted_urls[:3]

    def match_product(
        self,
        name: str,
        category: str,
        sub_category: Optional[str] = None,
        used_keys: Optional[Set[str]] = None,
    ) -> Optional[List[str]]:
        """Intelligently match product to an authentic, distinct image group."""
        text = f"{name or ''} {category or ''} {sub_category or ''}".lower()

        # 1. Determine metal
        if any(k in text for k in ["coin", "bar", "bullion"]):
            metal = "coins_bars"
        elif any(k in text for k in ["silver", "925", "pooja", "payal", "kolusu", "metti", "murti", "idol", "kinnam", "bowl"]):
            metal = "silver"
        else:
            metal = "gold"

        # 2. Identify target subcategory keyword
        sub_kw = None
        for kw in [
            "studs", "jhumka", "jhumkas", "drops", "hangings", "bali", "hoop", "earring", "earrings",
            "engagement", "solitaire", "casual", "band", "ring", "rings",
            "bangle", "bangles", "kada", "bracelet", "bracelets",
            "chain", "chains", "rope",
            "haram", "choker", "necklace", "necklaces",
            "nosepin", "mookuthi",
            "pendant", "pendants", "locket",
            "anklet", "anklets", "payal", "kolusu",
            "coin", "coins", "bar", "bars",
            "pooja", "idol", "idols", "bowl",
        ]:
            if kw in text:
                sub_kw = kw
                break

        prod_tokens = set(re.findall(r"[a-z0-9]+", text))
        best_key = None
        best_score = -999

        for key, data in self.groups.items():
            if data["metal"] != metal:
                continue

            score = 0
            if data["is_subfolder"]:
                score += 10  # Prefer organized subfolder over root folder

            if sub_kw and (sub_kw in data["subcat"] or sub_kw in data["tokens"]):
                score += 50
            elif sub_kw and data["subcat"] not in ("coins_bars", "general"):
                # Penalize mismatched jewellery types (never put earrings on a ring, etc.)
                if any(x in sub_kw for x in ["ring", "band"]) and "ring" not in data["subcat"]:
                    score -= 100
                elif any(x in sub_kw for x in ["earring", "stud", "jhumka", "drop", "hanging"]) and "earring" not in data["subcat"]:
                    score -= 100
                elif any(x in sub_kw for x in ["necklace", "haram", "choker"]) and "necklace" not in data["subcat"]:
                    score -= 100
                elif any(x in sub_kw for x in ["chain"]) and "chain" not in data["subcat"]:
                    score -= 100
                elif any(x in sub_kw for x in ["bangle", "bracelet"]) and "bangle" not in data["subcat"]:
                    score -= 100
                elif any(x in sub_kw for x in ["anklet", "payal"]) and "anklet" not in data["subcat"]:
                    score -= 100

            # Token overlap
            common = prod_tokens.intersection(data["tokens"])
            score += len(common) * 12

            # Distinctness bonus to prevent image repetition across unrelated products
            if used_keys and key not in used_keys:
                score += 20

            if score > best_score:
                best_score = score
                best_key = key

        if best_key and best_score > 0:
            if used_keys is not None:
                used_keys.add(best_key)
            return self.groups[best_key]["urls"]

        return None


def is_generic_or_missing_image(image_url: Optional[str], name: str, category: str, public_dir: Path) -> bool:
    """Determine whether a product image reference is missing, broken, or a placeholder."""
    if not image_url or not str(image_url).strip():
        return True

    clean = str(image_url).strip().lower()
    if "neutral_product_placeholder.svg" in clean or "placeholder" in clean:
        return True

    # Check if file exists on disk
    local_file = public_dir / clean.lstrip("/")
    if not local_file.exists():
        return True

    text = f"{name} {category}".lower()
    # Check for mismatched legacy placeholders:
    # 1. Gold chain image on non-chains (e.g. rings, harams, coins)
    if "product_gold_chain.jpg" in clean and not any(k in text for k in ["chain", "chains", "rope"]):
        return True
    # 2. Anklet image on non-anklets (e.g. chokers, necklaces)
    if "product_anklet.jpg" in clean and not any(k in text for k in ["anklet", "kolusu", "payal"]):
        return True

    return False


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


def validate_product_data(item: Dict[str, Any]) -> Tuple[bool, str, Dict[str, Any]]:
    """Validate and sanitize a seed product dictionary."""
    clean = dict(item)

    # 1. SKU validation
    sku = str(clean.get("sku", "")).strip()
    if not sku:
        return False, "Missing or empty SKU", clean
    clean["sku"] = sku

    # 2. Name validation
    name = str(clean.get("name", "")).strip()
    if not name:
        return False, f"Missing product name for SKU '{sku}'", clean
    clean["name"] = name

    # 3. Category validation
    category = str(clean.get("category", "")).strip()
    if not category:
        return False, f"Missing category for SKU '{sku}'", clean
    clean["category"] = category

    # 4. Price validation
    price = clean.get("price")
    try:
        price_dec = Decimal(str(price))
        if price_dec < Decimal("0"):
            return False, f"Price cannot be negative for SKU '{sku}' ({price_dec})", clean
        clean["price"] = price_dec
    except Exception as e:
        return False, f"Invalid price format for SKU '{sku}': {e}", clean

    # 5. Product type normalization/inference
    pt = clean.get("product_type")
    norm_pt = normalize_product_type(pt) if pt else infer_product_type(category)
    clean["product_type"] = norm_pt

    # 6. Images gallery list normalization
    images = clean.get("images")
    image_url = clean.get("image_url")
    clean_images: List[str] = []
    if images and isinstance(images, list):
        for img in images:
            norm_img = normalize_image_reference(img)
            if norm_img and norm_img not in clean_images:
                clean_images.append(norm_img)
    elif image_url:
        norm_img = normalize_image_reference(image_url)
        if norm_img:
            clean_images.append(norm_img)

    clean["images"] = clean_images[:3]
    if not clean.get("image_url") and clean_images:
        clean["image_url"] = clean_images[0]

    # 7. Status validation
    status = str(clean.get("status", "available")).strip().lower()
    allowed_statuses = ("available", "reserved", "sold", "sold_showroom", "unavailable")
    if status not in allowed_statuses:
        return False, f"Invalid status '{status}' for SKU '{sku}'. Allowed: {allowed_statuses}", clean
    clean["status"] = status

    # 8. Item type validation
    item_type = str(clean.get("item_type", "regular")).strip().lower()
    if item_type not in ("unique", "regular"):
        return False, f"Invalid item_type '{item_type}' for SKU '{sku}'. Allowed: ('unique', 'regular')", clean
    clean["item_type"] = item_type

    return True, "Valid", clean


def run_seed(
    dry_run: bool = False,
    force: bool = False,
    clear: bool = False,
    sync_images: bool = True,
) -> bool:
    """
    Run seed and image synchronization with dynamic asset discovery and database persistence.
    """
    public_dir = find_frontend_public_dir()
    catalog = ImageAssetCatalog(public_dir)

    redacted_target = get_redacted_db_info(settings.DATABASE_URL)
    print("=" * 70)
    print("VEDHA RADHA THANGAMAALIGAI — DYNAMIC SEED & IMAGE SYNCHRONIZATION")
    print("=" * 70)
    print(f"[INFO] Target Database:    {redacted_target}")
    print(f"[INFO] Frontend Assets:    {public_dir}")
    print(f"[INFO] Discovered Images:  {catalog.total_image_files} files across {len(catalog.groups)} design groups")
    for cat_name, cnt in sorted(catalog.category_counts.items()):
        print(f"       • {cat_name}: {cnt} files")
    print(f"[INFO] Mode:               {'DRY-RUN (No DB modifications)' if dry_run else 'LIVE DATABASE COMMIT'}")
    print(f"[INFO] Force Overwrite:    {force}")
    print(f"[INFO] Clear Seed SKUs:    {clear}")
    print(f"[INFO] Sync Product Images:{sync_images}")
    print("=" * 70)

    is_connected, msg = check_db_connection()
    if not is_connected:
        print(f"[ERROR] Database connection failed: {msg}")
        return False

    db = SessionLocal()
    total_considered = len(SEED_PRODUCTS)
    eligible_inserts = 0
    eligible_updates = 0
    skipped_existing = 0
    validation_failures = 0
    created_count = 0
    updated_count = 0
    cleared_count = 0

    # Image sync tracking
    products_inspected = 0
    images_updated = 0
    images_preserved = 0
    unmatched_products = 0

    used_design_keys: Set[str] = set()
    transaction_outcome = "PENDING"

    try:
        # Phase 1: Handle --clear safely without violating orders
        if clear:
            seed_skus = [p["sku"] for p in SEED_PRODUCTS if "sku" in p]
            orders_count = db.query(Order).filter(Order.product_sku.in_(seed_skus)).count()
            if orders_count > 0:
                print(f"[WARN] Found {orders_count} customer order(s) referencing seed SKUs.")
                linked_orders = db.query(Order.product_sku).filter(Order.product_sku.in_(seed_skus)).distinct().all()
                linked_skus = {row[0] for row in linked_orders}
                skus_to_delete = [s for s in seed_skus if s not in linked_skus]
                for ls in linked_skus:
                    print(f"[WARN] Preserving SKU '{ls}' from deletion due to existing customer order reference.")
            else:
                skus_to_delete = seed_skus

            if skus_to_delete:
                if dry_run:
                    existing_in_db = db.query(Product).filter(Product.sku.in_(skus_to_delete)).count()
                    print(f"[DRY-RUN] Would delete {existing_in_db} existing demo product(s) matching seed SKUs.")
                    cleared_count = existing_in_db
                else:
                    deleted = db.query(Product).filter(Product.sku.in_(skus_to_delete)).delete(synchronize_session=False)
                    db.flush()
                    cleared_count = deleted
                    print(f"[INFO] Cleared {deleted} seed product(s).")

        # Phase 2: Seed / Update SEED_PRODUCTS with dynamically matched authentic images
        for raw_item in SEED_PRODUCTS:
            is_valid, reason, item = validate_product_data(raw_item)
            if not is_valid:
                print(f"[FAIL] Validation error for SKU '{raw_item.get('sku')}': {reason}")
                validation_failures += 1
                continue

            # Ensure image is dynamically matched from catalog if missing or generic
            if is_generic_or_missing_image(item.get("image_url"), item["name"], item["category"], public_dir):
                matched_imgs = catalog.match_product(item["name"], item["category"], item.get("sub_category"), used_design_keys)
                if matched_imgs:
                    item["image_url"] = matched_imgs[0]
                    item["images"] = matched_imgs[:3]

            existing = db.query(Product).filter(Product.sku == item["sku"]).first()
            if not existing:
                eligible_inserts += 1
                if not dry_run:
                    prod = Product(**item, is_active=True)
                    db.add(prod)
                    created_count += 1
                else:
                    print(f"[DRY-RUN] Eligible for insert: SKU='{item['sku']}' Image='{item.get('image_url')}'")
            elif force:
                eligible_updates += 1
                if not dry_run:
                    for k, v in item.items():
                        setattr(existing, k, v)
                    existing.is_active = True
                    updated_count += 1
                else:
                    print(f"[DRY-RUN] Eligible for update (--force): SKU='{item['sku']}' Image='{item.get('image_url')}'")
            else:
                skipped_existing += 1
                print(f"[INFO] SKU '{item['sku']}' already exists in database. Skipped insertion (use --force to overwrite).")

        # Phase 3: Synchronize and enrich images across all existing database products
        if sync_images:
            db_products = db.query(Product).all()
            products_inspected = len(db_products)

            for prod in db_products:
                needs_update = False
                if force:
                    needs_update = True
                else:
                    needs_update = is_generic_or_missing_image(prod.image_url, prod.name, prod.category, public_dir)

                if needs_update:
                    matched_urls = catalog.match_product(prod.name, prod.category, prod.sub_category, used_design_keys)
                    if matched_urls:
                        images_updated += 1
                        if not dry_run:
                            prod.image_url = matched_urls[0]
                            prod.images = matched_urls[:3]
                            # Ensure product_type is also normalized
                            if not prod.product_type:
                                prod.product_type = normalize_product_type(prod.category) or infer_product_type(prod.category)
                        else:
                            print(f"[DRY-RUN] Would update SKU '{prod.sku}' ({prod.name}) -> {matched_urls[0]} ({len(matched_urls)} views)")
                    else:
                        unmatched_products += 1
                        print(f"[WARN] No matching real image found for SKU '{prod.sku}' ({prod.name}). Preserving current reference.")
                else:
                    images_preserved += 1

        # Phase 4: Transaction Commit or Safe Rollback
        if dry_run:
            db.rollback()
            transaction_outcome = "DRY-RUN (NO CHANGES APPLIED)"
            print("\n[DRY-RUN] Simulation completed safely. Zero writes committed to PostgreSQL.")
        else:
            db.commit()
            transaction_outcome = "COMMITTED SUCCESSFULLY"
            print("\n[SUCCESS] Seeding and image synchronization committed to PostgreSQL successfully.")

    except Exception as e:
        db.rollback()
        transaction_outcome = f"ROLLED BACK (FAILURE: {e})"
        print(f"\n[ERROR] Seeding transaction rolled back: {e}")
        return False
    finally:
        db.close()

    # Phase 5: Structured Execution Summary Report
    print("\n" + "=" * 70)
    print("FINAL SEED & IMAGE SYNCHRONIZATION AUDIT REPORT")
    print("=" * 70)
    print(f"Mode:                         {'DRY-RUN' if dry_run else 'LIVE DATABASE COMMIT'}")
    print(f"Database Target:              {redacted_target}")
    print(f"Discovered Image Assets:      {catalog.total_image_files} files across {len(catalog.groups)} design groups")
    for cat_name, cnt in sorted(catalog.category_counts.items()):
        print(f"  • {cat_name:<26}: {cnt} files")
    print("-" * 70)
    print(f"Products Inspected in DB:     {products_inspected}")
    print(f"Product Images Updated:       {images_updated}")
    print(f"Existing Valid Images Kept:   {images_preserved}")
    print(f"Unmatched Products:           {unmatched_products}")
    print(f"New Demo Products Inserted:   {created_count}")
    print(f"Existing SKUs Skipped:        {skipped_existing}")
    print(f"Demo Products Cleared:        {cleared_count}")
    print(f"Validation Failures:          {validation_failures}")
    print(f"Transaction Outcome:          {transaction_outcome}")
    print("=" * 70 + "\n")

    return validation_failures == 0 and unmatched_products == 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed demo products and synchronize real images from public assets.")
    parser.add_argument("--dry-run", action="store_true", help="Simulate execution without modifying PostgreSQL.")
    parser.add_argument("--force", action="store_true", help="Overwrite existing records and force image re-matching.")
    parser.add_argument("--clear", action="store_true", help="Delete existing seed products before re-inserting.")
    parser.add_argument("--no-sync-images", action="store_false", dest="sync_images", help="Skip synchronizing missing images on existing products.")
    args = parser.parse_args()

    success = run_seed(dry_run=args.dry_run, force=args.force, clear=args.clear, sync_images=args.sync_images)
    if not success:
        sys.exit(1)

