import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.db.session import SessionLocal
from app.models.product import Product

db = SessionLocal()
try:
    products = db.query(Product).order_by(Product.created_at.desc()).all()
    print(f"Total products in DB: {len(products)}")
    active_count = sum(1 for p in products if p.is_active)
    print(f"Active products: {active_count}, Soft-deleted: {len(products) - active_count}")
    active_products = [p for p in products if p.is_active]
    print(f"Total active products: {len(active_products)}")
    print("\n--- ACTIVE PRODUCTS IN SHOWROOM CATALOGUE ---")
    for i, p in enumerate(active_products, 1):
        print(f"[{i:02d}] SKU: {p.sku:<14} | Name: {p.name:<32} | Cat: {p.category:<18} | Img: {str(p.image_url):<55} | Created: {p.created_at}")

    from app.services.minio_service import minio_service
    from app.core.config import settings
    minio_client = minio_service.get_client()
    objs = list(minio_client.list_objects(settings.MINIO_BUCKET, prefix="products/", recursive=True))
    print(f"\nTotal objects in MinIO '{settings.MINIO_BUCKET}': {len(objs)}")
    for obj in objs:
        print(f"  - {obj.object_name} ({obj.size} bytes)")
finally:
    db.close()
