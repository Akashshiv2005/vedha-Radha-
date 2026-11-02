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
    gold_cats = ("gold", "earrings", "rings", "bangle & bracelets", "necklace", "necklaces", "nosepin", "occasion", "chains", "pendant", "pendants", "anklets", "toe rings", "temple", "mangalsutra", "jewellery", "coin", "bar")
    for item in res.json()["items"]:
        assert item.get("product_type") in ("gold", "coins_bars") or any(c in item["category"].lower() for c in gold_cats)

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



def test_qr_code_lifecycle_and_lookup(client, auth_headers):
    """QR Code registration, retrieval by QR, duplicate rejection, and update."""
    unique_id = uuid.uuid4().hex[:6].upper()
    sku = f"QR-TEST-{unique_id}"
    qr_code = f"TAG-QR-{unique_id}"

    # 1. Create product with QR code and jewellery specs
    create_payload = {
        "sku": sku,
        "qrCode": qr_code,
        "name": "QR Scanned Silver Anklet",
        "productType": "Silver",
        "category": "Silver Jewellery",
        "subCategory": "Anklets & Kolusu",
        "purity": "925 Sterling Silver",
        "grossWeight": "15.350 g",
        "netWeight": "15.350 g",
        "hallmarkDetails": "VRTM 925 BIS Hallmarked",
        "price": 6140,
        "status": "available",
        "location": "Counter 3",
    }
    res = client.post("/api/admin/products", json=create_payload, headers=auth_headers)
    assert res.status_code == 201, res.text
    data = res.json()
    assert data["sku"] == sku
    assert data["qrCode"] == qr_code
    assert data["grossWeight"] == "15.350 g"
    assert data["hallmarkDetails"] == "VRTM 925 BIS Hallmarked"

    try:
        # 2. Look up product by QR code directly via endpoint
        get_res = client.get(f"/api/admin/products/{qr_code}", headers=auth_headers)
        assert get_res.status_code == 200, get_res.text
        lookup_data = get_res.json()
        assert lookup_data["sku"] == sku
        assert lookup_data["qrCode"] == qr_code

        # 3. Duplicate QR code rejection (Case B safeguard)
        dup_sku = f"DUP-QR-{uuid.uuid4().hex[:6].upper()}"
        dup_payload = {
            "sku": dup_sku,
            "qrCode": qr_code,
            "name": "Duplicate QR Product",
            "category": "Silver Jewellery",
            "price": 5000,
        }
        dup_res = client.post("/api/admin/products", json=dup_payload, headers=auth_headers)
        assert dup_res.status_code == 409, dup_res.text

        # 4. Search by QR code
        search_res = client.get(f"/api/admin/products?search={qr_code}", headers=auth_headers)
        assert search_res.status_code == 200
        assert any(p["sku"] == sku for p in search_res.json()["items"])

        # 5. Update product specifications
        update_payload = {
            "grossWeight": "16.000 g",
            "hallmarkDetails": "VRTM 925 BIS Certified",
        }
        update_res = client.put(f"/api/admin/products/{sku}", json=update_payload, headers=auth_headers)
        assert update_res.status_code == 200
        updated = update_res.json()
        assert updated["grossWeight"] == "16.000 g"
        assert updated["hallmarkDetails"] == "VRTM 925 BIS Certified"
    finally:
        # Cleanup
        client.delete(f"/api/admin/products/{sku}", headers=auth_headers)
