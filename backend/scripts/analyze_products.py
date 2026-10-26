import sys
from pathlib import Path
from collections import Counter

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.db.session import SessionLocal
from app.models.product import Product

db = SessionLocal()
try:
    active_products = db.query(Product).filter(Product.is_active == True).order_by(Product.created_at.desc()).all()
    print(f"Total active products: {len(active_products)}")

    prefixes = Counter()
    names = Counter()
    test_products = []
    legit_products = []

    for p in active_products:
        prefix = p.sku.split('-')[0] if '-' in p.sku else p.sku
        prefixes[prefix] += 1
        names[p.name] += 1

        is_test = any(p.sku.startswith(t) for t in ["SH1-", "SH2-", "REPL-", "MINIO-", "TEST-", "UPD-", "ACT1-", "ACT2-", "XLSX-", "DEL-", "LIVE-", "DRY-"]) or p.name in ["Shared 1", "Shared 2", "Repl Item", "MinIO Royal Temple Choker", "22K Royal Peacock Bangle", "Silver Pooja Lamp (Engraved)", "Actual Silver Toe Ring", "Antique Gold Jhumka", "Excel Imported Bracelet", "Temporary Item", "Actual Item", "Test Item"]

        if is_test:
            test_products.append(p)
        else:
            legit_products.append(p)

    print("\n--- SKU Prefixes ---")
    for k, v in prefixes.most_common():
        print(f"  {k:<10}: {v}")

    print("\n--- Product Names ---")
    for k, v in names.most_common():
        print(f"  {k:<35}: {v}")

    print(f"\n--- Summary ---")
    print(f"Legitimate products: {len(legit_products)}")
    for p in legit_products:
        print(f"  - SKU: {p.sku:<10} | Name: {p.name:<30} | Img: {p.image_url}")

    print(f"\nTest products: {len(test_products)}")
finally:
    db.close()
