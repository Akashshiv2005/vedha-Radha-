from decimal import Decimal
from pathlib import Path
import pytest
from app.db.session import SessionLocal
from app.models.product import Product
from app.models.order import Order
from scripts.seed_demo_products import (
    validate_product_data,
    get_redacted_db_info,
    run_seed,
)


def test_get_redacted_db_info():
    """Verify credentials and passwords are never exposed in connection strings."""
    url = "postgresql+psycopg://my_admin_user:super_secret_pwd@db-host.internal:5432/my_jewelry_db"
    redacted = get_redacted_db_info(url)
    assert "super_secret_pwd" not in redacted
    assert "my_admin_user" not in redacted
    assert "db-host.internal:5432/my_jewelry_db" in redacted


def test_validate_product_data_valid():
    """Valid product data passes validation and normalizes attributes."""
    valid_raw = {
        "sku": "TEST-VAL-01",
        "name": "Validation Test Ring",
        "category": "Gold Jewellery",
        "price": Decimal("25000.00"),
        "status": "available",
        "item_type": "regular",
        "image_url": "/images/ring.jpg",
    }
    is_valid, msg, clean = validate_product_data(valid_raw)
    assert is_valid is True
    assert msg == "Valid"
    assert clean["sku"] == "TEST-VAL-01"
    assert clean["product_type"] == "gold"
    assert clean["images"] == ["/images/ring.jpg"]


def test_validate_product_data_missing_fields():
    """Missing SKU or name is rejected."""
    bad_sku = {"sku": "", "name": "No SKU", "category": "Gold Jewellery", "price": 100}
    is_valid, msg, _ = validate_product_data(bad_sku)
    assert is_valid is False
    assert "Missing or empty SKU" in msg

    bad_name = {"sku": "VAL-02", "name": "", "category": "Gold Jewellery", "price": 100}
    is_valid, msg, _ = validate_product_data(bad_name)
    assert is_valid is False
    assert "Missing product name" in msg


def test_validate_product_data_negative_price():
    """Negative prices are rejected."""
    bad_price = {"sku": "VAL-03", "name": "Negative Price Item", "category": "Gold", "price": -50}
    is_valid, msg, _ = validate_product_data(bad_price)
    assert is_valid is False
    assert "negative" in msg.lower()


def test_validate_product_data_invalid_status_and_item_type():
    """Invalid statuses and item_types are rejected."""
    bad_status = {
        "sku": "VAL-04",
        "name": "Bad Status Item",
        "category": "Gold",
        "price": 1000,
        "status": "in_stock_fake",
    }
    is_valid, msg, _ = validate_product_data(bad_status)
    assert is_valid is False
    assert "Invalid status" in msg

    bad_item_type = {
        "sku": "VAL-05",
        "name": "Bad Item Type",
        "category": "Gold",
        "price": 1000,
        "status": "available",
        "item_type": "luxury_bundle",
    }
    is_valid, msg, _ = validate_product_data(bad_item_type)
    assert is_valid is False
    assert "Invalid item_type" in msg


def test_seed_demo_products_dry_run():
    """Dry run mode executes safely without altering product counts or creating records."""
    db = SessionLocal()
    try:
        initial_count = db.query(Product).count()
    finally:
        db.close()

    success = run_seed(dry_run=True, force=False, clear=False)
    assert success is True

    db = SessionLocal()
    try:
        after_count = db.query(Product).count()
        assert after_count == initial_count
    finally:
        db.close()


def test_seed_demo_products_idempotency():
    """Repeated runs of the seed script skip existing SKUs without duplicating records."""
    db = SessionLocal()
    try:
        count_before = db.query(Product).count()
    finally:
        db.close()

    # First run
    success1 = run_seed(dry_run=False, force=False, clear=False)
    assert success1 is True

    db = SessionLocal()
    try:
        count_mid = db.query(Product).count()
        # Second run
        success2 = run_seed(dry_run=False, force=False, clear=False)
        assert success2 is True
        count_after = db.query(Product).count()

        assert count_mid == count_after
        assert count_before == count_after
    finally:
        db.close()


def test_image_asset_catalog_discovery():
    """Verify that ImageAssetCatalog recursively discovers assets and categorizes them correctly."""
    from scripts.seed_demo_products import find_frontend_public_dir, ImageAssetCatalog

    public_dir = find_frontend_public_dir()
    assert public_dir.is_dir()

    catalog = ImageAssetCatalog(public_dir)
    assert catalog.total_image_files > 500
    assert catalog.category_counts["Gold Jewellery"] > 200
    assert catalog.category_counts["Silver Jewellery"] > 50
    assert catalog.category_counts["Coins & Bars"] > 20


def test_image_asset_catalog_matching():
    """Verify intelligent matching assigns category-accurate real images."""
    from scripts.seed_demo_products import find_frontend_public_dir, ImageAssetCatalog

    public_dir = find_frontend_public_dir()
    catalog = ImageAssetCatalog(public_dir)

    # Gold earrings match gold earrings
    gold_earring_urls = catalog.match_product(
        name="22K Traditional Ruby Studs",
        category="Earrings",
        sub_category="Studs",
    )
    assert gold_earring_urls is not None
    assert len(gold_earring_urls) >= 1
    assert "gold" in gold_earring_urls[0]
    assert "earrings" in gold_earring_urls[0] or "stud" in gold_earring_urls[0]

    # Silver anklet matches silver
    silver_urls = catalog.match_product(
        name="925 Silver Payal",
        category="Silver Jewellery",
        sub_category="Anklets & Kolusu",
    )
    assert silver_urls is not None
    assert "silver" in silver_urls[0]

    # Coin matches coins_bars
    coin_urls = catalog.match_product(
        name="24K Lakshmi Gold Coin 8g",
        category="Coins & Bars",
        sub_category="Gold Coins",
    )
    assert coin_urls is not None
    assert "coin" in coin_urls[0] or "bar" in coin_urls[0]


def test_strict_category_partitioning():
    """Verify that products never cross jewellery types (e.g., rings never get earrings, coins never get bars)."""
    from scripts.seed_demo_products import find_frontend_public_dir, ImageAssetCatalog

    public_dir = find_frontend_public_dir()
    catalog = ImageAssetCatalog(public_dir)

    # 1. Rings must never receive earring images
    ring_urls = catalog.match_product(
        name="Versatile Studs",  # Note: Product named 'Studs' but belongs to category 'Rings'
        category="Rings",
        sub_category="Casual Rings",
    )
    assert ring_urls is not None
    assert "ring" in ring_urls[0]
    assert "earring" not in ring_urls[0] and "stud" not in ring_urls[0]

    # 2. Earrings must never receive ring images
    earring_urls = catalog.match_product(
        name="22K Traditional Kemp Studs",
        category="Earrings",
        sub_category="Studs",
    )
    assert earring_urls is not None
    assert "ring" not in earring_urls[0] or "earring" in earring_urls[0]

    # 3. Coins must never receive bar images
    coin_urls = catalog.match_product(
        name="24K Ashtalakshmi Gold Coin 10g",
        category="Gold Coins",
    )
    assert coin_urls is not None
    coin_fn = Path(coin_urls[0]).name.lower()
    assert "coin" in coin_fn
    assert "bar" not in coin_fn

    # 4. Bars must never receive coin images
    bar_urls = catalog.match_product(
        name="999 Fine Pure Silver Bar 500g",
        category="Silver Bars",
    )
    assert bar_urls is not None
    bar_fn = Path(bar_urls[0]).name.lower()
    assert "bar" in bar_fn
    assert "coin" not in bar_fn

    # 5. Silver must never receive gold images
    silver_urls = catalog.match_product(
        name="925 Sterling Casual Band",
        category="Rings",
        sub_category="Casual Rings",
        prod_type="silver",
    )
    assert silver_urls is not None
    assert "silver" in silver_urls[0]
    assert "/gold/" not in silver_urls[0]


def test_gallery_deduplication_and_distribution():
    """Verify that gallery arrays contain at most 3 distinct URLs and distribute designs evenly."""
    from scripts.seed_demo_products import find_frontend_public_dir, ImageAssetCatalog

    public_dir = find_frontend_public_dir()
    catalog = ImageAssetCatalog(public_dir)

    assigned_primaries = []
    for i in range(5):
        urls = catalog.match_product(
            name=f"22K Traditional Ruby Studs {i}",
            category="Earrings",
            sub_category="Studs",
        )
        assert urls is not None
        # Max 3 images
        assert len(urls) <= 3
        # All URLs in gallery are distinct
        assert len(urls) == len(set(urls))
        assigned_primaries.append(urls[0])

    # Distinct designs were distributed across the 5 studs (not all identical)
    assert len(set(assigned_primaries)) >= 3


