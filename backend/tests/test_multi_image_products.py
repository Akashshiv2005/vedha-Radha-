import io
import pytest
from decimal import Decimal
from fastapi.testclient import TestClient
from PIL import Image

from app.main import app
from app.db.session import SessionLocal
from app.models.product import Product
from app.services.minio_service import minio_service

client = TestClient(app)


def create_test_image(color=(255, 0, 0), format="WEBP") -> bytes:
    buffer = io.BytesIO()
    img = Image.new("RGB", (100, 100), color=color)
    img.save(buffer, format=format)
    return buffer.getvalue()


@pytest.fixture(scope="module")
def admin_auth_token():
    from app.core.config import settings
    from app.core.rate_limiter import login_rate_limiter
    login_rate_limiter.reset("127.0.0.1:admin")
    resp = client.post("/api/auth/login", json={
        "username": "admin",
        "password": settings.ADMIN_BOOTSTRAP_PASSWORD
    })
    assert resp.status_code == 200, f"Login failed: {resp.text}"
    return resp.json().get("access_token")


def test_create_product_with_one_image(admin_auth_token):
    sku = "TEST-IMG-1"
    db = SessionLocal()
    db.query(Product).filter(Product.sku == sku).delete()
    db.commit()
    db.close()

    headers = {"Authorization": f"Bearer {admin_auth_token}"}
    payload = {
        "sku": sku,
        "name": "Single Image Ring",
        "category": "Rings",
        "price": 15000,
        "status": "available",
        "images": ["/images/product_anklet.jpg"]
    }
    resp = client.post("/api/admin/products", json=payload, headers=headers)
    assert resp.status_code == 201, resp.text
    data = resp.json()
    assert len(data["images"]) == 1
    assert data["image"] == "/images/product_anklet.jpg"
    assert data["images"][0] == "/images/product_anklet.jpg"

    pub_resp = client.get(f"/api/products/{sku}")
    assert pub_resp.status_code == 200
    pub_data = pub_resp.json()
    assert len(pub_data["images"]) == 1
    assert pub_data["image"] == "/images/product_anklet.jpg"

    db = SessionLocal()
    db.query(Product).filter(Product.sku == sku).delete()
    db.commit()
    db.close()


def test_create_product_with_two_and_three_images(admin_auth_token):
    headers = {"Authorization": f"Bearer {admin_auth_token}"}
    db = SessionLocal()

    sku2 = "TEST-IMG-2"
    db.query(Product).filter(Product.sku == sku2).delete()
    db.commit()

    payload2 = {
        "sku": sku2,
        "name": "Two Image Bangle",
        "category": "Bangles",
        "price": 28000,
        "status": "available",
        "images": ["/images/product_gold_chain.jpg", "/images/product_anklet.jpg"]
    }
    resp2 = client.post("/api/admin/products", json=payload2, headers=headers)
    assert resp2.status_code == 201
    data2 = resp2.json()
    assert len(data2["images"]) == 2
    assert data2["image"] == "/images/product_gold_chain.jpg"
    assert data2["images"][0] == "/images/product_gold_chain.jpg"
    assert data2["images"][1] == "/images/product_anklet.jpg"

    sku3 = "TEST-IMG-3"
    db.query(Product).filter(Product.sku == sku3).delete()
    db.commit()

    payload3 = {
        "sku": sku3,
        "name": "Three Image Necklace",
        "category": "Necklace",
        "price": 75000,
        "status": "available",
        "images": [
            "/images/product_gold_chain.jpg",
            "/images/product_anklet.jpg",
            "/images/product_silver_bowl.jpg"
        ]
    }
    resp3 = client.post("/api/admin/products", json=payload3, headers=headers)
    assert resp3.status_code == 201
    data3 = resp3.json()
    assert len(data3["images"]) == 3
    assert data3["image"] == "/images/product_gold_chain.jpg"
    assert data3["images"][0] == "/images/product_gold_chain.jpg"
    assert data3["images"][1] == "/images/product_anklet.jpg"
    assert data3["images"][2] == "/images/product_silver_bowl.jpg"

    db.query(Product).filter(Product.sku.in_([sku2, sku3])).delete()
    db.commit()
    db.close()


def test_reject_more_than_three_images(admin_auth_token):
    headers = {"Authorization": f"Bearer {admin_auth_token}"}
    sku = "TEST-IMG-4-FAIL"

    payload = {
        "sku": sku,
        "name": "Four Image Over-limit Piece",
        "category": "Rings",
        "price": 12000,
        "status": "available",
        "images": [
            "/images/product_anklet.jpg",
            "/images/product_gold_chain.jpg",
            "/images/product_silver_bowl.jpg",
            "/images/product_gold_earrings.jpg"
        ]
    }
    resp = client.post("/api/admin/products", json=payload, headers=headers)
    assert resp.status_code == 422, f"Expected 422, got {resp.status_code}: {resp.text}"


def test_update_product_replaces_image_and_reflects_storefront(admin_auth_token):
    headers = {"Authorization": f"Bearer {admin_auth_token}"}
    sku = "TEST-IMG-UPDATE"
    db = SessionLocal()
    db.query(Product).filter(Product.sku == sku).delete()
    db.commit()

    payload = {
        "sku": sku,
        "name": "Initial Jhumka",
        "category": "Earrings",
        "price": 35000,
        "status": "available",
        "images": ["/images/product_gold_chain.jpg", "/images/product_anklet.jpg"]
    }
    resp = client.post("/api/admin/products", json=payload, headers=headers)
    assert resp.status_code == 201

    update_payload = {
        "name": "Updated Royal Jhumka",
        "price": 38000,
        "images": ["/images/product_gold_chain.jpg", "/images/product_silver_bowl.jpg"]
    }
    up_resp = client.put(f"/api/admin/products/{sku}", json=update_payload, headers=headers)
    assert up_resp.status_code == 200
    up_data = up_resp.json()
    assert up_data["name"] == "Updated Royal Jhumka"
    assert up_data["numericPrice"] == 38000
    assert len(up_data["images"]) == 2
    assert up_data["images"][0] == "/images/product_gold_chain.jpg"
    assert up_data["images"][1] == "/images/product_silver_bowl.jpg"

    storefront_resp = client.get(f"/api/products/{sku}")
    assert storefront_resp.status_code == 200
    storefront_data = storefront_resp.json()
    assert storefront_data["name"] == "Updated Royal Jhumka"
    assert storefront_data["numericPrice"] == 38000
    assert len(storefront_data["images"]) == 2
    assert storefront_data["images"][1] == "/images/product_silver_bowl.jpg"

    del_resp = client.delete(f"/api/admin/products/{sku}?hard=true", headers=headers)
    assert del_resp.status_code == 200

    check_del = client.get(f"/api/products/{sku}")
    assert check_del.status_code == 404

    db.close()
