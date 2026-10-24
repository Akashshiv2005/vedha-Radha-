import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.main import app
from app.db.session import SessionLocal
from app.services.auth_service import bootstrap_initial_admin
from app.services.product_service import seed_initial_products_if_empty


@pytest.fixture(scope="session", autouse=True)
def ensure_test_admin():
    """Ensure that the default admin and seed products exist for tests."""
    db = SessionLocal()
    try:
        bootstrap_initial_admin(db)
        seed_initial_products_if_empty(db)
    finally:
        db.close()


@pytest.fixture
def client():
    """Synchronous test client for the FastAPI application."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(autouse=True)
def clean_test_artifacts():
    """Ensure rate limiter is clear before each test, and clean up test records & MinIO objects after."""
    from app.core.rate_limiter import login_rate_limiter

    with login_rate_limiter._lock:
        login_rate_limiter._attempts.clear()

    yield

    # Teardown: delete test products created during test from DB and MinIO
    from app.models.product import Product
    from app.services.minio_service import minio_service
    from app.core.config import settings
    from sqlalchemy import or_

    test_prefixes = (
        "SH1-",
        "SH2-",
        "REPL-",
        "MINIO-",
        "TEST-",
        "UPD-",
        "ACT1-",
        "ACT2-",
        "XLSX-",
        "DEL-",
        "LIVE-",
        "DRY-",
    )

    db = SessionLocal()
    try:
        filters = [Product.sku.startswith(p) for p in test_prefixes]
        test_prods = db.query(Product).filter(or_(*filters)).all()
        if test_prods:
            minio_keys = [
                p.image_url for p in test_prods
                if p.image_url and p.image_url.startswith("products/")
            ]
            ids_to_del = [p.id for p in test_prods]
            db.query(Product).filter(Product.id.in_(ids_to_del)).delete(synchronize_session=False)
            db.commit()

            if minio_keys:
                minio_client = minio_service.get_client()
                for key in minio_keys:
                    try:
                        minio_client.remove_object(settings.MINIO_BUCKET, key)
                    except Exception:
                        pass
    except Exception:
        db.rollback()
    finally:
        db.close()


@pytest.fixture
def auth_headers(client):
    """Obtain valid JWT Bearer authentication headers for test admin."""
    from app.core.config import settings
    from app.core.rate_limiter import login_rate_limiter
    from app.services.auth_service import token_blacklist

    with login_rate_limiter._lock:
        login_rate_limiter._attempts.clear()
    with token_blacklist._lock:
        token_blacklist._revoked.clear()

    res = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": settings.ADMIN_BOOTSTRAP_PASSWORD},
    )
    assert res.status_code == 200, f"Login failed: {res.text}"
    token = res.json()["token"]
    return {"Authorization": f"Bearer {token}"}


