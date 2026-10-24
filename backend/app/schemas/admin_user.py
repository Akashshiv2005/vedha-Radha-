from datetime import datetime
from typing import Optional
import uuid
from pydantic import BaseModel, ConfigDict, Field, computed_field


class AdminUserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., max_length=255)
    full_name: Optional[str] = Field(None, max_length=100)


class AdminUserCreate(AdminUserBase):
    password: str = Field(..., min_length=6)
    is_superuser: bool = False


class AdminUserPublic(BaseModel):
    """Public representation of an administrator account."""
    id: uuid.UUID
    username: str
    email: str
    full_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

    @computed_field
    def id_str(self) -> str:
        return str(self.id)

    @computed_field
    def name(self) -> str:
        """Friendly name for frontend display (matches AdminSidebar/AdminHeader)."""
        return self.full_name or self.username.capitalize()

    @computed_field
    def role(self) -> str:
        """Display role for frontend (matches AdminSidebar role badge)."""
        return "Super Administrator" if self.is_superuser else "Administrator"
