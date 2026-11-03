import uuid
from decimal import Decimal
import pytest
from datetime import datetime, timezone, timedelta
from backend.app.models.customer import Customer, CustomerOTP
from backend.app.models.order import Order
from backend.app.core.security import hash_password, create_access_token
from backend.app.db.session import SessionLocal


@pytest.fixture(autouse=True)
def cleanup_test_customers():
    """Clean up test customers created during tests."""
    yield
    db = SessionLocal()
    try:
        db.query(CustomerOTP).filter(CustomerOTP.mobile_number.like("9840%")).delete(synchronize_session=False)
        db.query(Order).filter(Order.phone.like("9840%")).delete(synchronize_session=False)
        db.query(Customer).filter(Customer.mobile_number.like("9840%")).delete(synchronize_session=False)
        db.commit()
    finally:
        db.close()


def test_customer_registration_success(client):
    payload = {
        "customer_name": "Radha Ramanathan",
        "mobile_number": "9840123456",
        "alternative_mobile_number": "9840987654",
        "full_address": "Flat 4A, Temple View Towers, Mylapore, Chennai",
        "pin_code": "600004",
        "password": "Password@123",
        "re_enter_password": "Password@123",
    }
    resp = client.post("/api/customer/auth/register", json=payload)
    assert resp.status_code == 201
    data = resp.json()
    assert data["success"] is True
    assert "access_token" in data
    assert data["customer"]["customer_name"] == "Radha Ramanathan"
    assert data["customer"]["mobile_number"] == "9840123456"
    assert data["customer"]["pin_code"] == "600004"
    assert "password_hash" not in data["customer"]


def test_customer_registration_duplicate_mobile(client):
    db = SessionLocal()
    try:
        customer = Customer(
            customer_name="Existing Customer",
            mobile_number="9840123456",
            full_address="12 South Mada Street, Mylapore",
            pin_code="600004",
            password_hash=hash_password("Password@123"),
            is_active=True,
        )
        db.add(customer)
        db.commit()
    finally:
        db.close()

    payload = {
        "customer_name": "New Person",
        "mobile_number": "9840123456",
        "full_address": "Another Address, Chennai",
        "pin_code": "600004",
        "password": "Password@123",
        "re_enter_password": "Password@123",
    }
    resp = client.post("/api/customer/auth/register", json=payload)
    assert resp.status_code == 409
    assert "already registered" in resp.json()["detail"]["error"]


def test_customer_registration_validation_errors(client):
    # 1. Invalid mobile (less than 10 digits)
    resp1 = client.post("/api/customer/auth/register", json={
        "customer_name": "Test User",
        "mobile_number": "12345",
        "full_address": "Address here",
        "pin_code": "600004",
        "password": "Password@123",
        "re_enter_password": "Password@123"
    })
    assert resp1.status_code == 422

    # 2. Invalid PIN code (not 6 digits)
    resp2 = client.post("/api/customer/auth/register", json={
        "customer_name": "Test User",
        "mobile_number": "9840123456",
        "full_address": "Address here",
        "pin_code": "6000",
        "password": "Password@123",
        "re_enter_password": "Password@123"
    })
    assert resp2.status_code == 422

    # 3. Password mismatch
    resp3 = client.post("/api/customer/auth/register", json={
        "customer_name": "Test User",
        "mobile_number": "9840123456",
        "full_address": "Address here",
        "pin_code": "600004",
        "password": "Password@123",
        "re_enter_password": "DifferentPassword@123"
    })
    assert resp3.status_code == 422

    # 4. Alt mobile same as primary
    resp4 = client.post("/api/customer/auth/register", json={
        "customer_name": "Test User",
        "mobile_number": "9840123456",
        "alternative_mobile_number": "9840123456",
        "full_address": "Address here",
        "pin_code": "600004",
        "password": "Password@123",
        "re_enter_password": "Password@123"
    })
    assert resp4.status_code == 422


def test_customer_login_success(client):
    db = SessionLocal()
    try:
        customer = Customer(
            customer_name="Smt. Meenakshi",
            mobile_number="9840111222",
            full_address="14 West Mada Street, Mylapore",
            pin_code="600004",
            password_hash=hash_password("SecurePass@2026"),
            is_active=True,
        )
        db.add(customer)
        db.commit()
    finally:
        db.close()

    resp = client.post("/api/customer/auth/login", json={
        "mobile_number": "9840111222",
        "password": "SecurePass@2026",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert "access_token" in data
    assert data["customer"]["customer_name"] == "Smt. Meenakshi"


def test_customer_login_invalid_credentials(client):
    db = SessionLocal()
    try:
        customer = Customer(
            customer_name="Smt. Meenakshi",
            mobile_number="9840111222",
            full_address="14 West Mada Street, Mylapore",
            pin_code="600004",
            password_hash=hash_password("SecurePass@2026"),
            is_active=True,
        )
        db.add(customer)
        db.commit()
    finally:
        db.close()

    # Wrong password
    resp = client.post("/api/customer/auth/login", json={
        "mobile_number": "9840111222",
        "password": "WrongPassword",
    })
    assert resp.status_code == 401
    assert "Invalid mobile number or password" in resp.json()["detail"]["error"]

    # Non-existent mobile number
    resp2 = client.post("/api/customer/auth/login", json={
        "mobile_number": "9840999999",
        "password": "SecurePass@2026",
    })
    assert resp2.status_code == 401


def test_customer_profile_and_authorization(client):
    db = SessionLocal()
    try:
        customer = Customer(
            customer_name="Ganesh Kumar",
            mobile_number="9840333444",
            full_address="No 5 North Street, T Nagar, Chennai",
            pin_code="600017",
            password_hash=hash_password("Password@123"),
            is_active=True,
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)
        cust_id = customer.id
        cust_name = customer.customer_name
    finally:
        db.close()

    # Valid token
    token = create_access_token(
        subject=str(cust_id),
        claims={"role": "customer", "name": cust_name},
    )

    # 1. Get Me
    resp = client.get("/api/customer/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["customer"]["customer_name"] == "Ganesh Kumar"

    # 2. Update Profile
    update_resp = client.put(
        "/api/customer/profile",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "customer_name": "Ganesh K.",
            "full_address": "Updated Address 101, T Nagar",
            "pin_code": "600018",
        },
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["customer"]["customer_name"] == "Ganesh K."
    assert update_resp.json()["customer"]["pin_code"] == "600018"

    # 3. Change Password
    pw_resp = client.post(
        "/api/customer/auth/change-password",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "current_password": "Password@123",
            "new_password": "BrandNewPassword@456",
            "confirm_new_password": "BrandNewPassword@456",
        },
    )
    assert pw_resp.status_code == 200

    # 4. Login with new password
    login_resp = client.post("/api/customer/auth/login", json={
        "mobile_number": "9840333444",
        "password": "BrandNewPassword@456",
    })
    assert login_resp.status_code == 200


def test_role_separation_customer_vs_admin(client, auth_headers):
    db = SessionLocal()
    try:
        customer = Customer(
            customer_name="Test Customer",
            mobile_number="9840555666",
            full_address="Chennai",
            pin_code="600001",
            password_hash=hash_password("Password@123"),
            is_active=True,
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)
        cust_id = customer.id
    finally:
        db.close()

    customer_token = create_access_token(
        subject=str(cust_id),
        claims={"role": "customer"},
    )

    # Customer token cannot access Admin endpoint
    resp1 = client.get("/api/admin/orders", headers={"Authorization": f"Bearer {customer_token}"})
    assert resp1.status_code == 403

    # Admin token cannot access Customer-specific profile endpoint
    resp2 = client.get("/api/customer/auth/me", headers=auth_headers)
    assert resp2.status_code == 403


def test_customer_order_history(client):
    db = SessionLocal()
    try:
        customer = Customer(
            customer_name="Lakshmi Priya",
            mobile_number="9840777888",
            full_address="Mylapore, Chennai",
            pin_code="600004",
            password_hash=hash_password("Password@123"),
            is_active=True,
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)
        cust_id = customer.id
        cust_name = customer.customer_name

        o1 = Order(
            order_number=f"VR-2026-TEST-{uuid.uuid4().hex[:6]}",
            customer_name="Lakshmi Priya",
            phone="9840777888",
            product_sku="SKU-GOLD-01",
            product_name="Lakshmi Kasu Chain",
            quantity=1,
            unit_price=Decimal("75000.00"),
            total_amount=Decimal("75000.00"),
        )
        o2 = Order(
            order_number=f"VR-2026-TEST-{uuid.uuid4().hex[:6]}",
            customer_name="Lakshmi Priya",
            phone="9840777888",
            product_sku="SKU-SILVER-02",
            product_name="Silver Pooja Thali",
            quantity=1,
            unit_price=Decimal("15000.00"),
            total_amount=Decimal("15000.00"),
        )
        db.add_all([o1, o2])
        db.commit()
    finally:
        db.close()

    token = create_access_token(
        subject=str(cust_id),
        claims={"role": "customer", "name": cust_name},
    )

    resp = client.get("/api/customer/orders", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    orders = resp.json()
    assert len(orders) >= 2


def test_forgot_password_sms_unconfigured_reporting(client):
    # When no SMS provider is configured, server reports 503 rather than faking OTP delivery
    resp = client.post("/api/customer/auth/forgot-password", json={
        "mobile_number": "9840123456",
    })
    assert resp.status_code == 503
    assert "SMS Gateway service is not configured" in resp.json()["detail"]["error"]
