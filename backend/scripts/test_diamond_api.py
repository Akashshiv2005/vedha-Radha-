import urllib.request
import json

try:
    url = 'http://localhost:8000/api/products?product_type=diamond&page_size=100'
    res = urllib.request.urlopen(url)
    data = json.loads(res.read().decode('utf-8'))
    print(f"API response for product_type=diamond: total={data.get('total')}, items count={len(data.get('items', []))}")
    for item in data.get('items', [])[:5]:
        print(f"  - [{item.get('sku')}] {item.get('name')} (Type: {item.get('productType')}, Price: {item.get('price')})")
except Exception as e:
    print('Error contacting API:', e)
