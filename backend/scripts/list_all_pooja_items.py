import json

with open("frontend/src/data/products.json", "r", encoding="utf-8") as f:
    prods = json.load(f)

print(f"Total products in products.json: {len(prods)}")
pooja_silver = []
for p in prods:
    cat = (p.get("category") or "").lower()
    sub = (p.get("subCategory") or p.get("sub_category") or "").lower()
    name = (p.get("name") or "").lower()
    pt = (p.get("product_type") or p.get("productType") or "").lower()
    
    if "gold" in pt or "gold" in cat:
        continue
    if any(k in cat or k in sub or k in name for k in ["pooja", "idol", "murti", "vilakku", "kalash", "thali", "deepam", "aarti"]):
        pooja_silver.append(p)

print(f"Total sacred silver pooja & idol items found: {len(pooja_silver)}")
for p in pooja_silver:
    print(f"[{p.get('id')}] {p.get('name')} | Cat: {p.get('category')} | SubCat: {p.get('subCategory')} | Img: {p.get('image')}")
