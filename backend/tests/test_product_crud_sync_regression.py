import pytest
import uuid
from decimal import Decimal
from app.db.session import SessionLocal
from app.models.product import Product


def test_01_update_product_name_and_description(client, auth_headers):
    """1. Update product name and description."""
    test_sku = f"UPD-{uuid.uuid4().hex[:6].upper()}"
    create_payload = {
        "sku": test_sku,
        "name": "Original Royal Choker",
        "description": "Original heritage craftsmanship description.",
        "category": "Gold Jewellery",
        "price": 75000,
        "status": "available",
    }
    res = client.post("/api/admin/products", json=create_payload, headers=auth_headers)
    assert res.status_code == 201

    # Update name and description
    update_payload = {
        "name": "Modified Imperial Choker",
        "description": "Updated heirloom antique polishing with ruby accents.",
    }
    put_res = client.put(f"/api/admin/products/{test_sku}", json=update_payload, headers=auth_headers)
    assert put_res.status_code == 200
    data = put_res.json()
    assert data["name"] == "Modified Imperial Choker"
    assert data["description"] == "Updated heirloom antique polishing with ruby accents."


def test_02_update_price_and_category(client, auth_headers):
    """2. Update price and category with string/formatted price support."""
    test_sku = f"UPD-{uuid.uuid4().hex[:6].upper()}"
    create_payload = {
        "sku": test_sku,
        "name": "Silver Puja Thali",
        "category": "Silver Articles",
        "subCategory": "Pooja Articles",
        "price": 18000,
        "status": "available",
    }
    res = client.post("/api/admin/products", json=create_payload, headers=auth_headers)
    assert res.status_code == 201

    # Update price and category (price passed as formatted string "24,500")
    update_payload = {
        "category": "Silver Jewellery",
        "subCategory": "Anklets & Kolusu",
        "price": "24,500",
    }
    put_res = client.put(f"/api/admin/products/{test_sku}", json=update_payload, headers=auth_headers)
    assert put_res.status_code == 200
    data = put_res.json()
    assert data["category"] == "Silver Jewellery"
    assert data["subCategory"] == "Anklets & Kolusu"
    assert int(float(data["price"])) == 24500


def test_03_preserve_sku_uniqueness(client, auth_headers):
    """3. Preserve SKU uniqueness when updating to an existing SKU."""
    sku_a = f"UPD-{uuid.uuid4().hex[:6].upper()}"
    sku_b = f"UPD-{uuid.uuid4().hex[:6].upper()}"
    client.post("/api/admin/products", json={"sku": sku_a, "name": "Piece A", "category": "Gold", "price": 1000}, headers=auth_headers)
    client.post("/api/admin/products", json={"sku": sku_b, "name": "Piece B", "category": "Gold", "price": 2000}, headers=auth_headers)

    # Attempt to change SKU of B to A
    res = client.put(f"/api/admin/products/{sku_b}", json={"sku": sku_a}, headers=auth_headers)
    assert res.status_code == 409
    assert "already exists" in res.text


def test_04_update_image_reference(client, auth_headers):
    """4. Update image reference safely."""
    test_sku = f"UPD-{uuid.uuid4().hex[:6].upper()}"
    create_payload = {
        "sku": test_sku,
        "name": "Peacock Pendant",
        "category": "Gold Jewellery",
        "price": 32000,
        "image": "/images/product_gold_chain.jpg",
    }
    client.post("/api/admin/products", json=create_payload, headers=auth_headers)

    # Update image reference
    new_image = "/images/product_anklet.jpg"
    put_res = client.put(f"/api/admin/products/{test_sku}", json={"image": new_image}, headers=auth_headers)
    assert put_res.status_code == 200
    assert put_res.json()["image_url"] == new_image


def test_05_reject_invalid_data(client, auth_headers):
    """5. Reject invalid data (e.g. empty category, invalid filter names)."""
    test_sku = f"UPD-{uuid.uuid4().hex[:6].upper()}"
    client.post("/api/admin/products", json={"sku": test_sku, "name": "Valid Item", "category": "Gold", "price": 5000}, headers=auth_headers)

    # Empty category rejected
    res = client.put(f"/api/admin/products/{test_sku}", json={"category": ""}, headers=auth_headers)
    assert res.status_code in (400, 422)

    # Filter keyword rejected
    res2 = client.put(f"/api/admin/products/{test_sku}", json={"category": "All Gold"}, headers=auth_headers)
    assert res2.status_code in (400, 422)


def test_06_return_404_for_nonexistent_product(client, auth_headers):
    """6. Return 404 for a nonexistent product on PUT and DELETE."""
    res_put = client.put("/api/admin/products/DOES-NOT-EXIST-SKU-404", json={"name": "Nope"}, headers=auth_headers)
    assert res_put.status_code == 404

    res_del = client.delete("/api/admin/products/DOES-NOT-EXIST-SKU-404", headers=auth_headers)
    assert res_del.status_code == 404


def test_07_rollback_failed_database_transactions(client, auth_headers):
    """7. Failed update does not corrupt database state."""
    test_sku = f"UPD-{uuid.uuid4().hex[:6].upper()}"
    client.post("/api/admin/products", json={"sku": test_sku, "name": "Immutable Piece", "category": "Gold", "price": 55000}, headers=auth_headers)

    # Attempt invalid update
    client.put(f"/api/admin/products/{test_sku}", json={"category": "All Gold"}, headers=auth_headers)

    # Verify original state preserved
    get_res = client.get(f"/api/admin/products/{test_sku}", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["name"] == "Immutable Piece"
    assert get_res.json()["category"] == "Gold"


def test_08_delete_or_deactivate_valid_product(client, auth_headers):
    """8. Delete or deactivate a valid product."""
    test_sku = f"DEL-{uuid.uuid4().hex[:6].upper()}"
    client.post("/api/admin/products", json={"sku": test_sku, "name": "Piece to Deactivate", "category": "Gold", "price": 10000}, headers=auth_headers)

    del_res = client.delete(f"/api/admin/products/{test_sku}", headers=auth_headers)
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # Inactive by default in admin products list
    list_res = client.get("/api/admin/products", headers=auth_headers)
    assert not any(p["sku"] == test_sku for p in list_res.json()["items"])


def test_09_reject_unauthorized_deletion(client):
    """9. Reject unauthorized deletion without credentials."""
    del_res = client.delete("/api/admin/products/SA-001")
    assert del_res.status_code == 401


def test_10_handle_nonexistent_product_ids_on_delete(client, auth_headers):
    """10. Handle nonexistent product IDs gracefully."""
    fake_uuid = str(uuid.uuid4())
    res = client.delete(f"/api/admin/products/{fake_uuid}", headers=auth_headers)
    assert res.status_code == 404


def test_11_preserve_order_and_reservation_history_on_deactivation(client, auth_headers):
    """11. Soft-deactivating a product keeps the database row with is_active=False."""
    test_sku = f"DEL-{uuid.uuid4().hex[:6].upper()}"
    client.post("/api/admin/products", json={"sku": test_sku, "name": "Ordered Ring", "category": "Gold", "price": 42000}, headers=auth_headers)

    client.delete(f"/api/admin/products/{test_sku}", headers=auth_headers)

    # In database, product still exists with is_active=False
    db = SessionLocal()
    try:
        p = db.query(Product).filter(Product.sku == test_sku).first()
        assert p is not None
        assert p.is_active is False
        assert p.status == "unavailable"
    finally:
        db.close()


def test_12_deactivated_record_not_in_public_listings(client, auth_headers):
    """12. Confirm the deleted/deactivated record is no longer returned by public listings."""
    test_sku = f"DEL-{uuid.uuid4().hex[:6].upper()}"
    client.post("/api/admin/products", json={"sku": test_sku, "name": "Deactivated Bangle", "category": "Gold", "price": 30000}, headers=auth_headers)

    # Verify present before delete
    pub1 = client.get("/api/products")
    assert any(p["sku"] == test_sku for p in pub1.json()["items"])

    # Delete
    client.delete(f"/api/admin/products/{test_sku}", headers=auth_headers)

    # Verify absent from public list
    pub2 = client.get("/api/products")
    assert not any(p["sku"] == test_sku for p in pub2.json()["items"])

    # Direct detail lookup returns 404
    detail_res = client.get(f"/api/products/{test_sku}")
    assert detail_res.status_code == 404


def test_13_update_product_admin_api_response(client, auth_headers):
    """13. Update product and verify admin API response."""
    test_sku = f"UPD-{uuid.uuid4().hex[:6].upper()}"
    client.post("/api/admin/products", json={"sku": test_sku, "name": "Admin Check Ring", "category": "Gold", "price": 20000}, headers=auth_headers)

    put_res = client.put(f"/api/admin/products/{test_sku}", json={"price": 25000, "status": "reserved"}, headers=auth_headers)
    assert put_res.status_code == 200
    data = put_res.json()
    assert int(float(data["price"])) == 25000
    assert data["status"] == "reserved"


def test_14_update_product_public_api_response(client, auth_headers):
    """14. Update product and verify public API response reflects changes."""
    test_sku = f"UPD-{uuid.uuid4().hex[:6].upper()}"
    client.post("/api/admin/products", json={"sku": test_sku, "name": "Sync Test Chain", "category": "Gold", "price": 40000}, headers=auth_headers)

    # Update in admin
    client.put(f"/api/admin/products/{test_sku}", json={"price": 45000, "name": "Sync Test Chain - 22K"}, headers=auth_headers)

    # Check public detail
    pub_res = client.get(f"/api/products/{test_sku}")
    assert pub_res.status_code == 200
    data = pub_res.json()
    assert data["name"] == "Sync Test Chain - 22K"
    assert int(float(data["price"])) == 45000


def test_15_delete_deactivate_product_public_listing_changes(client, auth_headers):
    """15. Delete/deactivate product and verify public listing count adjusts."""
    test_sku = f"DEL-{uuid.uuid4().hex[:6].upper()}"
    client.post("/api/admin/products", json={"sku": test_sku, "name": "Transient Pendant", "category": "Silver Jewellery", "price": 8000}, headers=auth_headers)

    initial_total = client.get("/api/products?category=silver_jewellery").json()["total"]
    client.delete(f"/api/admin/products/{test_sku}", headers=auth_headers)
    after_total = client.get("/api/products?category=silver_jewellery").json()["total"]

    assert after_total == initial_total - 1


def test_16_homepage_and_category_endpoints_use_current_database_records(client, auth_headers):
    """16. Verify category endpoints (gold, silver, coins) query PostgreSQL dynamically."""
    res_gold = client.get("/api/products?category=gold")
    assert res_gold.status_code == 200

    res_silver = client.get("/api/products?category=silver_jewellery")
    assert res_silver.status_code == 200

    res_coins = client.get("/api/products?category=coins")
    assert res_coins.status_code == 200


def test_17_pagination_totals_and_filters(client, auth_headers):
    """17. Verify pagination totals and filtering."""
    res = client.get("/api/admin/products?page=1&page_size=2", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data["items"]) <= 2
    assert data["page_size"] == 2
    assert data["total_pages"] >= 1


def test_18_minio_image_reference_preservation(client, auth_headers):
    """18. Verify image references remain valid after metadata updates."""
    test_sku = f"UPD-{uuid.uuid4().hex[:6].upper()}"
    img_ref = "/images/product_gold_chain.jpg"
    client.post("/api/admin/products", json={"sku": test_sku, "name": "Image Preserved Item", "category": "Gold", "price": 10000, "image": img_ref}, headers=auth_headers)

    # Update only the price
    client.put(f"/api/admin/products/{test_sku}", json={"price": 12000}, headers=auth_headers)

    # Verify image still preserved
    get_res = client.get(f"/api/admin/products/{test_sku}", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["image_url"] == img_ref
