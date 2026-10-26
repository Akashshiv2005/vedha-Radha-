import pytest
from app.core.config import settings


@pytest.fixture
def auth_headers(client):
    response = client.post(
        "/api/auth/login",
        json={
            "username": "admin",
            "password": settings.ADMIN_BOOTSTRAP_PASSWORD,
        },
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_order_validations(client, auth_headers):
    # Missing required customer name
    res = client.post(
        "/api/admin/orders",
        json={"phone": "9876543210", "productSku": "DEP-D3B6ED"},
        headers=auth_headers,
    )
    assert res.status_code == 422

    # Non-existent SKU
    res = client.post(
        "/api/admin/orders",
        json={"customerName": "Ramesh", "phone": "9876543210", "productSku": "NONEXISTENT-SKU-999"},
        headers=auth_headers,
    )
    assert res.status_code == 404


def test_create_order_authoritative_calculation_and_persistence(client, auth_headers):
    # 1. Create a test product
    test_sku = "TEST-ORD-RING-1"
    client.post(
        "/api/admin/products",
        json={
            "sku": test_sku,
            "name": "Order Test Diamond Ring",
            "category": "Rings",
            "subCategory": "Casual Rings",
            "price": 50000,
            "status": "available",
            "item_type": "regular"
        },
        headers=auth_headers,
    )

    # 2. Create order for 2 items with 2000 discount
    # subtotal = 50,000 * 2 = 100,000
    # tax (3% GST) = 3,000
    # total = 100,000 - 2,000 + 3,000 = 101,000
    order_payload = {
        "customerName": "Smt. Meenakshi Ammal",
        "phone": "+91 98401 23456",
        "email": "meenakshi@example.com",
        "productSku": test_sku,
        "quantity": 2,
        "discount": 2000,
        "channel": "Showroom",
        "paymentMethod": "UPI",
        "paymentStatus": "paid",
        "orderStatus": "confirmed",
        "notes": "Wedding anniversary purchase."
    }

    create_res = client.post("/api/admin/orders", json=order_payload, headers=auth_headers)
    assert create_res.status_code == 201, create_res.text
    order = create_res.json()

    assert order["customerName"] == "Smt. Meenakshi Ammal"
    assert order["productSku"] == test_sku
    assert order["productName"] == "Order Test Diamond Ring"
    assert order["unitPrice"] == 50000.0
    assert order["quantity"] == 2
    assert order["discount"] == 2000.0
    assert order["tax"] == 3000.0
    assert order["totalAmount"] == 101000.0
    assert order["orderNumber"].startswith("VR-")

    # 3. Retrieve orders list to verify persistence
    list_res = client.get("/api/admin/orders", headers=auth_headers)
    assert list_res.status_code == 200
    orders_list = list_res.json()
    assert any(o["orderNumber"] == order["orderNumber"] for o in orders_list)

    # Cleanup product
    client.delete(f"/api/admin/products/{test_sku}?hard=true", headers=auth_headers)
