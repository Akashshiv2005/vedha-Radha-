from app.core.config import settings
from app.core.rate_limiter import login_rate_limiter


def test_login_success_with_username(client):
    """Admin can log in using their username and password."""
    login_rate_limiter.reset("127.0.0.1:admin")
    response = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": settings.ADMIN_BOOTSTRAP_PASSWORD},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "token" in data
    assert "access_token" in data
    assert data["user"]["username"] == "admin"
    assert data["user"]["email"] == settings.ADMIN_BOOTSTRAP_EMAIL
    assert "password_hash" not in data["user"]


def test_login_success_with_email(client):
    """Admin can log in using their email alias."""
    login_rate_limiter.reset(f"127.0.0.1:{settings.ADMIN_BOOTSTRAP_EMAIL.lower()}")
    response = client.post(
        "/api/auth/login",
        json={
            "username": settings.ADMIN_BOOTSTRAP_EMAIL,
            "password": settings.ADMIN_BOOTSTRAP_PASSWORD,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["user"]["username"] == "admin"


def test_login_invalid_password(client):
    """Invalid password returns 401 with generic error message."""
    login_rate_limiter.reset("127.0.0.1:admin")
    response = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "WrongPassword123!"},
    )
    assert response.status_code == 401
    data = response.json()
    assert data["success"] is False
    assert "Unable to sign in" in data["error"]


def test_login_nonexistent_user(client):
    """Nonexistent user returns generic 401 without revealing account absence."""
    response = client.post(
        "/api/auth/login",
        json={"username": "nonexistent_staff_xyz", "password": "Password123!"},
    )
    assert response.status_code == 401
    data = response.json()
    assert data["success"] is False
    assert "Unable to sign in" in data["error"]


def test_get_current_admin_profile(client):
    """GET /api/auth/me returns the authenticated admin user profile."""
    # 1. Log in to get token
    login_rate_limiter.reset("127.0.0.1:admin")
    login_res = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": settings.ADMIN_BOOTSTRAP_PASSWORD},
    )
    token = login_res.json()["token"]

    # 2. Call /api/auth/me with Bearer token
    me_res = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200
    data = me_res.json()
    assert data["success"] is True
    assert data["user"]["username"] == "admin"
    assert "name" in data["user"]
    assert "role" in data["user"]


def test_logout_revokes_token(client):
    """POST /api/auth/logout invalidates the session token."""
    login_rate_limiter.reset("127.0.0.1:admin")
    login_res = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": settings.ADMIN_BOOTSTRAP_PASSWORD},
    )
    token = login_res.json()["token"]

    # Verify token works initially
    me_res_1 = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res_1.status_code == 200

    # Logout
    logout_res = client.post(
        "/api/auth/logout",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert logout_res.status_code == 200
    assert logout_res.json()["success"] is True

    # Subsequent call with revoked token should fail with 401
    me_res_2 = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res_2.status_code == 401


def test_rate_limiting_brute_force(client):
    """Rapid repeated invalid attempts trigger 429 Too Many Requests."""
    key = "brute_force_tester"
    login_rate_limiter.reset(f"127.0.0.1:{key}")

    # Fire max_attempts incorrect attempts
    for _ in range(settings.RATE_LIMIT_LOGIN_MAX_ATTEMPTS):
        res = client.post(
            "/api/auth/login",
            json={"username": key, "password": "BadPassword"},
        )
        assert res.status_code == 401

    # Next attempt should be blocked with 429
    blocked_res = client.post(
        "/api/auth/login",
        json={"username": key, "password": "BadPassword"},
    )
    assert blocked_res.status_code == 429
    assert blocked_res.json()["success"] is False
    assert "Too many failed login attempts" in blocked_res.json()["error"]
