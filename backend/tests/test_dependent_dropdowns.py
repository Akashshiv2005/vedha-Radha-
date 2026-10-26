import uuid
import pytest
from app.db.session import SessionLocal
from app.models.product import Product
from app.models.order import Order


@pytest.fixture(scope="module", autouse=True)
def cleanup_dependent_dropdown_test_products():
    """Teardown fixture: cleans up unreferenced test-generated DEP products created during tests."""
    yield
    with SessionLocal() as db:
        ordered_skus = {row[0] for row in db.query(Order.product_sku).all()}
        db.query(Product).filter(
            Product.sku.like("DEP-%"),
            ~Product.sku.in_(ordered_skus)
        ).delete(synchronize_session=False)
        db.commit()


def test_01_create_gold_earrings_studs(client, auth_headers):
    """1. Gold -> Earrings -> Studs combination."""
    test_sku = f"DEP-{uuid.uuid4().hex[:6].upper()}"
    payload = {
        "sku": test_sku,
        "name": "22K Traditional Ruby Studs",
        "productType": "Gold",
        "category": "Earrings",
        "subCategory": "Studs",
        "purity": "22K 916 BIS Hallmarked",
        "price": 32000,
        "status": "available",
    }
    res = client.post("/api/admin/products", json=payload, headers=auth_headers)
    assert res.status_code == 201
    data = res.json()
    assert data["product_type"] == "gold"
    assert data["productType"] == "Gold"
    assert data["category"] == "Earrings"
    assert data["subCategory"] == "Studs"

    # Verify direct in DB
    with SessionLocal() as db:
        prod = db.query(Product).filter(Product.sku == test_sku).first()
        assert prod is not None
        assert prod.product_type == "gold"
        assert prod.category == "Earrings"
        assert prod.sub_category == "Studs"


def test_02_create_gold_earrings_jhumkas(client, auth_headers):
    """2. Gold -> Earrings -> Jhumkas combination."""
    test_sku = f"DEP-{uuid.uuid4().hex[:6].upper()}"
    payload = {
        "sku": test_sku,
        "name": "Chettinad Antique Bell Jhumkas",
        "productType": "Gold",
        "category": "Earrings",
        "subCategory": "Jhumkas",
        "purity": "22K 916 BIS Hallmarked",
        "price": 65000,
        "status": "available",
    }
    res = client.post("/api/admin/products", json=payload, headers=auth_headers)
    assert res.status_code == 201
    data = res.json()
    assert data["product_type"] == "gold"
    assert data["category"] == "Earrings"
    assert data["subCategory"] == "Jhumkas"


def test_03_create_gold_rings(client, auth_headers):
    """3. Gold -> Rings -> Engagement Rings combination."""
    test_sku = f"DEP-{uuid.uuid4().hex[:6].upper()}"
    payload = {
        "sku": test_sku,
        "name": "22K Navratna Engagement Band",
        "productType": "Gold",
        "category": "Rings",
        "subCategory": "Engagement Rings",
        "purity": "22K 916 BIS Hallmarked",
        "price": 42000,
        "status": "available",
    }
    res = client.post("/api/admin/products", json=payload, headers=auth_headers)
    assert res.status_code == 201
    data = res.json()
    assert data["product_type"] == "gold"
    assert data["category"] == "Rings"
    assert data["subCategory"] == "Engagement Rings"


def test_04_create_silver_earrings(client, auth_headers):
    """4. Silver -> Earrings -> Studs combination."""
    test_sku = f"DEP-{uuid.uuid4().hex[:6].upper()}"
    payload = {
        "sku": test_sku,
        "name": "925 Oxidized Floral Studs",
        "productType": "Silver",
        "category": "Earrings",
        "subCategory": "Studs",
        "purity": "925 Sterling Silver",
        "price": 3800,
        "status": "available",
    }
    res = client.post("/api/admin/products", json=payload, headers=auth_headers)
    assert res.status_code == 201
    data = res.json()
    assert data["product_type"] == "silver"
    assert data["category"] == "Earrings"
    assert data["subCategory"] == "Studs"


def test_05_create_silver_rings(client, auth_headers):
    """5. Silver -> Rings -> Casual Rings combination."""
    test_sku = f"DEP-{uuid.uuid4().hex[:6].upper()}"
    payload = {
        "sku": test_sku,
        "name": "925 Sterling Casual Band",
        "productType": "Silver",
        "category": "Rings",
        "subCategory": "Casual Rings",
        "purity": "925 Sterling Silver",
        "price": 2500,
        "status": "available",
    }
    res = client.post("/api/admin/products", json=payload, headers=auth_headers)
    assert res.status_code == 201
    data = res.json()
    assert data["product_type"] == "silver"
    assert data["category"] == "Rings"
    assert data["subCategory"] == "Casual Rings"


def test_06_create_coins_bars_gold_coins(client, auth_headers):
    """6. Coins & Bars -> Gold Coins combination."""
    test_sku = f"DEP-{uuid.uuid4().hex[:6].upper()}"
    payload = {
        "sku": test_sku,
        "name": "24K Ashtalakshmi Gold Coin 10g",
        "productType": "Coins & Bars",
        "category": "Gold Coins",
        "purity": "24K 999 Pure Gold",
        "price": 72500,
        "status": "available",
    }
    res = client.post("/api/admin/products", json=payload, headers=auth_headers)
    assert res.status_code == 201
    data = res.json()
    assert data["product_type"] == "coins_bars"
    assert data["category"] == "Gold Coins"


def test_07_create_coins_bars_silver_bars(client, auth_headers):
    """7. Coins & Bars -> Silver Bars combination."""
    test_sku = f"DEP-{uuid.uuid4().hex[:6].upper()}"
    payload = {
        "sku": test_sku,
        "name": "999 Fine Pure Silver Bar 500g",
        "productType": "Coins & Bars",
        "category": "Silver Bars",
        "purity": "999 Fine Silver",
        "price": 48000,
        "status": "available",
    }
    res = client.post("/api/admin/products", json=payload, headers=auth_headers)
    assert res.status_code == 201
    data = res.json()
    assert data["product_type"] == "coins_bars"
    assert data["category"] == "Silver Bars"


def test_08_reject_invalid_category_for_product_type(client, auth_headers):
    """8. Reject category that does not belong to the selected product type."""
    test_sku = f"DEP-{uuid.uuid4().hex[:6].upper()}"
    # Coins & Bars does not allow Earrings
    payload = {
        "sku": test_sku,
        "name": "Invalid Coins Earring",
        "productType": "Coins & Bars",
        "category": "Earrings",
        "price": 10000,
        "status": "available",
    }
    res = client.post("/api/admin/products", json=payload, headers=auth_headers)
    assert res.status_code == 422
    assert "not valid for Product Type" in res.text


def test_09_reject_incompatible_subcategory_for_category(client, auth_headers):
    """9. Reject subcategory that does not belong to the category."""
    test_sku = f"DEP-{uuid.uuid4().hex[:6].upper()}"
    # Rings category cannot have Jhumkas subcategory
    payload = {
        "sku": test_sku,
        "name": "Invalid Ring Jhumka",
        "productType": "Gold",
        "category": "Rings",
        "subCategory": "Jhumkas",
        "price": 20000,
        "status": "available",
    }
    res = client.post("/api/admin/products", json=payload, headers=auth_headers)
    assert res.status_code == 422
    assert "incompatible with category" in res.text


def test_10_update_and_restore_category_selections(client, auth_headers):
    """10. Create product, update category selections, and confirm restored state."""
    test_sku = f"DEP-{uuid.uuid4().hex[:6].upper()}"
    # Step A: Register as Gold -> Earrings -> Studs
    payload = {
        "sku": test_sku,
        "name": "Versatile Studs",
        "productType": "Gold",
        "category": "Earrings",
        "subCategory": "Studs",
        "price": 25000,
        "status": "available",
    }
    res = client.post("/api/admin/products", json=payload, headers=auth_headers)
    assert res.status_code == 201

    # Step B: Update to Gold -> Rings -> Casual Rings
    update_payload = {
        "productType": "Gold",
        "category": "Rings",
        "subCategory": "Casual Rings",
    }
    put_res = client.put(f"/api/admin/products/{test_sku}", json=update_payload, headers=auth_headers)
    assert put_res.status_code == 200
    updated = put_res.json()
    assert updated["category"] == "Rings"
    assert updated["subCategory"] == "Casual Rings"

    # Step C: Retrieve by SKU
    get_res = client.get(f"/api/admin/products/{test_sku}", headers=auth_headers)
    assert get_res.status_code == 200
    fetched = get_res.json()
    assert fetched["product_type"] == "gold"
    assert fetched["category"] == "Rings"
    assert fetched["subCategory"] == "Casual Rings"


def test_11_filter_by_product_type(client, auth_headers):
    """11. Querying with product_type filter returns only matching items."""
    res_gold = client.get("/api/admin/products?product_type=gold", headers=auth_headers)
    assert res_gold.status_code == 200
    for item in res_gold.json()["items"]:
        assert item["product_type"] == "gold"

    res_silver = client.get("/api/admin/products?product_type=silver", headers=auth_headers)
    assert res_silver.status_code == 200
    for item in res_silver.json()["items"]:
        assert item["product_type"] == "silver"
