"""
Explicit Development-Only Demo Products Seed Script.
Vedha Radha Thangamaaligai — Jewellery E-commerce Platform.

Features:
    - Dynamically discovers real product images from frontend/public/images/products and coins-bars.
    - Matches authentic, multi-view gallery photos to products based on category, subcategory, and title.
    - Strict category partitioning (earrings to earrings, rings to rings, coins to coins, bars to bars).
    - Least-frequently-used distribution to eliminate duplicate image assignments across products.
    - Fixes placeholder, broken, mismatched, and duplicate images across PostgreSQL.
    - Idempotent and safe: preserves real inventory and customer-referenced products.
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
    Groups multi-view variants (-01, -02, -03) and tracks usage counts to minimize repetition.
    """

    def __init__(self, public_dir: Path):
        self.public_dir = public_dir
        self.img_root = public_dir / "images"
        self.groups: Dict[str, Dict[str, Any]] = defaultdict(
            lambda: {"urls": [], "metal": "", "cat": "", "base": "", "tokens": set()}
        )
        self.usage_counts: Dict[str, int] = defaultdict(int)
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

            parent_parts = rel.parent.parts  # ('products', 'gold') or ('products', 'gold', 'rings') or ('coins-bars',)

            if top == "coins-bars":
                name_lower = p.name.lower()
                metal = "silver" if "silver" in name_lower else "gold"
                cat = "bars" if "bar" in name_lower else "coins"
            else:
                metal = parent_parts[1].lower() if len(parent_parts) > 1 else "gold"
                cat = parent_parts[2].lower() if len(parent_parts) > 2 else "general"
                if cat == "general":
                    fn = p.name.lower()
                    if any(k in fn for k in ["earring", "stud", "drop", "hanging", "jhumka", "hoop"]):
                        cat = "earrings"
                    elif any(k in fn for k in ["ring"]):
                        cat = "rings"
                    elif any(k in fn for k in ["bangle", "bracelet", "kada", "cuff"]):
                        cat = "bangles"
                    elif any(k in fn for k in ["necklace", "haram", "choker", "vaddanam"]):
                        cat = "necklaces"
                    elif any(k in fn for k in ["chain", "rope"]):
                        cat = "chains"
                    elif any(k in fn for k in ["nosepin", "mookuthi"]):
                        cat = "nosepin"
                    elif any(k in fn for k in ["pendant", "locket"]):
                        cat = "pendants"
                    elif any(k in fn for k in ["anklet", "payal", "kolusu"]):
                        cat = "anklets"
                    elif any(k in fn for k in ["pooja", "bell", "lamp", "thali", "kalash", "bowl", "kinnam"]):
                        cat = "pooja-items"
                    elif any(k in fn for k in ["idol", "murti", "balaji", "lakshmi", "ganesha"]):
                        cat = "silver-idols"

            # Standardize category names
            if cat in ("earrings", "studs", "drops", "hangings", "jhumkas", "hoops"):
                cat = "earrings"
            elif cat in ("rings", "ring"):
                cat = "rings"
            elif cat in ("bangles", "bracelets", "bangle & bracelets", "cuff", "cuffs", "kada"):
                cat = "bangles"
            elif cat in ("necklaces", "necklace", "harams", "chokers"):
                cat = "necklaces"
            elif cat in ("chains", "chain"):
                cat = "chains"
            elif cat in ("pendants", "pendant"):
                cat = "pendants"
            elif cat in ("nosepin", "nosepins", "mookuthi"):
                cat = "nosepin"
            elif cat in ("anklets", "anklet", "payal", "kolusu"):
                cat = "anklets"
            elif cat in ("pooja", "pooja-items", "utensil", "utensils"):
                cat = "pooja-items"
            elif cat in ("silver-idols", "idols", "idol", "murti"):
                cat = "silver-idols"

            # Category labels for audit stats
            if top == "coins-bars":
                cat_label = "Coins & Bars"
            elif metal == "silver":
                cat_label = "Silver Jewellery"
            else:
                cat_label = "Gold Jewellery"
            self.category_counts[cat_label] += 1
            self.total_image_files += 1

            # Match variant index
            m = pattern.match(p.name)
            base_name = m.group(1) if m else p.stem
            idx = int(m.group(2)) if (m and m.group(2)) else 1

            web_url = "/" + str(p.relative_to(self.public_dir)).replace(os.sep, "/")
            key = f"{metal}/{cat}/{base_name}"

            self.groups[key]["urls"].append((idx, web_url))
            self.groups[key]["metal"] = metal
            self.groups[key]["cat"] = cat
            self.groups[key]["base"] = base_name
            self.groups[key]["tokens"].update(set(re.findall(r"[a-z0-9]+", f"{metal} {cat} {base_name}".lower())))

        # Sort urls by variant index, prefer subfolder, keep max 1 per index (1, 2, 3), cap at 3 images
        for k, data in self.groups.items():
            by_idx = defaultdict(list)
            for idx, u in data["urls"]:
                by_idx[idx].append(u)
            sorted_urls = []
            for idx in sorted(by_idx.keys()):
                urls_for_idx = by_idx[idx]
                urls_for_idx.sort(key=lambda u: len(u.split("/")), reverse=True)
                sorted_urls.append(urls_for_idx[0])
            data["urls"] = sorted_urls[:3]

    def match_product(
        self,
        name: str,
        category: str,
        sub_category: Optional[str] = None,
        used_keys: Optional[Set[str]] = None,
        prod_type: Optional[str] = None,
    ) -> Optional[List[str]]:
        """Intelligently match product to an authentic, distinct image group."""
        text = f"{name or ''} {category or ''} {sub_category or ''}".lower()
        cat_lower = (category or "").lower()
        sub_lower = (sub_category or "").lower()

        # 1. Determine target metal strictly
        if "silver" in cat_lower or "silver" in (prod_type or "").lower() or (not "gold" in cat_lower and any(k in text for k in ["silver", "925", "pooja", "payal", "kolusu", "metti", "murti", "idol"])):
            target_metal = "silver"
        else:
            target_metal = "gold"

        # 2. Determine target category from Category and Subcategory first
        target_cat = None
        if any(k in cat_lower for k in ["coin", "coins"]) or any(k in sub_lower for k in ["coin", "coins"]):
            target_cat = "coins"
        elif any(k in cat_lower for k in ["bar", "bars"]) or any(k in sub_lower for k in ["bar", "bars"]):
            target_cat = "bars"
        elif "earring" in cat_lower or "earring" in sub_lower or any(k in sub_lower for k in ["stud", "jhumka", "drop", "hanging", "hoop"]):
            target_cat = "earrings"
        elif ("ring" in cat_lower or "ring" in sub_lower) and "earring" not in cat_lower and "earring" not in sub_lower:
            target_cat = "rings"
        elif any(k in cat_lower for k in ["bangle", "bracelet"]) or any(k in sub_lower for k in ["bangle", "bracelet", "kada", "cuff"]):
            target_cat = "bangles"
        elif any(k in cat_lower for k in ["necklace", "haram", "choker"]) or any(k in sub_lower for k in ["necklace", "haram", "choker"]):
            target_cat = "necklaces"
        elif "chain" in cat_lower or "chain" in sub_lower:
            target_cat = "chains"
        elif "pendant" in cat_lower or "pendant" in sub_lower:
            target_cat = "pendants"
        elif "nosepin" in cat_lower or "nosepin" in sub_lower or "mookuthi" in sub_lower:
            target_cat = "nosepin"
        elif "anklet" in cat_lower or "anklet" in sub_lower or any(k in sub_lower for k in ["payal", "kolusu"]):
            target_cat = "anklets"
        elif any(k in cat_lower for k in ["pooja", "utensil"]) or any(k in sub_lower for k in ["pooja", "utensil"]):
            target_cat = "pooja-items"
        elif any(k in cat_lower for k in ["idol", "murti"]) or any(k in sub_lower for k in ["idol", "murti"]):
            target_cat = "silver-idols"

        # Fallback to name keywords only if category was generic
        if not target_cat:
            for kw, c in [
                ("coin", "coins"), ("bar", "bars"),
                ("jhumka", "earrings"), ("stud", "earrings"), ("earring", "earrings"), ("drop", "earrings"), ("hanging", "earrings"),
                ("ring", "rings"), ("band", "rings"), ("metti", "rings"),
                ("bangle", "bangles"), ("bracelet", "bangles"), ("kada", "bangles"), ("cuff", "bangles"),
                ("necklace", "necklaces"), ("haram", "necklaces"), ("choker", "necklaces"),
                ("chain", "chains"), ("pendant", "pendants"), ("locket", "pendants"),
                ("nosepin", "nosepin"), ("mookuthi", "nosepin"),
                ("anklet", "anklets"), ("payal", "anklets"), ("kolusu", "anklets"),
                ("pooja", "pooja-items"), ("lamp", "pooja-items"), ("bell", "pooja-items"),
                ("idol", "silver-idols"), ("murti", "silver-idols")
            ]:
                if kw in text:
                    target_cat = c
                    break

        if not target_cat:
            target_cat = "general"

        # Gather candidates strictly matching metal and category
        candidates = []
        for key, data in self.groups.items():
            if data["metal"] != target_metal:
                continue
            if target_cat != "general" and data["cat"] != target_cat:
                continue
            candidates.append((key, data))

        # Safe fallback only within compatible sacred categories (pooja-items <-> silver-idols)
        if not candidates and target_cat in ("pooja-items", "silver-idols"):
            for key, data in self.groups.items():
                if data["metal"] == target_metal and data["cat"] in ("pooja-items", "silver-idols"):
                    candidates.append((key, data))

        if not candidates:
            return None

        # Identify subcategory keywords in product
        sub_keywords = []
        for kw in [
            ('jhumka', ['jhumka', 'jhumkas']),
            ('stud', ['stud', 'studs']),
            ('drop', ['drop', 'drops']),
            ('hanging', ['hanging', 'hangings']),
            ('hoop', ['hoop', 'hoops', 'bali']),
            ('engagement', ['engagement', 'solitaire']),
            ('casual', ['casual', 'band']),
            ('toe', ['toe', 'metti']),
            ('kada', ['kada', 'cuff', 'cuffs']),
            ('chain_bracelet', ['chain_bracelet', 'bracelet']),
            ('rope', ['rope']),
            ('choker', ['choker', 'chokers']),
            ('haram', ['haram', 'harams', 'long_necklace']),
            ('short_necklace', ['short_necklace']),
            ('locket', ['locket', 'pendant']),
            ('bell', ['bell']),
            ('lamp', ['lamp', 'diya']),
            ('balaji', ['balaji', 'venkateswara']),
            ('lakshmi', ['lakshmi', 'ashtalakshmi']),
            ('ganesha', ['ganesha', 'vinayaka']),
            ('om', ['om']),
        ]:
            if any(syn in text for syn in kw[1]):
                sub_keywords.extend(kw[1])

        # Subcategory candidate pool filtering
        matching_sub = []
        if sub_keywords:
            for key, data in candidates:
                tokens = data['tokens']
                base = data['base'].lower()
                if any(syn in tokens or syn in base for syn in sub_keywords):
                    matching_sub.append((key, data))

        active_pool = matching_sub if matching_sub else candidates

        prod_tokens = set(re.findall(r"[a-z0-9]+", text))
        scored = []
        for key, data in active_pool:
            u_count = self.usage_counts[key]
            # Extra penalty if already in caller's used_keys
            if used_keys and key in used_keys:
                u_count += 5
            tokens = data['tokens']
            sim = len(prod_tokens.intersection(tokens))
            scored.append((u_count, -sim, key, data['urls']))

        # Sort: lowest usage count first (distribute evenly), then highest token similarity
        scored.sort(key=lambda x: (x[0], x[1]))
        best_u, best_sim, best_key, urls = scored[0]

        self.usage_counts[best_key] += 1
        if used_keys is not None:
            used_keys.add(best_key)

        return urls


def is_generic_or_missing_image(
    image_url: Optional[str],
    name: str,
    category: str,
    sub_category: Optional[str],
    public_dir: Path,
) -> bool:
    """
    Determine whether a product image reference is missing, broken, a placeholder,
    or has a severe category/metal mismatch.
    """
    if not image_url or not str(image_url).strip():
        return True

    clean = str(image_url).strip().lower()
    if "neutral_product_placeholder.svg" in clean or "placeholder" in clean:
        return True

    # Check if file exists on disk
    local_file = public_dir / clean.lstrip("/")
    if not local_file.exists():
        return True

    text = f"{name or ''} {category or ''} {sub_category or ''}".lower()
    cat_lower = (category or "").lower()

    # Legacy placeholders
    if "product_gold_chain.jpg" in clean and not any(k in text for k in ["chain", "chains", "rope"]):
        return True
    if "product_anklet.jpg" in clean and not any(k in text for k in ["anklet", "kolusu", "payal"]):
        return True

    fn = Path(clean).name.lower()
    # 1. Rings assigned earring images
    if cat_lower == "rings" and any(k in fn for k in ["earring", "stud", "jhumka", "drop", "hanging", "hoop"]):
        return True
    # 2. Earrings assigned ring images
    if cat_lower == "earrings" and "ring" in fn and not any(k in fn for k in ["earring", "stud", "jhumka", "drop", "hanging", "hoop"]):
        return True
    # 3. Coins assigned bar images
    if "coin" in cat_lower and "bar" in fn and "coin" not in fn:
        return True
    # 4. Bars assigned coin images
    if "bar" in cat_lower and "coin" in fn and "bar" not in fn:
        return True
    # 5. Silver product assigned gold image
    if "silver" in cat_lower and "/gold/" in clean:
        return True
    # 6. Gold product assigned silver image
    if "gold" in cat_lower and "/silver/" in clean:
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
            if is_generic_or_missing_image(item.get("image_url"), item["name"], item["category"], item.get("sub_category"), public_dir):
                matched_imgs = catalog.match_product(item["name"], item["category"], item.get("sub_category"), used_design_keys, item.get("product_type"))
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

        # Phase 3: Synchronize and enrich images across all existing database products
        if sync_images:
            db_products = db.query(Product).order_by(Product.category, Product.sub_category, Product.name, Product.id).all()
            products_inspected = len(db_products)

            # Pre-count existing image URL assignments to detect duplicates
            url_usage_counts = defaultdict(int)
            for prod in db_products:
                if prod.image_url:
                    url_usage_counts[prod.image_url] += 1

            for prod in db_products:
                needs_update = False
                if force:
                    needs_update = True
                else:
                    is_bad = is_generic_or_missing_image(prod.image_url, prod.name, prod.category, prod.sub_category, public_dir)
                    # Check if this image URL is heavily duplicated (> 1 assignment)
                    is_duplicate = url_usage_counts.get(prod.image_url, 0) > 1
                    # Check if gallery has duplicate entries or is missing primary view
                    gallery_has_dups = False
                    if prod.images and isinstance(prod.images, list):
                        if len(prod.images) != len(set(prod.images)):
                            gallery_has_dups = True
                    needs_update = is_bad or is_duplicate or gallery_has_dups

                if needs_update:
                    matched_urls = catalog.match_product(prod.name, prod.category, prod.sub_category, used_design_keys, prod.product_type)
                    if matched_urls:
                        images_updated += 1
                        if not dry_run:
                            # Deduplicate gallery array, cap at 3, ensure primary is first
                            clean_gallery = []
                            for u in matched_urls:
                                if u not in clean_gallery:
                                    clean_gallery.append(u)
                            prod.image_url = clean_gallery[0]
                            prod.images = clean_gallery[:3]
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
