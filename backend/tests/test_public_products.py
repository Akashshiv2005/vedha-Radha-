def test_public_get_products_no_auth_required(client):
    """Storefront visitors can view catalogue without authentication."""
    res = client.get("/api/products")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert "total" in data
    assert isinstance(data["items"], list)


def test_public_get_products_category_filter(client):
    """Storefront category filter returns matching products."""
    res = client.get("/api/products?category=gold")
    assert res.status_code == 200
    items = res.json()["items"]
    gold_cats = ("gold", "earrings", "rings", "bangle & bracelets", "necklace", "necklaces", "nosepin", "occasion", "chains", "pendant", "pendants", "anklets", "toe rings", "temple", "mangalsutra", "jewellery", "coin", "bar")
    for item in items:
        assert item.get("product_type") in ("gold", "coins_bars") or any(c in item["category"].lower() for c in gold_cats)


def test_public_get_products_price_filter(client):
    """Storefront price filter respects min and max price."""
    res = client.get("/api/products?min_price=10000&max_price=50000")
    assert res.status_code == 200
    items = res.json()["items"]
    for item in items:
        assert 10000 <= item["numericPrice"] <= 50000


def test_public_get_single_product_by_sku(client):
    """Storefront can retrieve single product by SKU."""
    res = client.get("/api/products/GC-1045")
    assert res.status_code == 200
    item = res.json()
    assert item["sku"] == "GC-1045"
    assert "numericPrice" in item
    assert "image" in item
    assert "badge" in item
    assert "details" in item


def test_public_get_product_not_found(client):
    """Non-existent or inactive product returns 404."""
    res = client.get("/api/products/DOES-NOT-EXIST-SKU-999")
    assert res.status_code == 404
