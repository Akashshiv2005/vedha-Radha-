"""
Live API & Database Consistency Verification Script
Vedha Radha Thangamaaligai — Jewellery E-commerce Platform
"""

import sys
import requests
from decimal import Decimal
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.product import Product

API_BASE = "http://127.0.0.1:8000"


def run_checks():
    print("=" * 65)
    print("STARTING LIVE API & POSTGRESQL VERIFICATION")
    print("=" * 65)

    # 1. Health check
    res = requests.get(f"{API_BASE}/api/health")
    print(f"1. Health check: status={res.status_code}, response={res.json()}")
    assert res.status_code == 200

    # 2. Public products list
    res = requests.get(f"{API_BASE}/api/products?page=1&page_size=10")
    print(f"2. Public products listing: status={res.status_code}")
    assert res.status_code == 200
    data = res.json()
    items = data.get("items", [])
    total = data.get("total", 0)
    print(f"   Total public products reported: {total}, fetched {len(items)} items")
    assert len(items) > 0

    # Compare with database count
    db = SessionLocal()
    try:
        db_active_count = db.query(Product).filter(Product.is_active == True).count()
        print(f"   Database active products count: {db_active_count}")
        assert total == db_active_count, f"API total ({total}) != DB active count ({db_active_count})"
        print("   [PASS] API total matches PostgreSQL active products count.")

        # 3. Verify Seed Product SA-001 in DB and via API
        db_sa001 = db.query(Product).filter(Product.sku == "SA-001").first()
        assert db_sa001 is not None, "SA-001 not found in PostgreSQL"
        print(f"3. DB SA-001: Name='{db_sa001.name}', Price={db_sa001.price}, Category='{db_sa001.category}', Type='{db_sa001.product_type}'")

        res_sku = requests.get(f"{API_BASE}/api/products/SA-001")
        print(f"   API GET /api/products/SA-001: status={res_sku.status_code}")
        assert res_sku.status_code == 200
        sku_data = res_sku.json()
        assert sku_data["sku"] == "SA-001"
        print(f"   sku_data keys: {list(sku_data.keys())}")
        product_name = sku_data.get("name") or sku_data.get("title")
        assert product_name == db_sa001.name
        print(f"   Product name verified: {product_name}")

        # 4. Verify Category / Product Type Filtering
        for ptype in ["gold", "silver", "coins_bars"]:
            res_type = requests.get(f"{API_BASE}/api/products?product_type={ptype}")
            assert res_type.status_code == 200
            type_items = res_type.json().get("items", [])
            print(f"4a. Product Type '{ptype}': found {len(type_items)} items via API")

        for cat in ["gold", "silver", "coins"]:
            res_cat = requests.get(f"{API_BASE}/api/products?category={cat}")
            assert res_cat.status_code == 200
            cat_items = res_cat.json().get("items", [])
            print(f"4b. Category query '{cat}': found {len(cat_items)} items via API")
            assert len(cat_items) > 0, f"Category '{cat}' returned 0 items!"

        # 5. Admin Authentication & Admin Products Listing
        login_res = requests.post(
            f"{API_BASE}/api/auth/login",
            json={"username": settings.ADMIN_BOOTSTRAP_USERNAME, "password": settings.ADMIN_BOOTSTRAP_PASSWORD},
        )
        print(f"5. Admin login: status={login_res.status_code}")
        assert login_res.status_code == 200
        token = login_res.json().get("access_token")
        assert token is not None

        headers = {"Authorization": f"Bearer {token}"}
        # Admin products without inactive
        admin_res = requests.get(f"{API_BASE}/api/admin/products?page=1&page_size=10", headers=headers)
        print(f"   Admin products listing (active only): status={admin_res.status_code}")
        assert admin_res.status_code == 200
        admin_data = admin_res.json()
        admin_active_total = admin_data.get("total", 0)
        assert admin_active_total == db_active_count
        print(f"   [PASS] Admin active products count ({admin_active_total}) matches DB active count ({db_active_count}).")

        # Admin products with inactive included
        admin_all_res = requests.get(f"{API_BASE}/api/admin/products?page=1&page_size=10&include_inactive=true", headers=headers)
        assert admin_all_res.status_code == 200
        admin_all_data = admin_all_res.json()
        admin_total_count = admin_all_data.get("total", 0)
        db_total_count = db.query(Product).count()
        assert admin_total_count == db_total_count
        print(f"   [PASS] Admin total products count with include_inactive=True ({admin_total_count}) matches DB total ({db_total_count}).")

    finally:
        db.close()

    print("=" * 65)
    print("ALL API AND DATABASE VERIFICATION CHECKS PASSED!")
    print("=" * 65)


if __name__ == "__main__":
    run_checks()
