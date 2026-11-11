from datetime import datetime, timezone
from typing import Optional, Set, Tuple
import threading
from sqlalchemy import or_, func
from sqlalchemy.orm import Session
import logging

from ..models.admin_user import AdminUser
from ..core.security import verify_password, hash_password
from ..core.rate_limiter import login_rate_limiter
from ..core.config import settings

logger = logging.getLogger("auth_service")


class TokenBlacklist:
    """Thread-safe store of revoked JWT tokens."""

    def __init__(self):
        self._revoked: dict[str, float] = {}  # token -> expires_at_timestamp
        self._lock = threading.Lock()

    def revoke(self, token: str, expires_at: float):
        with self._lock:
            self._revoked[token] = expires_at
            self._cleanup()

    def is_revoked(self, token: str) -> bool:
        with self._lock:
            now = datetime.now(timezone.utc).timestamp()
            exp = self._revoked.get(token)
            if exp is None:
                return False
            if exp < now:
                del self._revoked[token]
                return False
            return True

    def _cleanup(self):
        now = datetime.now(timezone.utc).timestamp()
        expired_keys = [k for k, exp in self._revoked.items() if exp < now]
        for k in expired_keys:
            del self._revoked[k]


token_blacklist = TokenBlacklist()


def authenticate_admin(
    db: Session,
    identifier: str,
    password: str,
    client_ip: str = "127.0.0.1",
) -> Tuple[bool, Optional[AdminUser], Optional[str], int]:
    """
    Authenticate an administrator by username or email.
    
    Returns:
        (success: bool, user: Optional[AdminUser], error_message: Optional[str], status_code: int)
    """
    if not identifier or not password:
        return False, None, "Please enter both staff username/email and password.", 400

    clean_id = identifier.strip().lower()
    clean_pw = password.strip()
    rate_key = f"{client_ip}:{clean_id}"

    # 1. Rate Limiting Check
    if login_rate_limiter.is_rate_limited(rate_key):
        return (
            False,
            None,
            "Too many failed login attempts. Please wait 1 minute before trying again.",
            429,
        )

    # 2. Database Lookup
    user = (
        db.query(AdminUser)
        .filter(
            or_(
                func.lower(AdminUser.username) == clean_id,
                func.lower(AdminUser.email) == clean_id,
            )
        )
        .first()
    )

    # 3. Validation
    # Use generic message to prevent account enumeration
    GENERIC_AUTH_ERROR = "Unable to sign in. Check your details and try again."

    if not user:
        login_rate_limiter.record_attempt(rate_key)
        return False, None, GENERIC_AUTH_ERROR, 401

    if not user.is_active:
        login_rate_limiter.record_attempt(rate_key)
        return False, None, "Account is disabled. Contact system administrator.", 403

    if not verify_password(clean_pw, user.password_hash):
        login_rate_limiter.record_attempt(rate_key)
        return False, None, GENERIC_AUTH_ERROR, 401

    # 4. Success - reset rate limiter
    login_rate_limiter.reset(rate_key)
    return True, user, None, 200


def bootstrap_initial_admin(db: Session) -> Optional[AdminUser]:
    """
    Create the initial admin user safely if no matching account exists.
    Does NOT overwrite existing accounts.
    """
    username = settings.ADMIN_BOOTSTRAP_USERNAME.strip()
    email = settings.ADMIN_BOOTSTRAP_EMAIL.strip().lower()
    password = settings.ADMIN_BOOTSTRAP_PASSWORD.strip()

    if not username or not email or not password:
        logger.warning("Admin bootstrap skipped: incomplete credentials in settings")
        return None

    existing = (
        db.query(AdminUser)
        .filter(
            or_(
                func.lower(AdminUser.username) == username.lower(),
                func.lower(AdminUser.email) == email,
            )
        )
        .first()
    )

    if existing:
        logger.info("Admin user '%s' already exists in database.", username)
        return existing

    hashed = hash_password(password)
    admin = AdminUser(
        username=username,
        email=email,
        password_hash=hashed,
        full_name=settings.ADMIN_BOOTSTRAP_FULL_NAME,
        is_active=True,
        is_superuser=True,
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    logger.info("Initial admin user '%s' bootstrapped successfully.", username)
    return admin
