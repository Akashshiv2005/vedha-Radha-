import sys
from pathlib import Path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.db.session import SessionLocal
from app.models.product import Product
from sqlalchemy import or_, and_, func

db = SessionLocal()
try:
    all_pooja = db.query(Product).filter(
        and_(
            or_(
                func.lower(Product.category).like("%pooja%"),
                func.lower(func.coalesce(Product.sub_category, "")).like("%pooja%"),
                func.lower(Product.name).like("%pooja%"),
                func.lower(func.coalesce(Product.sub_category, "")).like("%idol%"),
                func.lower(Product.name).like("%murti%"),
                func.lower(Product.name).like("%vilakku%"),
                func.lower(Product.name).like("%kalash%"),
                func.lower(Product.name).like("%deepam%"),
                func.lower(Product.name).like("%thali%"),
                func.lower(Product.name).like("%aarti%"),
            ),
            Product.product_type != "gold",
            ~func.lower(Product.category).like("%gold%"),
            ~func.lower(Product.name).like("%gold%"),
        )
    ).all()
    print(f"Total sacred silver pooja & idol items in PostgreSQL: {len(all_pooja)}")
    for p in all_pooja:
        print(f"[{p.sku}] {p.name} | Cat: {p.category} | SubCat: {p.sub_category} | Img: {p.image_url}")
finally:
    db.close()
