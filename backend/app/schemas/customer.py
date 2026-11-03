import re
import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class CustomerRegisterRequest(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=100, description="Full name of customer")
    mobile_number: str = Field(..., description="10-digit primary mobile number")
    alternative_mobile_number: Optional[str] = Field(None, description="Optional 10-digit alternative contact")
    full_address: str = Field(..., min_length=5, max_length=500, description="Postal delivery address")
    pin_code: str = Field(..., description="6-digit Indian PIN code")
    password: str = Field(..., min_length=8, max_length=128, description="Account password (min 8 characters)")
    re_enter_password: str = Field(..., min_length=8, max_length=128, description="Password confirmation")

    @field_validator("customer_name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Customer name cannot be empty or only spaces.")
        if len(trimmed) < 2:
            raise ValueError("Customer name must be at least 2 characters.")
        return trimmed

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile(cls, v: str) -> str:
        cleaned = re.sub(r"\D", "", v.strip())
        if len(cleaned) == 12 and cleaned.startswith("91"):
            cleaned = cleaned[2:]
        if not re.match(r"^[6-9]\d{9}$", cleaned):
            raise ValueError("Mobile number must be a valid 10-digit Indian mobile number starting with 6-9.")
        return cleaned

    @field_validator("alternative_mobile_number")
    @classmethod
    def validate_alt_mobile(cls, v: Optional[str]) -> Optional[str]:
        if not v or not v.strip():
            return None
        cleaned = re.sub(r"\D", "", v.strip())
        if len(cleaned) == 12 and cleaned.startswith("91"):
            cleaned = cleaned[2:]
        if not re.match(r"^[6-9]\d{9}$", cleaned):
            raise ValueError("Alternative mobile number must be a valid 10-digit Indian mobile number.")
        return cleaned

    @field_validator("pin_code")
    @classmethod
    def validate_pin(cls, v: str) -> str:
        cleaned = re.sub(r"\D", "", v.strip())
        if not re.match(r"^[1-9]\d{5}$", cleaned):
            raise ValueError("PIN Code must be a valid 6-digit postal code.")
        return cleaned

    @field_validator("full_address")
    @classmethod
    def validate_address(cls, v: str) -> str:
        trimmed = v.strip()
        if len(trimmed) < 5:
            raise ValueError("Full address must contain at least 5 characters.")
        return trimmed

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if not re.search(r"[A-Za-z]", v):
            raise ValueError("Password must contain at least one alphabetical letter.")
        if not re.search(r"[\d\W_]", v):
            raise ValueError("Password must contain at least one numeric digit or special symbol.")
        return v

    @model_validator(mode="after")
    def check_passwords_and_mobiles(self):
        if self.password != self.re_enter_password:
            raise ValueError("Passwords do not match. Please re-enter identical passwords.")
        if (
            self.alternative_mobile_number
            and self.alternative_mobile_number == self.mobile_number
        ):
            raise ValueError("Alternative mobile number cannot be identical to primary mobile number.")
        return self


class CustomerLoginRequest(BaseModel):
    mobile_number: str = Field(..., description="10-digit registered mobile number")
    password: str = Field(..., min_length=1, description="Account password")

    @field_validator("mobile_number")
    @classmethod
    def validate_login_mobile(cls, v: str) -> str:
        cleaned = re.sub(r"\D", "", v.strip())
        if len(cleaned) == 12 and cleaned.startswith("91"):
            cleaned = cleaned[2:]
        if len(cleaned) != 10:
            raise ValueError("Mobile number must contain exactly 10 digits.")
        return cleaned


class CustomerPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    customer_name: str
    mobile_number: str
    alternative_mobile_number: Optional[str] = None
    full_address: str
    pin_code: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    last_login_at: Optional[datetime] = None


class CustomerLoginResponse(BaseModel):
    success: bool = True
    access_token: str
    token_type: str = "bearer"
    customer: CustomerPublic


class CustomerProfileUpdate(BaseModel):
    customer_name: Optional[str] = None
    alternative_mobile_number: Optional[str] = None
    full_address: Optional[str] = None
    pin_code: Optional[str] = None

    @field_validator("customer_name")
    @classmethod
    def check_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            trimmed = v.strip()
            if len(trimmed) < 2:
                raise ValueError("Customer name must be at least 2 characters.")
            return trimmed
        return None

    @field_validator("alternative_mobile_number")
    @classmethod
    def check_alt_mobile(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v.strip():
            cleaned = re.sub(r"\D", "", v.strip())
            if len(cleaned) == 12 and cleaned.startswith("91"):
                cleaned = cleaned[2:]
            if not re.match(r"^[6-9]\d{9}$", cleaned):
                raise ValueError("Alternative mobile must be a valid 10-digit number.")
            return cleaned
        return None

    @field_validator("pin_code")
    @classmethod
    def check_pin(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            cleaned = re.sub(r"\D", "", v.strip())
            if not re.match(r"^[1-9]\d{5}$", cleaned):
                raise ValueError("PIN Code must be a valid 6-digit postal code.")
            return cleaned
        return None

    @field_validator("full_address")
    @classmethod
    def check_address(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            trimmed = v.strip()
            if len(trimmed) < 5:
                raise ValueError("Full address must contain at least 5 characters.")
            return trimmed
        return None


class CustomerChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8)
    confirm_new_password: str = Field(..., min_length=8)

    @field_validator("new_password")
    @classmethod
    def validate_new_pw(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("New password must be at least 8 characters long.")
        if not re.search(r"[A-Za-z]", v):
            raise ValueError("New password must contain at least one letter.")
        if not re.search(r"[\d\W_]", v):
            raise ValueError("New password must contain at least one number or symbol.")
        return v

    @model_validator(mode="after")
    def check_match(self):
        if self.new_password != self.confirm_new_password:
            raise ValueError("New passwords do not match.")
        if self.current_password == self.new_password:
            raise ValueError("New password must be different from your current password.")
        return self


class ForgotPasswordRequest(BaseModel):
    mobile_number: str

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile(cls, v: str) -> str:
        cleaned = re.sub(r"\D", "", v.strip())
        if len(cleaned) == 12 and cleaned.startswith("91"):
            cleaned = cleaned[2:]
        if len(cleaned) != 10:
            raise ValueError("Please provide a valid 10-digit mobile number.")
        return cleaned


class VerifyOTPRequest(BaseModel):
    mobile_number: str
    otp: str

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile(cls, v: str) -> str:
        cleaned = re.sub(r"\D", "", v.strip())
        if len(cleaned) == 12 and cleaned.startswith("91"):
            cleaned = cleaned[2:]
        if len(cleaned) != 10:
            raise ValueError("Invalid mobile number format.")
        return cleaned

    @field_validator("otp")
    @classmethod
    def validate_otp(cls, v: str) -> str:
        cleaned = re.sub(r"\D", "", v.strip())
        if len(cleaned) != 6:
            raise ValueError("OTP must be exactly 6 digits.")
        return cleaned


class ResetPasswordRequest(BaseModel):
    mobile_number: str
    reset_token: str
    new_password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)

    @field_validator("new_password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if not re.search(r"[A-Za-z]", v):
            raise ValueError("Password must contain at least one letter.")
        if not re.search(r"[\d\W_]", v):
            raise ValueError("Password must contain at least one digit or symbol.")
        return v

    @model_validator(mode="after")
    def check_match(self):
        if self.new_password != self.confirm_password:
            raise ValueError("Passwords do not match.")
        return self

