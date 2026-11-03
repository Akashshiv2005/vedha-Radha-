import uuid
from decimal import Decimal
import pytest
from datetime import datetime, timezone
from backend.app.models.cart import ShoppingCart, ShoppingCartItem
from backend.app.models.product import Product
from backend.app.db.session import SessionLocal


@pytest.fixture(autouse=True)
def cleanup_test_carts():
    """Ensure test carts and test products are cleaned up after each test."""
    yield
    db = SessionLocal()
    try:
        # Delete shopping cart items and carts created during test
        db.query(ShoppingCartItem).delete(synchronize_session=False)
        db.query(ShoppingCart).delete(synchronize_session=False)
        # Delete any test-specific products
        db.query(Product).filter(Product.sku.startswith("CART-TEST-")).delete(synchronize_session=False)
        db.commit()
    finally:
        db.close()


def create_test_product(
    db,
    sku: str = "CART-TEST-01",
    name: str = "Test Temple Necklace",
    item_type: str = "unique",
    price: Decimal = Decimal("45000.00"),
    stock_quantity: int = 1,
    status: str = "available",
    is_active: bool = True,
) -> Product:
    prod = Product(
        sku=sku,
        name=name,
        category="Gold Jewellery",
        product_type="gold",
        item_type=item_type,
        price=price,
        stock_quantity=stock_quantity,
        status=status,
        is_active=is_active,
        image_url="/images/products/gold/necklace.jpg",
    )
    db.add(prod)
    db.commit()
    db.refresh(prod)
    return prod


def test_create_guest_cart_and_get_empty(client):
    """1. Get cart without token initializes a fresh guest cart."""
    resp = client.get("/api/cart")
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert "cart_token" in data
    assert len(data["cart_token"]) > 20
    assert data["items"] == []
    assert data["item_count"] == 0
    assert Decimal(str(data["cart_total"])) == Decimal("0.00")
    # Verify header
    assert resp.headers.get("X-Cart-Token") == data["cart_token"]


def test_add_available_product(client):
    """2. Add an available product to cart."""
    db = SessionLocal()
    try:
        prod = create_test_product(db, sku="CART-TEST-P1", price=Decimal("15000.00"))
        prod_id = str(prod.id)
    finally:
        db.close()

    resp = client.post("/api/cart/items", json={"product_id": prod_id, "quantity": 1})
    assert resp.status_code == 201
    data = resp.json()
    assert data["success"] is True
    assert data["item_count"] == 1
    assert len(data["items"]) == 1
    item = data["items"][0]
    assert item["product_id"] == prod_id
    assert item["name"] == "Test Temple Necklace"
    assert Decimal(str(item["current_price"])) == Decimal("15000.00")
    assert Decimal(str(item["unit_price_snapshot"])) == Decimal("15000.00")
    assert Decimal(str(data["cart_total"])) == Decimal("15000.00")
    assert item["is_unique"] is True


def test_retrieve_cart_items_with_token(client):
    """3 & 14. Retrieve cart items using cart token across requests (simulating browser reload)."""
    db = SessionLocal()
    try:
        prod = create_test_product(db, sku="CART-TEST-RELOAD", price=Decimal("22000.00"))
        prod_id = str(prod.id)
    finally:
        db.close()

    # Step 1: Add product and capture token
    add_resp = client.post("/api/cart/items", json={"product_id": prod_id, "quantity": 1})
    assert add_resp.status_code == 201
    cart_token = add_resp.json()["cart_token"]

    # Step 2: Retrieve cart with token
    get_resp = client.get("/api/cart", headers={"X-Cart-Token": cart_token})
    assert get_resp.status_code == 200
    data = get_resp.json()
    assert data["cart_token"] == cart_token
    assert len(data["items"]) == 1
    assert data["items"][0]["sku"] == "CART-TEST-RELOAD"
    assert Decimal(str(data["cart_total"])) == Decimal("22000.00")


def test_add_multiple_different_products(client):
    """4. Add multiple different products to the same guest cart."""
    db = SessionLocal()
    try:
        p1 = create_test_product(db, sku="CART-TEST-MULTI-1", name="Gold Ring", price=Decimal("12000.00"))
        p2 = create_test_product(db, sku="CART-TEST-MULTI-2", name="Silver Bangle", price=Decimal("4000.00"))
        p1_id, p2_id = str(p1.id), str(p2.id)
    finally:
        db.close()

    # Add first product
    r1 = client.post("/api/cart/items", json={"product_id": p1_id, "quantity": 1})
    assert r1.status_code == 201
    cart_token = r1.json()["cart_token"]

    # Add second product with same token
    r2 = client.post(
        "/api/cart/items",
        json={"product_id": p2_id, "quantity": 1},
        headers={"X-Cart-Token": cart_token},
    )
    assert r2.status_code == 201
    data = r2.json()
    assert data["item_count"] == 2
    assert len(data["items"]) == 2
    assert Decimal(str(data["cart_total"])) == Decimal("16000.00")


def test_update_cart_quantity_regular_product(client):
    """5. Update quantity of a regular product in cart."""
    db = SessionLocal()
    try:
        p = create_test_product(
            db,
            sku="CART-TEST-REG-1",
            item_type="regular",
            stock_quantity=10,
            price=Decimal("5000.00"),
        )
        p_id = str(p.id)
    finally:
        db.close()

    # Add regular product
    r1 = client.post("/api/cart/items", json={"product_id": p_id, "quantity": 2})
    assert r1.status_code == 201
    cart_token = r1.json()["cart_token"]
    item_id = r1.json()["items"][0]["id"]
    assert r1.json()["item_count"] == 2
    assert Decimal(str(r1.json()["cart_total"])) == Decimal("10000.00")

    # Update quantity to 4
    r2 = client.patch(
        f"/api/cart/items/{item_id}",
        json={"quantity": 4},
        headers={"X-Cart-Token": cart_token},
    )
    assert r2.status_code == 200
    assert r2.json()["item_count"] == 4
    assert Decimal(str(r2.json()["cart_total"])) == Decimal("20000.00")


def test_remove_cart_item(client):
    """6. Remove single item from cart."""
    db = SessionLocal()
    try:
        p1 = create_test_product(db, sku="CART-TEST-DEL-1", price=Decimal("10000.00"))
        p2 = create_test_product(db, sku="CART-TEST-DEL-2", price=Decimal("20000.00"))
        p1_id, p2_id = str(p1.id), str(p2.id)
    finally:
        db.close()

    r1 = client.post("/api/cart/items", json={"product_id": p1_id, "quantity": 1})
    cart_token = r1.json()["cart_token"]
    r2 = client.post("/api/cart/items", json={"product_id": p2_id, "quantity": 1}, headers={"X-Cart-Token": cart_token})
    assert r2.json()["item_count"] == 2

    item1_id = r2.json()["items"][0]["id"]
    # Delete first item
    del_resp = client.delete(f"/api/cart/items/{item1_id}", headers={"X-Cart-Token": cart_token})
    assert del_resp.status_code == 200
    data = del_resp.json()
    assert data["item_count"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["sku"] == "CART-TEST-DEL-2"
    assert Decimal(str(data["cart_total"])) == Decimal("20000.00")


def test_clear_cart(client):
    """7. Clear all items from cart."""
    db = SessionLocal()
    try:
        p = create_test_product(db, sku="CART-TEST-CLEAR", price=Decimal("8000.00"))
        p_id = str(p.id)
    finally:
        db.close()

    r1 = client.post("/api/cart/items", json={"product_id": p_id, "quantity": 1})
    cart_token = r1.json()["cart_token"]
    assert r1.json()["item_count"] == 1

    # Clear cart
    clear_resp = client.delete("/api/cart", headers={"X-Cart-Token": cart_token})
    assert clear_resp.status_code == 200
    data = clear_resp.json()
    assert data["item_count"] == 0
    assert data["items"] == []
    assert Decimal(str(data["cart_total"])) == Decimal("0.00")


def test_reject_invalid_product_id(client):
    """8. Reject invalid product ID with 404."""
    fake_id = str(uuid.uuid4())
    resp = client.post("/api/cart/items", json={"product_id": fake_id, "quantity": 1})
    assert resp.status_code == 404
    assert "does not exist in inventory" in resp.json()["detail"]


def test_reject_unavailable_or_inactive_product(client):
    """9. Reject product marked sold or inactive."""
    db = SessionLocal()
    try:
        p_sold = create_test_product(db, sku="CART-TEST-SOLD", status="sold")
        p_inactive = create_test_product(db, sku="CART-TEST-INACT", is_active=False)
        sold_id = str(p_sold.id)
        inactive_id = str(p_inactive.id)
    finally:
        db.close()

    r1 = client.post("/api/cart/items", json={"product_id": sold_id, "quantity": 1})
    assert r1.status_code == 400
    assert "unavailable" in r1.json()["detail"]

    r2 = client.post("/api/cart/items", json={"product_id": inactive_id, "quantity": 1})
    assert r2.status_code == 400
    assert "unavailable" in r2.json()["detail"]


def test_prevent_duplicate_unique_jewellery_items(client):
    """10. Prevent adding the same unique jewellery piece twice."""
    db = SessionLocal()
    try:
        p_unique = create_test_product(db, sku="CART-TEST-UQ-1", item_type="unique")
        p_id = str(p_unique.id)
    finally:
        db.close()

    # First add succeeds
    r1 = client.post("/api/cart/items", json={"product_id": p_id, "quantity": 1})
    assert r1.status_code == 201
    cart_token = r1.json()["cart_token"]

    # Second add of the same unique piece fails with 400
    r2 = client.post(
        "/api/cart/items",
        json={"product_id": p_id, "quantity": 1},
        headers={"X-Cart-Token": cart_token},
    )
    assert r2.status_code == 400
    assert "already in your shopping cart" in r2.json()["detail"]


def test_prevent_quantity_greater_than_one_for_unique_products(client):
    """11. Prevent quantity > 1 for unique jewellery products."""
    db = SessionLocal()
    try:
        p_unique = create_test_product(db, sku="CART-TEST-UQ-QTY", item_type="unique")
        p_id = str(p_unique.id)
    finally:
        db.close()

    # Attempt to add with quantity 2
    resp = client.post("/api/cart/items", json={"product_id": p_id, "quantity": 2})
    assert resp.status_code == 400
    assert "Unique jewellery pieces can only be ordered in a quantity of 1" in resp.json()["detail"]


def test_handle_product_price_changes(client):
    """12. Detect live price change against original price snapshot."""
    db = SessionLocal()
    try:
        p = create_test_product(db, sku="CART-TEST-PRICE-CHG", price=Decimal("10000.00"))
        p_id = str(p.id)
    finally:
        db.close()

    # Add item with initial price 10000
    r1 = client.post("/api/cart/items", json={"product_id": p_id, "quantity": 1})
    assert r1.status_code == 201
    cart_token = r1.json()["cart_token"]
    assert r1.json()["has_price_changes"] is False

    # Gold rate updates! Change product price in DB to 12500
    db = SessionLocal()
    try:
        db_prod = db.query(Product).filter(Product.id == uuid.UUID(p_id)).first()
        db_prod.price = Decimal("12500.00")
        db.commit()
    finally:
        db.close()

    # Re-fetch cart
    r2 = client.get("/api/cart", headers={"X-Cart-Token": cart_token})
    assert r2.status_code == 200
    data = r2.json()
    assert data["has_price_changes"] is True
    item = data["items"][0]
    assert Decimal(str(item["unit_price_snapshot"])) == Decimal("10000.00")
    assert Decimal(str(item["current_price"])) == Decimal("12500.00")
    assert item["price_changed"] is True
    assert Decimal(str(item["price_change_diff"])) == Decimal("2500.00")
    assert Decimal(str(data["cart_total"])) == Decimal("12500.00")


def test_prevent_cross_cart_item_access(client):
    """13. Prevent user B from accessing or mutating user A's cart items."""
    db = SessionLocal()
    try:
        p1 = create_test_product(db, sku="CART-TEST-USER-A", price=Decimal("15000.00"))
        p2 = create_test_product(db, sku="CART-TEST-USER-B", price=Decimal("18000.00"))
        p1_id, p2_id = str(p1.id), str(p2.id)
    finally:
        db.close()

    # User A creates cart
    rA = client.post("/api/cart/items", json={"product_id": p1_id, "quantity": 1})
    token_A = rA.json()["cart_token"]
    item_A_id = rA.json()["items"][0]["id"]

    # User B creates cart
    rB = client.post("/api/cart/items", json={"product_id": p2_id, "quantity": 1})
    token_B = rB.json()["cart_token"]

    # User B attempts to DELETE User A's item using token_B -> 404
    del_resp = client.delete(f"/api/cart/items/{item_A_id}", headers={"X-Cart-Token": token_B})
    assert del_resp.status_code == 404
    assert "Item not found in your shopping cart" in del_resp.json()["detail"]

    # User B attempts to PATCH User A's item using token_B -> 404
    patch_resp = client.patch(
        f"/api/cart/items/{item_A_id}",
        json={"quantity": 2},
        headers={"X-Cart-Token": token_B},
    )
    assert patch_resp.status_code == 404
    assert "Item not found in your shopping cart" in patch_resp.json()["detail"]


def test_cart_summary_endpoint(client):
    """15. Cart summary returns lightweight details for checkout preview."""
    db = SessionLocal()
    try:
        p = create_test_product(db, sku="CART-TEST-SUMMARY", price=Decimal("35000.00"))
        p_id = str(p.id)
    finally:
        db.close()

    add_resp = client.post("/api/cart/items", json={"product_id": p_id, "quantity": 1})
    token = add_resp.json()["cart_token"]

    sum_resp = client.get("/api/cart/summary", headers={"X-Cart-Token": token})
    assert sum_resp.status_code == 200
    data = sum_resp.json()
    assert data["success"] is True
    assert data["item_count"] == 1
    assert Decimal(str(data["cart_total"])) == Decimal("35000.00")
    assert data["is_available"] is True
    assert len(data["item_summaries"]) == 1
    assert data["item_summaries"][0]["name"] == "Test Temple Necklace"


def test_concurrent_unique_item_addition(client):
    """15. Verify concurrent attempts to add the same unique product to a cart fail safely."""
    from concurrent.futures import ThreadPoolExecutor

    db = SessionLocal()
    try:
        p = create_test_product(db, sku="CART-TEST-CONCUR", item_type="unique")
        p_id = str(p.id)
    finally:
        db.close()

    # Create cart
    init_resp = client.get("/api/cart")
    token = init_resp.json()["cart_token"]

    def try_add():
        return client.post(
            "/api/cart/items",
            json={"product_id": p_id, "quantity": 1},
            headers={"X-Cart-Token": token},
        )

    with ThreadPoolExecutor(max_workers=2) as executor:
        f1 = executor.submit(try_add)
        f2 = executor.submit(try_add)
        r1 = f1.result()
        r2 = f2.result()

    statuses = sorted([r1.status_code, r2.status_code])
    # Exactly one should succeed with 201, and one should fail with 400 (already in bag)
    assert statuses == [201, 400]


def test_apply_and_remove_coupon(client):
    """16. Test applying valid coupon, verifying discount and taxes, and removing coupon."""
    db = SessionLocal()
    try:
        p = create_test_product(db, sku="CART-TEST-COUPON", price=Decimal("25000.00"))
        p_id = str(p.id)
    finally:
        db.close()

    # Add product
    add_resp = client.post("/api/cart/items", json={"product_id": p_id, "quantity": 1})
    token = add_resp.json()["cart_token"]
    assert add_resp.status_code == 201

    # 1. Apply invalid coupon -> 400
    inv_resp = client.post(
        "/api/cart/coupon/apply",
        json={"code": "INVALID_CODE_99"},
        headers={"X-Cart-Token": token},
    )
    assert inv_resp.status_code == 400
    assert "is invalid or expired" in inv_resp.json()["detail"]

    # 2. Apply valid coupon WELCOME5 (5% off 25,000 = 1,250 discount)
    apply_resp = client.post(
        "/api/cart/coupon/apply",
        json={"code": "WELCOME5"},
        headers={"X-Cart-Token": token},
    )
    assert apply_resp.status_code == 200
    data = apply_resp.json()
    assert data["applied_coupon_code"] == "WELCOME5"
    assert Decimal(str(data["subtotal"])) == Decimal("25000.00")
    assert Decimal(str(data["coupon_discount"])) == Decimal("1250.00")
    # Tax = 3% of (25000 - 1250 = 23750) = 712.50
    assert Decimal(str(data["tax"])) == Decimal("712.50")
    # Cart total (subtotal - coupon discount) = 23750.00
    assert Decimal(str(data["cart_total"])) == Decimal("23750.00")

    # 3. GET /api/cart should persist the applied coupon
    get_resp = client.get("/api/cart", headers={"X-Cart-Token": token})
    assert get_resp.status_code == 200
    get_data = get_resp.json()
    assert get_data["applied_coupon_code"] == "WELCOME5"
    assert Decimal(str(get_data["coupon_discount"])) == Decimal("1250.00")

    # 4. Remove coupon
    del_resp = client.delete("/api/cart/coupon", headers={"X-Cart-Token": token})
    assert del_resp.status_code == 200
    del_data = del_resp.json()
    assert del_data["applied_coupon_code"] is None
    assert Decimal(str(del_data["coupon_discount"])) == Decimal("0.00")
    assert Decimal(str(del_data["subtotal"])) == Decimal("25000.00")


def test_coupon_minimum_order_value_validation(client):
    """17. Test coupon fails when cart value is less than min_order_value."""
    db = SessionLocal()
    try:
        # FESTIVE10 has min_order_value = 50,000
        p = create_test_product(db, sku="CART-TEST-MINVAL", price=Decimal("15000.00"))
        p_id = str(p.id)
    finally:
        db.close()

    add_resp = client.post("/api/cart/items", json={"product_id": p_id, "quantity": 1})
    token = add_resp.json()["cart_token"]

    resp = client.post(
        "/api/cart/coupon/apply",
        json={"code": "FESTIVE10"},
        headers={"X-Cart-Token": token},
    )
    assert resp.status_code == 400
    assert "requires a minimum order subtotal" in resp.json()["detail"]
