import io
import uuid
import pytest
from unittest.mock import patch
from PIL import Image
from app.services.minio_service import minio_service
from app.core.config import settings


minio_online = minio_service.check_connection().get("connected", False)
requires_minio = pytest.mark.skipif(
    not minio_online,
    reason="MinIO storage service is offline on 127.0.0.1:9000"
)

def create_test_image(format: str = "JPEG", size: tuple = (100, 100), color: str = "gold") -> bytes:
    """Helper to generate in-memory valid image bytes."""
    img = Image.new("RGB", size, color=color)
    buf = io.BytesIO()
    img.save(buf, format=format)
    buf.seek(0)
    return buf.read()


def test_upload_unauthorized(client):
    """Reject unauthenticated image upload requests with 401 Unauthorized."""
    data = create_test_image("JPEG")
    files = {"file": ("test_anklet.jpg", io.BytesIO(data), "image/jpeg")}
    res = client.post("/api/admin/products/upload-image", files=files)
    assert res.status_code == 401


@requires_minio
def test_upload_image_success(client, auth_headers):
    """Successfully upload valid JPEG image and receive persistent object key and presigned URL."""
    jpeg_data = create_test_image("JPEG", color="gold")
    files = {"file": ("temple_necklace.jpg", io.BytesIO(jpeg_data), "image/jpeg")}

    res = client.post("/api/admin/products/upload-image", files=files, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["object_key"].startswith("products/")
    assert data["object_key"].endswith(".jpg")
    assert "127.0.0.1:9000" in data["image_url"] or settings.MINIO_ENDPOINT in data["image_url"]
    assert "X-Amz-Signature" in data["image_url"] or "X-Amz-Algorithm" in data["image_url"]
    assert data["content_type"] == "image/jpeg"
    assert data["size"] == len(jpeg_data)


@requires_minio
def test_upload_png_image_success(client, auth_headers):
    """Successfully upload valid PNG image and receive persistent object key with .png."""
    png_data = create_test_image("PNG", color="silver")
    files = {"file": ("silver_coin.png", io.BytesIO(png_data), "image/png")}

    res = client.post("/api/admin/products/upload-image", files=files, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["object_key"].endswith(".png")
    assert data["content_type"] == "image/png"


def test_upload_invalid_extension(client, auth_headers):
    """Reject unsupported file extensions (e.g. .pdf, .txt, .exe) with 400."""
    files = {"file": ("document.pdf", io.BytesIO(b"%PDF-1.4..."), "application/pdf")}
    res = client.post("/api/admin/products/upload-image", files=files, headers=auth_headers)
    assert res.status_code == 400
    assert "Unsupported file extension" in res.text


def test_upload_spoofed_file_content(client, auth_headers):
    """Reject fake image containing text/binary payload disguised as a .jpg."""
    fake_data = b"This is not a real image header, it is plain text."
    files = {"file": ("malicious.jpg", io.BytesIO(fake_data), "image/jpeg")}
    res = client.post("/api/admin/products/upload-image", files=files, headers=auth_headers)
    assert res.status_code == 400
    assert "corrupted or not a valid image" in res.text


def test_upload_oversized_file(client, auth_headers):
    """Reject image exceeding maximum configured upload size (5 MB) with 413."""
    oversized = b"0" * (5 * 1024 * 1024 + 1024)  # 5 MB + 1 KB
    files = {"file": ("huge_photo.jpg", io.BytesIO(oversized), "image/jpeg")}
    res = client.post("/api/admin/products/upload-image", files=files, headers=auth_headers)
    assert res.status_code == 413
    assert "exceeds maximum allowed limit" in res.text


@requires_minio
def test_product_creation_with_minio_image(client, auth_headers):
    """Create product storing MinIO object key, verifying ProductPublic returns presigned URL."""
    # 1. Upload image to MinIO
    img_data = create_test_image("JPEG", color="maroon")
    files = {"file": ("royal_choker.jpg", io.BytesIO(img_data), "image/jpeg")}
    up_res = client.post("/api/admin/products/upload-image", files=files, headers=auth_headers)
    assert up_res.status_code == 200
    object_key = up_res.json()["object_key"]

    # 2. Create product with the object key
    sku = f"MINIO-{uuid.uuid4().hex[:6].upper()}"
    prod_payload = {
        "sku": sku,
        "name": "MinIO Royal Temple Choker",
        "category": "Temple Jewellery",
        "price": 185000,
        "image": object_key,
        "status": "available",
        "isUnique": True,
        "stockQty": 1,
    }
    create_res = client.post("/api/admin/products", json=prod_payload, headers=auth_headers)
    assert create_res.status_code == 201
    created_prod = create_res.json()

    # image_url in DB is stable object key
    assert created_prod["image_url"] == object_key
    # image computed field returns usable presigned URL
    assert "127.0.0.1:9000" in created_prod["image"] or settings.MINIO_ENDPOINT in created_prod["image"]
    assert "X-Amz-" in created_prod["image"]

    # 3. Retrieve product by SKU
    get_res = client.get(f"/api/admin/products/{sku}", headers=auth_headers)
    assert get_res.status_code == 200
    retrieved = get_res.json()
    assert retrieved["image_url"] == object_key
    assert "X-Amz-" in retrieved["image"]


@requires_minio
def test_image_replacement_cleans_up_old_unreferenced_object(client, auth_headers):
    """When a product image is replaced, the unreferenced old MinIO object is safely cleaned up."""
    # 1. Upload first image and create product
    img1 = create_test_image("JPEG", color="blue")
    res1 = client.post("/api/admin/products/upload-image", files={"file": ("old.jpg", io.BytesIO(img1), "image/jpeg")}, headers=auth_headers)
    old_key = res1.json()["object_key"]

    sku = f"REPL-{uuid.uuid4().hex[:6].upper()}"
    client.post("/api/admin/products", json={"sku": sku, "name": "Repl Item", "category": "Gold", "price": 50000, "image": old_key}, headers=auth_headers)

    # 2. Upload replacement image
    img2 = create_test_image("JPEG", color="green")
    res2 = client.post("/api/admin/products/upload-image", files={"file": ("new.jpg", io.BytesIO(img2), "image/jpeg")}, headers=auth_headers)
    new_key = res2.json()["object_key"]

    # 3. Update product with new image
    update_res = client.put(f"/api/admin/products/{sku}", json={"image": new_key}, headers=auth_headers)
    assert update_res.status_code == 200
    assert update_res.json()["image_url"] == new_key

    # 4. Verify old object was deleted from MinIO bucket
    minio_client = minio_service.get_client()
    with pytest.raises(Exception):
        minio_client.stat_object(settings.MINIO_BUCKET, old_key)


@requires_minio
def test_shared_image_is_preserved_when_one_product_updates(client, auth_headers):
    """If two products share an image, replacing it on one product must NOT delete the object."""
    # Upload shared image
    img = create_test_image("JPEG", color="purple")
    res = client.post("/api/admin/products/upload-image", files={"file": ("shared.jpg", io.BytesIO(img), "image/jpeg")}, headers=auth_headers)
    shared_key = res.json()["object_key"]

    sku1 = f"SH1-{uuid.uuid4().hex[:6].upper()}"
    sku2 = f"SH2-{uuid.uuid4().hex[:6].upper()}"

    client.post("/api/admin/products", json={"sku": sku1, "name": "Shared 1", "category": "Gold", "price": 40000, "image": shared_key}, headers=auth_headers)
    client.post("/api/admin/products", json={"sku": sku2, "name": "Shared 2", "category": "Gold", "price": 45000, "image": shared_key}, headers=auth_headers)

    # Update product 1 to a different image
    new_img = create_test_image("JPEG", color="red")
    res_new = client.post("/api/admin/products/upload-image", files={"file": ("new.jpg", io.BytesIO(new_img), "image/jpeg")}, headers=auth_headers)
    new_key = res_new.json()["object_key"]

    client.put(f"/api/admin/products/{sku1}", json={"image": new_key}, headers=auth_headers)

    # Verify shared_key still exists in MinIO because product 2 still references it
    minio_client = minio_service.get_client()
    stat = minio_client.stat_object(settings.MINIO_BUCKET, shared_key)
    assert stat.object_name == shared_key


def test_presigned_url_generation_preserves_static_and_external():
    """Verify presigned URL resolver preserves local assets and remote URLs without modification."""
    assert minio_service.get_presigned_url("/images/product_anklet.jpg") == "/images/product_anklet.jpg"
    assert minio_service.get_presigned_url("https://example.com/item.jpg") == "https://example.com/item.jpg"
    assert minio_service.get_presigned_url(None) == "/images/neutral_product_placeholder.svg"


def test_image_redirect_endpoint(client):
    """GET /api/admin/products/images/{object_key} redirects to presigned URL."""
    res = client.get("/api/admin/products/images/products/test-image.jpg", follow_redirects=False)
    assert res.status_code in (307, 302)
    assert "Location" in res.headers
    assert "products/test-image.jpg" in res.headers["Location"]


def test_health_check_reports_storage(client):
    """Health endpoint /api/health reports storage accurately."""
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"
    expected_storage = "connected" if minio_online else "disconnected"
    assert data["storage"] == expected_storage
