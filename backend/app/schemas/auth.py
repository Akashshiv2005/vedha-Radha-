from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from .admin_user import AdminUserPublic


class LoginRequest(BaseModel):
    """Credentials submitted by the frontend login form."""
    username: str = Field(..., description="Staff username or email address")
    password: str = Field(..., description="Staff account password")


class LoginSuccessResponse(BaseModel):
    """Response returned upon successful authentication."""
    success: bool = True
    token: str
    access_token: str
    token_type: str = "bearer"
    user: AdminUserPublic


class LoginErrorResponse(BaseModel):
    """Error response matching frontend error contract."""
    success: bool = False
    error: str


class AuthProfileResponse(BaseModel):
    """Response returned by GET /api/auth/me."""
    success: bool = True
    user: AdminUserPublic


class LogoutResponse(BaseModel):
    """Response returned by POST /api/auth/logout."""
    success: bool = True


class HealthResponse(BaseModel):
    """Response returned by GET /api/health."""
    status: str
    database: str
    storage: Optional[str] = "connected"
    timestamp: datetime
