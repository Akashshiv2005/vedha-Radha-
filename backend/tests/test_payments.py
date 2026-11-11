import hmac
import hashlib
from unittest.mock import patch
from app.core.config import settings


def test_payment_config(client):
    res = client.get("/api/payments/config")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["key_id"] == settings.RAZORPAY_KEY_ID
    assert data["currency"] == "INR"


def test_create_payment_order_nonexistent_sku(client):
    res = client.post(
        "/api/payments/create-order",
        json={
            "customer_name": "Akash S",
            "phone": "9876543210",
            "items": [{"sku": "NONEXISTENT-SKU-999", "quantity": 1}],
        },
    )
    assert res.status_code == 404


def test_create_and_verify_payment(client):
    # 1. Login admin and create a product
    login_res = client.post(
        "/api/auth/login",
        json={
            "username": "admin",
            "password": settings.ADMIN_BOOTSTRAP_PASSWORD,
        },
    )
    token = login_res.json()["access_token"]
    auth_headers = {"Authorization": f"Bearer {token}"}

    sku = "TEST-PAY-NECKLACE-LIVE-03"
    client.post(
        "/api/admin/products",
        json={
            "sku": sku,
            "name": "Royal Emerald Necklace",
            "category": "Gold",
            "price": 100000,
            "status": "available",
            "item_type": "unique",
        },
        headers=auth_headers,
    )

    def mock_gw_impl(order, db):
        return {
            "key_id": settings.RAZORPAY_KEY_ID,
            "razorpay_order_id": "order_test_mock_12345",
            "amount": 10300000,
            "currency": "INR",
            "order_number": order.order_number,
            "customer": {"name": "Karthik Raja", "contact": "9876543210", "email": "karthik@example.com"}
        }

    with patch("app.api.routes.payments.create_gateway_order", side_effect=mock_gw_impl):
        res = client.post(
            "/api/payments/create-order",
            json={
                "customer_name": "Karthik Raja",
                "phone": "9876543210",
                "email": "karthik@example.com",
                "city": "Madurai",
                "delivery_address": "45 Palace Road",
                "items": [{"sku": sku, "quantity": 1}],
            },
        )
        assert res.status_code == 201
        data = res.json()
        assert data["razorpay_order_id"] == "order_test_mock_12345"
        order_number = data["order_number"]

    # 3. Test verification failure with invalid signature
    fail_res = client.post(
        "/api/payments/verify",
        json={
            "order_number": order_number,
            "razorpay_order_id": "order_test_mock_12345",
            "razorpay_payment_id": "pay_test_bad_123",
            "razorpay_signature": "invalid_sig_hash",
        },
    )
    assert fail_res.status_code == 200
    assert fail_res.json()["success"] is False

    # 4. Test verification success with valid HMAC-SHA256 signature
    pay_id = "pay_test_good_456"
    msg = f"order_test_mock_12345|{pay_id}".encode("utf-8")
    valid_sig = hmac.new(settings.RAZORPAY_KEY_SECRET.encode("utf-8"), msg, hashlib.sha256).hexdigest()

    ok_res = client.post(
        "/api/payments/verify",
        json={
            "order_number": order_number,
            "razorpay_order_id": "order_test_mock_12345",
            "razorpay_payment_id": pay_id,
            "razorpay_signature": valid_sig,
        },
    )
    assert ok_res.status_code == 200
    assert ok_res.json()["success"] is True
    assert ok_res.json()["payment_status"] == "paid"
    assert ok_res.json()["order_status"] == "Confirmed"
