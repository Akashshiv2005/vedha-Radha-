"""
Explicit Development-Only Demo Products Seed Script.
Vedha Radha Thangamaaligai — Jewellery E-commerce Platform.

Usage:
    python scripts/seed_demo_products.py [--force] [--clear]

Notes:
    - This script NEVER runs automatically in production or during normal application startup.
    - It only runs when explicitly invoked by a developer in a development environment.
"""

import argparse
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.db.session import SessionLocal, check_db_connection
from app.models.product import Product
from app.services.product_service import SEED_PRODUCTS


def run_seed(force: bool = False, clear: bool = False):
    is_connected, msg = check_db_connection()
    if not is_connected:
        print(f"[ERROR] Database connection failed: {msg}")
        sys.exit(1)

    db = SessionLocal()
    try:
        if clear:
            print("[INFO] Clearing existing demo products with matching seed SKUs...")
            skus = [p["sku"] for p in SEED_PRODUCTS]
            deleted = db.query(Product).filter(Product.sku.in_(skus)).delete(synchronize_session=False)
            db.commit()
            print(f"[INFO] Cleared {deleted} seed product(s).")

        created_count = 0
        updated_count = 0

        for item in SEED_PRODUCTS:
            existing = db.query(Product).filter(Product.sku == item["sku"]).first()
            if not existing:
                prod = Product(**item, is_active=True)
                db.add(prod)
                created_count += 1
            elif force:
                for k, v in item.items():
                    setattr(existing, k, v)
                existing.is_active = True
                updated_count += 1

        db.commit()
        print(f"[SUCCESS] Demo seed complete! Created: {created_count}, Updated: {updated_count}.")
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Failed during seeding: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Explicitly seed demo jewellery products for development.")
    parser.add_argument("--force", action="store_true", help="Overwrite existing seed products if present.")
    parser.add_argument("--clear", action="store_true", help="Delete existing seed products before re-inserting.")
    args = parser.parse_args()

    print("[NOTICE] Running explicit development seed script...")
    run_seed(force=args.force, clear=args.clear)
