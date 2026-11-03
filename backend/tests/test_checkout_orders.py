import uuid
import hmac
import hashlib
from decimal import Decimal
import pytest
from backend.app.models.cart import ShoppingCart, ShoppingCartItem
from backend.app.models.product import Product
from backend.app.models.order import Order, OrderItem, Payment
from backend.app.models.customer import Customer
from backend.app.db.session import SessionLocal
from backend.app.core.config import settings
from backend.app.core.security import create_access_token, hash_password


@pytest.fixture(autouse=True)
def cleanup_checkout_test_data():
    """Ensure orders, payments, carts, and test products are cleaned up after each test."""
    yield
    db = SessionLocal()
    try:
        db.query(Payment).delete(synchronize_session=False)
        db.query(OrderItem).delete(synchronize_session=False)
        db.query(Order).delete(synchronize_session=False)
        db.query(ShoppingCartItem).delete(synchronize_session=False)
        db.query(ShoppingCart).delete(synchronize_session=False)
        db.query(Product).filter(Product.sku.startswith("CHK-TEST-")).delete(synchronize_session=False)
        db.query(Customer).filter(Customer.mobile_number.startswith("99999")).delete(synchronize_session=False)
        db.commit()
    finally:
        db.close()


def create_checkout_product(
    db,
    sku: str = "CHK-TEST-01",
    name: str = "Heritage Temple Choker",
    item_type: str = "unique",
    price: Decimal = Decimal("100000.00"),
    stock_quantity: int = 1,
    status: str = "available",
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
        is_active=True,
        gross_weight="24.500g",
        purity="22K (916 BIS Hallmarked)",
        image_url="/images/products/gold/choker.jpg",
    )
    db.add(prod)
    db.commit()
    db.refresh(prod)
    return prod


def test_checkout_quote_calculation(client):
    """1. Checkout quote accurately calculates 3% GST, complimentary courier, and subtotal."""
    db = SessionLocal()
    try:
        p1 = create_checkout_product(db, sku="CHK-TEST-Q1", name="Gold Bangle", price=Decimal("50000.00"))
        p2 = create_checkout_product(db, sku="CHK-TEST-Q2", name="Gold Earrings", price=Decimal("25000.00"))

        # Create cart and add items
        cart_resp = client.get("/api/cart")
        token = cart_resp.headers["X-Cart-Token"]
        headers = {"X-Cart-Token": token}

        client.post("/api/cart/items", json={"product_id": str(p1.id), "quantity": 1}, headers=headers)
        client.post("/api/cart/items", json={"product_id": str(p2.id), "quantity": 1}, headers=headers)

        # Get quote
        quote_resp = client.post("/api/checkout/quote", headers=headers)
        assert quote_resp.status_code == 200
        quote = quote_resp.json()

        assert quote["subtotal"] == 75000.0
        # 3% GST on 75,000 = 2,250
        assert quote["tax"] == 2250.0
        assert quote["delivery_charge"] == 0.0
        assert quote["total_amount"] == 77250.0
        assert quote["item_count"] == 2
        assert quote["can_proceed"] is True
        assert len(quote["available_payment_methods"]) >= 2
    finally:
        db.close()


def test_checkout_unavailable_item_blocks_proceed(client):
    """2. If an item becomes unavailable/sold, checkout quote blocks progression."""
    db = SessionLocal()
    try:
        p1 = create_checkout_product(db, sku="CHK-TEST-UN", status="available")

        cart_resp = client.get("/api/cart")
        token = cart_resp.headers["X-Cart-Token"]
        headers = {"X-Cart-Token": token}

        client.post("/api/cart/items", json={"product_id": str(p1.id), "quantity": 1}, headers=headers)

        # Mark product unavailable in DB
        p1.status = "sold"
        db.commit()

        # Quote should detect unavailable status
        quote_resp = client.post("/api/checkout/quote", headers=headers)
        assert quote_resp.status_code == 200
        quote = quote_resp.json()
        assert quote["can_proceed"] is False
        assert len(quote["validation_errors"]) > 0
    finally:
        db.close()


def test_place_order_guest_cod_success(client):
    """3. Guest customer places COD order: creates order, snapshot items, clears cart, marks unique sold."""
    db = SessionLocal()
    try:
        prod = create_checkout_product(db, sku="CHK-TEST-COD", name="Antique Haram", price=Decimal("120000.00"), item_type="unique")

        cart_resp = client.get("/api/cart")
        token = cart_resp.headers["X-Cart-Token"]
        headers = {"X-Cart-Token": token}

        client.post("/api/cart/items", json={"product_id": str(prod.id), "quantity": 1}, headers=headers)

        order_payload = {
            "customer": {
                "customerName": "Suresh Kumar",
                "mobileNumber": "9840123456",
                "email": "suresh@example.com",
            },
            "delivery": {
                "fullAddress": "12 East Veli Street, Near Meenakshi Temple",
                "city": "Madurai",
                "state": "Tamil Nadu",
                "pinCode": "625001",
            },
            "paymentMethod": "COD",
        }

        resp = client.post("/api/checkout/create-order", json=order_payload, headers=headers)
        assert resp.status_code == 201
        order_data = resp.json()

        assert order_data["order_number"].startswith("VR-")
        assert order_data["customer_name"] == "Suresh Kumar"
        assert order_data["total_amount"] == 123600.0  # 120,000 + 3% tax (3600)
        assert order_data["payment_status"] == "pending"
        assert order_data["order_status"] == "Confirmed"
        assert len(order_data["items"]) == 1
        assert order_data["items"][0]["product_sku"] == "CHK-TEST-COD"
        assert order_data["order_token"] is not None

        # Verify in DB
        db.refresh(prod)
        assert prod.status == "sold"
        assert prod.stock_quantity == 0

        # Verify cart items cleared
        cart_check = client.get("/api/cart", headers=headers)
        assert len(cart_check.json()["items"]) == 0
    finally:
        db.close()


def test_idempotency_prevents_duplicate_orders(client):
    """4. Duplicate order request with identical idempotencyKey returns existing order without duplicate records."""
    db = SessionLocal()
    try:
        prod = create_checkout_product(db, sku="CHK-TEST-IDEMP", price=Decimal("30000.00"), item_type="regular", stock_quantity=10)

        cart_resp = client.get("/api/cart")
        token = cart_resp.headers["X-Cart-Token"]
        headers = {"X-Cart-Token": token}

        client.post("/api/cart/items", json={"product_id": str(prod.id), "quantity": 1}, headers=headers)

        idempotency_key = "idemp_test_key_12345"
        payload = {
            "customer": {
                "customerName": "Meenakshi Sundaram",
                "mobileNumber": "9789123456",
            },
            "delivery": {
                "fullAddress": "45 South Masi Street",
                "city": "Madurai",
                "state": "Tamil Nadu",
                "pinCode": "625001",
            },
            "paymentMethod": "COD",
            "idempotencyKey": idempotency_key,
        }

        # First request
        resp1 = client.post("/api/checkout/create-order", json=payload, headers=headers)
        assert resp1.status_code == 201
        order1 = resp1.json()

        # Second request with same idempotency key
        resp2 = client.post("/api/checkout/create-order", json=payload, headers=headers)
        assert resp2.status_code == 201
        order2 = resp2.json()

        assert order1["order_number"] == order2["order_number"]

        # Check only 1 order exists in DB
        count = db.query(Order).filter(Order.idempotency_key == idempotency_key).count()
        assert count == 1
    finally:
        db.close()


def test_guest_order_security_token_protection(client):
    """5. Orders cannot be enumerated by guessable sequential numbers alone; requires valid order token."""
    db = SessionLocal()
    try:
        prod = create_checkout_product(db, sku="CHK-TEST-SEC", price=Decimal("15000.00"))

        cart_resp = client.get("/api/cart")
        token = cart_resp.headers["X-Cart-Token"]
        headers = {"X-Cart-Token": token}

        client.post("/api/cart/items", json={"product_id": str(prod.id), "quantity": 1}, headers=headers)

        payload = {
            "customer": {
                "customerName": "Ramesh Nathan",
                "mobileNumber": "9443123456",
            },
            "delivery": {
                "fullAddress": "7 Palace Road",
                "city": "Madurai",
                "state": "Tamil Nadu",
                "pinCode": "625001",
            },
            "paymentMethod": "COD",
        }

        order_res = client.post("/api/checkout/create-order", json=payload, headers=headers).json()
        order_num = order_res["order_number"]
        order_token = order_res["order_token"]

        # Case A: Request with correct token -> 200 OK
        resp_valid = client.get(f"/api/orders/{order_num}", headers={"X-Order-Token": order_token})
        assert resp_valid.status_code == 200
        assert resp_valid.json()["order_number"] == order_num

        # Case B: Request without token -> 403 Forbidden
        resp_no_token = client.get(f"/api/orders/{order_num}")
        assert resp_no_token.status_code == 403

        # Case C: Request with wrong token -> 403 Forbidden
        resp_wrong_token = client.get(f"/api/orders/{order_num}", headers={"X-Order-Token": "invalid_token_guess"})
        assert resp_wrong_token.status_code == 403
    finally:
        db.close()


def test_concurrency_unique_item_cannot_be_purchased_twice(client):
    """6. Two carts having the same unique 1-of-1 piece: once first purchases it, second checkout fails with 409."""
    db = SessionLocal()
    try:
        prod = create_checkout_product(db, sku="CHK-TEST-CONCUR", price=Decimal("80000.00"), item_type="unique", stock_quantity=1)

        # Cart A
        resp_a = client.get("/api/cart")
        token_a = resp_a.headers["X-Cart-Token"]
        client.post("/api/cart/items", json={"product_id": str(prod.id), "quantity": 1}, headers={"X-Cart-Token": token_a})

        # Cart B
        resp_b = client.get("/api/cart")
        token_b = resp_b.headers["X-Cart-Token"]
        client.post("/api/cart/items", json={"product_id": str(prod.id), "quantity": 1}, headers={"X-Cart-Token": token_b})

        buyer_payload = {
            "customer": {"customerName": "Buyer One", "mobileNumber": "9000123456"},
            "delivery": {"fullAddress": "Madurai Main Road", "city": "Madurai", "state": "Tamil Nadu", "pinCode": "625001"},
            "paymentMethod": "COD",
        }

        # Cart A completes order successfully
        order_a = client.post("/api/checkout/create-order", json=buyer_payload, headers={"X-Cart-Token": token_a})
        assert order_a.status_code == 201

        # Cart B attempts to purchase the now-sold unique item
        buyer_b_payload = {
            "customer": {"customerName": "Buyer Two", "mobileNumber": "9111123456"},
            "delivery": {"fullAddress": "Madurai West", "city": "Madurai", "state": "Tamil Nadu", "pinCode": "625001"},
            "paymentMethod": "COD",
        }
        order_b = client.post("/api/checkout/create-order", json=buyer_b_payload, headers={"X-Cart-Token": token_b})
        assert order_b.status_code == 409  # Conflict!
        assert "no longer available" in order_b.json()["detail"]
    finally:
        db.close()


def test_authenticated_customer_order_association_and_listing(client):
    """7. Authenticated customer orders are associated with customer account and retrievable via GET /api/orders."""
    db = SessionLocal()
    try:
        cust = Customer(
            customer_name="Radha Ramanathan",
            mobile_number="9999900001",
            full_address="15 North Chithirai St, Madurai",
            pin_code="625001",
            password_hash=hash_password("Radha@1234"),
            is_active=True,
            is_verified=True,
        )
        db.add(cust)
        db.commit()
        db.refresh(cust)

        cust_token = create_access_token(subject=str(cust.id), claims={"role": "customer", "mobile": cust.mobile_number})

        prod = create_checkout_product(db, sku="CHK-TEST-CUST", price=Decimal("40000.00"))

        cart_resp = client.get("/api/cart")
        cart_token = cart_resp.headers["X-Cart-Token"]
        headers = {
            "X-Cart-Token": cart_token,
            "Authorization": f"Bearer {cust_token}"
        }

        client.post("/api/cart/items", json={"product_id": str(prod.id), "quantity": 1}, headers=headers)

        payload = {
            "customer": {
                "customerName": cust.customer_name,
                "mobileNumber": cust.mobile_number,
            },
            "delivery": {
                "fullAddress": cust.full_address,
                "city": "Madurai",
                "state": "Tamil Nadu",
                "pinCode": cust.pin_code,
            },
            "paymentMethod": "SHOWROOM_PAY",
        }

        order_res = client.post("/api/checkout/create-order", json=payload, headers=headers)
        assert order_res.status_code == 201

        # Retrieve customer orders
        my_orders_res = client.get("/api/orders", headers={"Authorization": f"Bearer {cust_token}"})
        assert my_orders_res.status_code == 200
        orders_list = my_orders_res.json()
        assert len(orders_list) >= 1
        assert orders_list[0]["customer_name"] == "Radha Ramanathan"
    finally:
        db.close()
