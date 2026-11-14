import sys
from collections import defaultdict
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("=" * 70)
print("TESTING STOREFRONT FASTAPI DYNAMIC ENDPOINTS")
print("=" * 70)

# 1. All products
res = client.get("/api/products?page_size=200")
assert res.status_code == 200, res.text
data = res.json()
all_items = data["items"]
total = data["total"]
print(f"1. Total public items in DB: {total} (page returned: {len(all_items)})")
assert total == 201, f"Expected total == 201, got {total}"

# Verify 0 duplicate images across all returned API items on page 1
# Also check page 2 to get the 201st item
res_page2 = client.get("/api/products?page=2&page_size=200")
assert res_page2.status_code == 200
full_201_items = all_items + res_page2.json()["items"]
assert len(full_201_items) == 201, f"Expected 201 items across pages, got {len(full_201_items)}"

img_map = defaultdict(list)
sku_set = set()
name_set = set()
for item in full_201_items:
    sku = item["sku"]
    name = item["name"]
    img = item.get("image") or item.get("image_url")
    assert sku not in sku_set, f"Duplicate SKU returned by API: {sku}"
    sku_set.add(sku)
    img_map[img].append(sku)

dup_imgs = {k: v for k, v in img_map.items() if len(v) > 1}
print(f"   API Duplicate Images across 201 items: {len(dup_imgs)}")
assert len(dup_imgs) == 0, f"Found duplicate images in API response: {dup_imgs}"

# 2. Diamonds
res = client.get("/api/products?product_type=diamond&page_size=100")
assert res.status_code == 200, res.text
dia_items = res.json()["items"]
print(f"2. Dynamic Diamond items from DB: {len(dia_items)}")
assert len(dia_items) == 29, f"Expected 29 diamonds, got {len(dia_items)}"
sample_dia = dia_items[0]
print(f"   Sample diamond: {sample_dia['name']}")
print(f"   SKU: {sample_dia['sku']} | Price: {sample_dia['price']} | Badge: {sample_dia['badge']} | Type: {sample_dia['productType']}")

# 3. Gold
res = client.get("/api/products?product_type=gold&page_size=150")
assert res.status_code == 200, res.text
gold_items = res.json()["items"]
print(f"3. Dynamic Gold items from DB: {len(gold_items)}")
assert len(gold_items) == 93, f"Expected 93 gold items, got {len(gold_items)}"
# Strict Gold verification: Zero silver items, images, or purity in Gold section
for g in gold_items:
    name_l = g["name"].lower()
    img_l = (g.get("image") or g.get("image_url") or "").lower()
    purity_l = (g.get("purity") or "").lower()
    assert "silver" not in name_l, f"Silver name in gold product: {g['sku']} ({g['name']})"
    assert "silver" not in img_l, f"Silver image in gold product: {g['sku']} ({img_l})"
    assert "silver" not in purity_l and "925" not in purity_l, f"Silver purity in gold product: {g['sku']} ({purity_l})"
print("   Strict Gold Isolation: ZERO silver names, images, or purity found across all 93 gold items!")

# 4. Silver
res = client.get("/api/products?product_type=silver&page_size=150")
assert res.status_code == 200, res.text
silver_items = res.json()["items"]
print(f"4. Dynamic Silver items from DB: {len(silver_items)}")
assert len(silver_items) == 74, f"Expected 74 silver items, got {len(silver_items)}"

# 5. Coins & Bars
res = client.get("/api/products?product_type=coins_bars&page_size=50")
assert res.status_code == 200, res.text
cb_items = res.json()["items"]
print(f"5. Dynamic Coins & Bars items from DB: {len(cb_items)}")
assert len(cb_items) == 5, f"Expected 5 coins & bars items, got {len(cb_items)}"

# 6. Temple Heritage
res = client.get("/api/products?category=Temple%20Heritage&page_size=100")
assert res.status_code == 200, res.text
temple_items = res.json()["items"]
print(f"6. Dynamic Temple items from DB: {len(temple_items)}")
assert len(temple_items) == 19, f"Expected 19 temple items, got {len(temple_items)}"

# 7. Silver Pooja
res = client.get("/api/products?category=Silver%20Pooja&page_size=100")
assert res.status_code == 200, res.text
pooja_items = res.json()["items"]
print(f"7. Dynamic Pooja items from DB: {len(pooja_items)}")
assert len(pooja_items) == 11, f"Expected 11 pooja items, got {len(pooja_items)}"

# 8. Single item fetches
for sku in ["dia-solitaire-01", "temple-p-1", "pooja-1", "prod-arr-1", "baby-nazariya-set", "VR-COLL-WED-04"]:
    res = client.get(f"/api/products/{sku}")
    assert res.status_code == 200, f"Failed fetching {sku}: {res.text}"
    print(f"   Single fetch [{sku}]: {res.json()['name']} -> Status 200 OK")

print("=" * 70)
print("ALL DYNAMIC FASTAPI BACKEND CHECKS PASSED WITH 100% SUCCESS!")
print("=" * 70)
