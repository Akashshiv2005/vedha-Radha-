import uuid
from typing import Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from ..db.session import get_db
from ..models.admin_user import AdminUser
from ..models.customer import Customer
from ..core.security import decode_access_token
from ..services.auth_service import token_blacklist

bearer_scheme = HTTPBearer(auto_error=False)


async def get_token_from_request(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> Optional[str]:
    """Extract bearer token from authorization header."""
    if credentials and credentials.scheme.lower() == "bearer":
        return credentials.credentials
    return None


async def get_current_admin(
    token: Optional[str] = Depends(get_token_from_request),
    db: Session = Depends(get_db),
) -> AdminUser:
    """Dependency that validates JWT and returns the current active AdminUser."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "error": "Unauthorized: Bearer token missing"},
        )

    # Check token blacklist (revoked upon logout)
    if token_blacklist.is_revoked(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "error": "Session has been terminated. Please sign in again."},
        )

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "error": "Invalid or expired session token."},
        )

    # Prevent customer token from being accepted on admin routes
    if payload.get("role") == "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"success": False, "error": "Forbidden: Customer accounts do not have staff administrator privileges."},
        )

    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "error": "Malformed token claims."},
        )

    try:
        user_uuid = uuid.UUID(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "error": "Invalid token subject."},
        )

    user = db.query(AdminUser).filter(AdminUser.id == user_uuid).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "error": "User does not exist or has been disabled."},
        )

    return user


async def get_current_customer(
    token: Optional[str] = Depends(get_token_from_request),
    db: Session = Depends(get_db),
) -> Customer:
    """Dependency that validates customer JWT and returns active Customer."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "error": "Authentication required. Please log in to your Vedha Radha account."},
        )

    if token_blacklist.is_revoked(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "error": "Session expired or logged out. Please log in again."},
        )

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "error": "Invalid or expired login session."},
        )

    # Strictly enforce that this token is a customer token
    if payload.get("role") != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"success": False, "error": "Access denied: Valid customer credentials required."},
        )

    customer_id_str = payload.get("sub")
    if not customer_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "error": "Malformed session token."},
        )

    try:
        customer_uuid = uuid.UUID(customer_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "error": "Invalid customer identifier."},
        )

    customer = db.query(Customer).filter(Customer.id == customer_uuid).first()
    if not customer or not customer.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "error": "Customer account not found or has been deactivated."},
        )

    return customer


async def get_optional_customer(
    token: Optional[str] = Depends(get_token_from_request),
    db: Session = Depends(get_db),
) -> Optional[Customer]:
    """Optional customer dependency for public routes that adapt when customer is logged in."""
    if not token or token_blacklist.is_revoked(token):
        return None

    payload = decode_access_token(token)
    if not payload or payload.get("role") != "customer":
        return None

    customer_id_str = payload.get("sub")
    if not customer_id_str:
        return None

    try:
        customer_uuid = uuid.UUID(customer_id_str)
        return db.query(Customer).filter(Customer.id == customer_uuid, Customer.is_active == True).first()
    except Exception:
        return None
