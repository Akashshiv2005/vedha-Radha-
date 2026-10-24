from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, Request, Response, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from ...db.session import get_db
from ...schemas.auth import (
    LoginRequest,
    LoginSuccessResponse,
    LoginErrorResponse,
    AuthProfileResponse,
    LogoutResponse,
)
from ...schemas.admin_user import AdminUserPublic
from ...services.auth_service import authenticate_admin, token_blacklist
from ...core.security import create_access_token, decode_access_token
from ..deps import get_current_admin, get_token_from_request
from ...models.admin_user import AdminUser

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/login",
    response_model=LoginSuccessResponse,
    responses={
        400: {"model": LoginErrorResponse},
        401: {"model": LoginErrorResponse},
        403: {"model": LoginErrorResponse},
        429: {"model": LoginErrorResponse},
    },
)
async def login(
    payload: LoginRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Authenticate staff credentials and issue a JWT access token.
    Compatible with the existing React AdminLoginPage form contract.
    """
    # Extract client IP for brute-force rate limiting
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
    else:
        client_ip = request.client.host if request.client else "127.0.0.1"

    success, user, error_msg, status_code = authenticate_admin(
        db=db,
        identifier=payload.username,
        password=payload.password,
        client_ip=client_ip,
    )

    if not success or not user:
        return JSONResponse(
            status_code=status_code,
            content={"success": False, "error": error_msg or "Authentication failed"},
        )

    # Issue JWT token
    token = create_access_token(
        subject=str(user.id),
        claims={
            "username": user.username,
            "email": user.email,
            "role": "Super Administrator" if user.is_superuser else "Administrator",
        },
    )

    user_public = AdminUserPublic.model_validate(user)

    return {
        "success": True,
        "token": token,
        "access_token": token,
        "token_type": "bearer",
        "user": user_public,
    }


@router.get("/me", response_model=AuthProfileResponse)
async def get_current_user_profile(
    current_admin: AdminUser = Depends(get_current_admin),
):
    """
    Verify the active session token and return the authenticated admin profile.
    """
    user_public = AdminUserPublic.model_validate(current_admin)
    return {
        "success": True,
        "user": user_public,
    }


@router.post("/logout", response_model=LogoutResponse)
async def logout(
    token: Optional[str] = Depends(get_token_from_request),
):
    """
    Terminate active administrator session by revoking the JWT token.
    """
    if token:
        payload = decode_access_token(token)
        # Default expiration fallback: 24h
        exp = payload.get("exp") if payload else (datetime.now(timezone.utc).timestamp() + 86400)
        token_blacklist.revoke(token, float(exp))

    return {"success": True}
