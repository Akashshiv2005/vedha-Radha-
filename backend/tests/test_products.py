import pytest
import uuid


def test_unauthorized_product_access(client):
    """Endpoints require valid bearer authorization."""
    res = client.get("/api/admin/products")
    assert res.status_code == 401

    res_post = client.post("/api/admin/products", json={"sku": "FAIL-01", "name": "Fail", "category": "Gold", "price": 100})
    assert res_post.status_code == 401


def test_list_products_success(client, auth_headers):
    """Authorized admin can list products with pagination metadata."""
    res = client.get("/api/admin/products?page=1&page_size=10", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert data["page"] == 1
    assert data["total"] >= 1
    # Check frontend contract fields on items
    first = data["items"][0]
    assert "sku" in first
    assert "name" in first
    assert "price" in first
    assert "status" in first
    assert "isUnique" in first
    assert "availability" in first


def test_search_products_by_sku_and_name(client, auth_headers):
    """Search matches SKU and name."""
    # Search for known seed item
    res = client.get("/api/admin/products?search=SA-001", headers=auth_headers)
    assert res.status_code == 200
    items = res.json()["items"]
    assert any(p["sku"] == "SA-001" for p in items)

    # Search for Anklet
    res2 = client.get("/api/admin/products?search=Anklet", headers=auth_headers)
    assert res2.status_code == 200
    assert len(res2.json()["items"]) >= 1


def test_filter_by_category_and_status(client, auth_headers):
    """Filters products by category and status."""
    res = client.get("/api/admin/products?category=gold", headers=auth_headers)
    assert res.status_code == 200
    gold_cats = ("gold", "earrings", "rings", "bangle & bracelets", "necklace", "necklaces", "nosepin", "occasion", "chains", "pendant", "pendants", "anklets", "toe rings")
    for item in res.json()["items"]:
        assert any(c in item["category"].lower() for c in gold_cats)

    res_status = client.get("/api/admin/products?status=available", headers=auth_headers)
    assert res_status.status_code == 200
    for item in res_status.json()["items"]:
        assert item["status"] == "available"


def test_create_and_get_product(client, auth_headers):
    """Admin can create a new product and retrieve it."""
    test_sku = f"TEST-{uuid.uuid4().hex[:6].upper()}"
    payload = {
        "sku": test_sku,
        "name": "22K Royal Peacock Bangle",
        "subtitle": "Limited Edition Nakshi",
        "category": "Gold Jewellery",
        "subCategory": "Bangles",
        "itemType": "unique",
        "price": 85000,
        "status": "available",
        "stockQty": 1,
        "grossWeight": "32.50 g",
        "location": "Safe 1",
    }
    res = client.post("/api/admin/products", json=payload, headers=auth_headers)
    assert res.status_code == 201
    created = res.json()
    assert created["sku"] == test_sku
    assert created["name"] == payload["name"]
    assert created["isUnique"] is True
    assert created["stockQty"] == 1
    assert created["status"] == "available"

    # Get by SKU
    get_res = client.get(f"/api/admin/products/{test_sku}", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["sku"] == test_sku


def test_duplicate_sku_rejection(client, auth_headers):
    """Creating a product with an existing SKU returns HTTP 409 Conflict."""
    payload = {
        "sku": "SA-001",  # Existing seed SKU
        "name": "Duplicate Anklet Attempt",
        "category": "Silver Jewellery",
        "price": 15000,
    }
    res = client.post("/api/admin/products", json=payload, headers=auth_headers)
    assert res.status_code == 409
    data = res.json()
    assert "already exists" in (data.get("error") or data.get("detail", {}).get("error", ""))


def test_update_product(client, auth_headers):
    """Admin can update an existing product's fields."""
    test_sku = f"UPD-{uuid.uuid4().hex[:6].upper()}"
    create_payload = {
        "sku": test_sku,
        "name": "Silver Pooja Lamp",
        "category": "Silver Articles",
        "price": 12000,
        "status": "available",
    }
    client.post("/api/admin/products", json=create_payload, headers=auth_headers)

    # Update price and status
    update_payload = {
        "price": 14500,
        "status": "reserved",
        "name": "Silver Pooja Lamp (Engraved)",
    }
    put_res = client.put(f"/api/admin/products/{test_sku}", json=update_payload, headers=auth_headers)
    assert put_res.status_code == 200
    updated = put_res.json()
    assert int(float(updated["price"])) == 14500
    assert updated["status"] == "reserved"
    assert updated["name"] == "Silver Pooja Lamp (Engraved)"


def test_product_not_found(client, auth_headers):
    """Non-existent product returns HTTP 404."""
    res = client.get("/api/admin/products/NON_EXISTENT_SKU_9999", headers=auth_headers)
    assert res.status_code == 404


def test_soft_delete_product(client, auth_headers):
    """Deleting a product deactivates it without hard-deleting historical records."""
    test_sku = f"DEL-{uuid.uuid4().hex[:6].upper()}"
    client.post(
        "/api/admin/products",
        json={"sku": test_sku, "name": "Temporary Item", "category": "Gold", "price": 5000},
        headers=auth_headers,
    )

    del_res = client.delete(f"/api/admin/products/{test_sku}", headers=auth_headers)
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # Subsequent GET returns 404 (soft-deleted)
    get_res = client.get(f"/api/admin/products/{test_sku}", headers=auth_headers)
    assert get_res.status_code == 404


def test_create_storefront_earrings_with_subcategories(client, auth_headers):
    """Admin can register product with storefront category Earrings and valid subcategory Studs/Jhumkas."""
    earring_sku = f"ER-{uuid.uuid4().hex[:6].upper()}"
    payload = {
        "sku": earring_sku,
        "name": "22K Traditional Kemp Studs",
        "category": "Earrings",
        "subCategory": "Studs",
        "purity": "22K 916 BIS Hallmarked",
        "price": 28500,
        "status": "available",
    }
    res = client.post("/api/admin/products", json=payload, headers=auth_headers)
    assert res.status_code == 201
    data = res.json()
    assert data["category"] == "Earrings"
    assert data["subCategory"] == "Studs"

    # Query public products with category=gold should include this earring
    pub_res = client.get("/api/products?category=gold")
    try:
        assert any(p["sku"] == earring_sku for p in pub_res.json()["items"])
    finally:
        client.delete(f"/api/admin/products/{earring_sku}", headers=auth_headers)


def test_reject_storefront_filters_as_categories_or_subcategories(client, auth_headers):
    """'All Gold' and 'View All' are storefront filters and must not be saved as product categories."""
    sku1 = f"FAIL1-{uuid.uuid4().hex[:6].upper()}"
    res1 = client.post(
        "/api/admin/products",
        json={"sku": sku1, "name": "Invalid Category", "category": "All Gold", "price": 1000},
        headers=auth_headers,
    )
    assert res1.status_code in (400, 422)

    sku2 = f"FAIL2-{uuid.uuid4().hex[:6].upper()}"
    res2 = client.post(
        "/api/admin/products",
        json={"sku": sku2, "name": "Invalid SubCategory", "category": "Earrings", "subCategory": "View All", "price": 1000},
        headers=auth_headers,
    )
    assert res2.status_code in (400, 422)


def test_reject_incompatible_subcategory(client, auth_headers):
    """Incompatible category/subcategory combinations are rejected."""
    bad_sku = f"INC-{uuid.uuid4().hex[:6].upper()}"
    res = client.post(
        "/api/admin/products",
        json={"sku": bad_sku, "name": "Mismatched Item", "category": "Earrings", "subCategory": "Casual Rings", "price": 5000},
        headers=auth_headers,
    )
    assert res.status_code in (400, 422)

