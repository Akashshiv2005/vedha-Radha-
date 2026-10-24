"""
Demo Seed & Image Synchronization Script (Convenience Alias).
Vedha Radha Thangamaaligai — Jewellery E-commerce Platform.

Usage:
    python scripts/seed_demo.py [--dry-run] [--force] [--clear]
"""

import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from scripts.seed_demo_products import run_seed
import argparse

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
