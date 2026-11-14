import urllib.request
import json

url = 'http://localhost:8000/api/products?category=Silver%20Pooja&page_size=100'
req = urllib.request.urlopen(url)
data = json.loads(req.read().decode('utf-8'))
print('Items count for category=Silver Pooja:', data.get('total'))
for p in data.get('items', []):
    print(f"[{p.get('id')}] {p.get('name')} | Cat: {p.get('category')} | SubCat: {p.get('sub_category')} | Img: {p.get('image')}")
