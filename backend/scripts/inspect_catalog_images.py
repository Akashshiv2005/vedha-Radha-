import urllib.request
import json
import os

print("--- 1. Testing Backend API ---")
try:
    req = urllib.request.urlopen("http://localhost:8000/api/v1/products/?limit=100")
    prods = json.loads(req.read().decode("utf-8"))
    print(f"Total backend products returned: {len(prods)}")
    
    target_keywords = [
        "waterfall", "emerald-cut", "radiant", "bangle", "kada",
        "teardrop", "tennis", "solitaire studs", "heart pendant", "pooja"
    ]
    for p in prods:
        name_lower = p.get("name", "").lower()
        if any(k in name_lower for k in target_keywords):
            print(f"[{p.get('id')}] {p.get('name')} -> {p.get('image')}")
except Exception as e:
    print(f"Backend API error: {e}")

print("\n--- 2. Checking Static products.json ---")
json_path = os.path.join(os.path.dirname(__file__), "../../frontend/src/data/products.json")
if os.path.exists(json_path):
    with open(json_path, "r", encoding="utf-8") as f:
        static_prods = json.load(f)
    print(f"Total static products in products.json: {len(static_prods)}")
    for p in static_prods:
        name_lower = p.get("name", "").lower()
        if any(k in name_lower for k in ["waterfall", "emerald-cut", "radiant", "kada", "teardrop", "heart pendant", "solitaire studs"]):
            print(f"[JSON] [{p.get('id')}] {p.get('name')} -> {p.get('image')} | images: {p.get('images')}")
