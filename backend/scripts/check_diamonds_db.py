import urllib.request
import json

res = urllib.request.urlopen('http://localhost:8000/api/products?product_type=diamond&page_size=100')
data = json.loads(res.read().decode('utf-8'))
print('Total diamond products from backend:', data.get('total'))
for p in data.get('items', []):
    print(f"[{p.get('id')}] {p.get('name')} -> {p.get('image')} | images: {p.get('images')}")
