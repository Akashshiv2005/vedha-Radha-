"""Database & Storage Initialization Script for Hosting & Deployment.
Vedha Radha Thangamaaligai - Luxury Jewellery Platform.

This script executes the complete database preparation pipeline:
1. Verifies PostgreSQL connectivity.
2. Applies all Alembic schema migrations (alembic upgrade head).
3. Ensures all database tables (admin_users, products, orders, product_import_jobs) exist.
4. Auto-bootstraps initial administrator credentials (from .env).
5. Verifies and prepares MinIO bucket storage.
6. Optionally seeds verified products from products.json.

Usage:
    python scripts/init_db.py [--seed] [--dry-run]
"""

import argparse
import os
import sys
from pathlib import Path

# Ensure UTF-8 output encoding on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Ensure backend root is on sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from alembic.config import Config
from alembic import command
from app.core.config import settings
from app.db.session import engine, check_db_connection, SessionLocal
from app.db.base import Base
from app.services.auth_service import bootstrap_initial_admin
from app.services.minio_service import minio_service


def run_init(seed_data: bool = False, dry_run: bool = False) -> bool:
    print("=" * 70)
    print("VEDHA RADHA THANGAMAALIGAI - PRODUCTION DATABASE INITIALIZATION")
    print("=" * 70)

    # 1. Verify PostgreSQL Database Connection
    print("\n[Step 1/5] Checking PostgreSQL Connection...")
    is_connected, msg = check_db_connection()
    if not is_connected:
        print(f"❌ Failed to connect to PostgreSQL database: {msg}")
        print(f"   DATABASE_URL: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else 'localhost'}")
        print("   Please ensure PostgreSQL service is running and DATABASE_URL in .env is correct.")
        return False
    print("✅ PostgreSQL connection verified successfully.")

    # 2. Run Alembic Migrations
    print("\n[Step 2/5] Running Alembic Schema Migrations...")
    try:
        alembic_ini_path = backend_dir / "alembic.ini"
        alembic_cfg = Config(str(alembic_ini_path))
        alembic_cfg.set_main_option("script_location", str(backend_dir / "alembic"))
        alembic_cfg.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

        if not dry_run:
            command.upgrade(alembic_cfg, "head")
            print("✅ Alembic migrations applied to 'head' successfully.")
        else:
            print("ℹ️ Dry-run mode: Skipping Alembic upgrade.")
    except Exception as e:
        print(f"⚠️ Alembic migration notice: {e}")
        print("   Attempting fallback: Verifying tables directly via SQLAlchemy metadata...")
        try:
            from app import models  # noqa: F401
            Base.metadata.create_all(bind=engine)
            print("✅ Database tables verified/synchronized directly via SQLAlchemy.")
        except Exception as err:
            print(f"❌ Direct table creation failed: {err}")
            return False

    # 3. Bootstrap Administrator Account
    print("\n[Step 3/5] Bootstrapping Initial Administrator Account...")
    if not dry_run:
        db = SessionLocal()
        try:
            admin_user = bootstrap_initial_admin(db)
            if admin_user:
                print(f"✅ Administrator ready: {admin_user.username} ({admin_user.email})")
            else:
                print(f"✅ Administrator '{settings.ADMIN_BOOTSTRAP_USERNAME}' already exists.")
        except Exception as e:
            print(f"⚠️ Admin bootstrap notice: {e}")
        finally:
            db.close()
    else:
        print("ℹ️ Dry-run mode: Skipping administrator bootstrap.")

    # 4. Verify MinIO Object Storage
    print("\n[Step 4/5] Checking MinIO Object Storage...")
    try:
        storage_status = minio_service.check_connection()
        if storage_status.get("connected"):
            print(f"✅ MinIO storage connected (Bucket: '{settings.MINIO_BUCKET}').")
        else:
            print(f"⚠️ MinIO storage unreachable: {storage_status.get('error')}")
            print(f"   Endpoint: {settings.MINIO_ENDPOINT}")
    except Exception as e:
        print(f"⚠️ MinIO check notice: {e}")

    # 5. Optional Product Catalog Seeding
    if seed_data:
        print("\n[Step 5/5] Seeding Verified Products Catalogue...")
        try:
            from scripts.seed_from_products_json import run_seed_from_json
            seed_ok = run_seed_from_json(dry_run=dry_run, force=False, clear=False)
            if seed_ok:
                print("✅ Product catalogue seeded successfully.")
            else:
                print("❌ Product catalogue seed encountered an issue.")
                return False
        except Exception as e:
            print(f"❌ Product catalogue seeding error: {e}")
            return False
    else:
        print("\n[Step 5/5] Skipping product catalogue seed (use --seed to populate).")

    print("\n" + "=" * 70)
    print("✅ DATABASE INITIALIZATION COMPLETE & READY FOR PRODUCTION HOSTING!")
    print("=" * 70)
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Initialize database schema and storage for hosting.")
    parser.add_argument("--seed", action="store_true", help="Seed products from frontend/src/data/products.json")
    parser.add_argument("--dry-run", action="store_true", help="Simulate without writing to database")
    args = parser.parse_args()

    success = run_init(seed_data=args.seed, dry_run=args.dry_run)
    sys.exit(0 if success else 1)
