from decimal import Decimal
from pathlib import Path
import pytest
from app.db.session import SessionLocal
from app.models.product import Product
from scripts.seed_from_products_json import (
    get_redacted_db_info,
    map_json_item_to_product_dict,
    infer_catalog_product_type,
    verify_dataset_integrity,
    find_frontend_public_dir,
    find_products_json_path,
    run_seed_from_json,
)


def test_get_redacted_db_info():
    """Verify credentials and passwords are never exposed in connection strings."""
    url = "postgresql+psycopg://my_admin_user:super_secret_pwd@db-host.internal:5432/my_jewelry_db"
    redacted = get_redacted_db_info(url)
    assert "super_secret_pwd" not in redacted
    assert "my_admin_user" not in redacted
    assert "db-host.internal:5432/my_jewelry_db" in redacted


def test_infer_catalog_product_type():
    """Verify product_type inference logic from category and keywords."""
    assert infer_catalog_product_type({"category": "Gold Jewellery", "name": "Bangle"}) == "gold"
    assert infer_catalog_product_type({"category": "Silver Jewellery", "name": "Payal"}) == "silver"
    assert infer_catalog_product_type({"category": "Coins & Bars", "name": "Gold Coin"}) == "coins_bars"


def test_map_json_item_to_product_dict_valid():
    """Valid raw product maps correctly to product dictionary."""
    valid_raw = {
        "id": "VR-TEST-001",
        "name": "22K Traditional Gold Bangle",
        "category": "Gold Jewellery",
        "price": "₹ 45,000",
        "numericPrice": 45000,
        "image": "/images/bangle.jpg",
        "badgeType": "in-stock",
        "purity": "22K BIS 916",
        "weight": "8.5g",
    }
    is_valid, msg, clean = map_json_item_to_product_dict(valid_raw)
    assert is_valid is True
    assert msg == "Valid"
    assert clean["sku"] == "VR-TEST-001"
    assert clean["name"] == "22K Traditional Gold Bangle"
    assert clean["price"] == Decimal("45000")
    assert clean["product_type"] == "gold"


def test_map_json_item_to_product_dict_missing_fields():
    """Items without ID or name are rejected."""
    bad_id = {"id": "", "name": "No ID Item"}
    is_valid, msg, _ = map_json_item_to_product_dict(bad_id)
    assert is_valid is False
    assert "Missing 'id'" in msg

    bad_name = {"id": "VR-TEST-002", "name": ""}
    is_valid, msg, _ = map_json_item_to_product_dict(bad_name)
    assert is_valid is False
    assert "Missing 'name'" in msg


def test_verify_dataset_integrity():
    """Pre-flight verification accurately checks dataset integrity."""
    public_dir = find_frontend_public_dir()
    catalog_path = find_products_json_path()
    assert public_dir.is_dir()
    assert catalog_path.is_file()

    import json
    with open(catalog_path, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    is_valid, results = verify_dataset_integrity(catalog, public_dir)
    assert results["total_items"] > 0
    assert len(results["duplicate_ids"]) == 0
    assert len(results["duplicate_names"]) == 0


def test_seed_from_json_dry_run():
    """Dry run mode executes safely without altering product counts or creating records."""
    db = SessionLocal()
    try:
        initial_count = db.query(Product).count()
    finally:
        db.close()

    success = run_seed_from_json(dry_run=True, force=False, clear=False)
    assert success is True

    db = SessionLocal()
    try:
        after_count = db.query(Product).count()
        assert after_count == initial_count
    finally:
        db.close()
