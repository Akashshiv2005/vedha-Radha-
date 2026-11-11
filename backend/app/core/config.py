from typing import List, Optional, Union
import json
from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

# Base backend directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    PROJECT_NAME: str = "Vedha Radha Thangamaaligai API"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # PostgreSQL Connection String
    # Default format: postgresql+psycopg://user:password@localhost:5432/vedharadha_db
    DATABASE_URL: str = "postgresql+psycopg://postgres:0000@localhost:5432/vedharadha_db"

    # JWT Settings
    JWT_SECRET_KEY: str = "vr_super_secret_jwt_key_change_in_production_2026_xyz"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Frontend URL (Storefront & Admin Portal) - configured from FRONTEND_URL in .env
    FRONTEND_URL: Optional[str] = None

    # CORS Allowed Origins - configured from CORS_ORIGINS in .env
    CORS_ORIGINS: Union[List[str], str] = []

    # Optional CORS Origin Regex - configured from CORS_ORIGIN_REGEX in .env
    CORS_ORIGIN_REGEX: Optional[str] = None

    # Admin Bootstrap Defaults
    ADMIN_BOOTSTRAP_USERNAME: str = "admin"
    ADMIN_BOOTSTRAP_EMAIL: str = "admin@vedaradha.com"
    ADMIN_BOOTSTRAP_PASSWORD: str = "admin@123"
    ADMIN_BOOTSTRAP_FULL_NAME: str = "Administrator"

    # Customer Authentication & Session Settings
    CUSTOMER_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days persistent customer session
    SMS_PROVIDER: Optional[str] = None  # e.g., 'fast2sms', 'twilio', or None (unconfigured)
    FAST2SMS_API_KEY: Optional[str] = None
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_FROM_NUMBER: Optional[str] = None
    OTP_EXPIRE_MINUTES: int = 10
    OTP_MAX_ATTEMPTS: int = 3
    OTP_RESEND_COOLDOWN_SECONDS: int = 60

    # Rate Limiting
    RATE_LIMIT_LOGIN_MAX_ATTEMPTS: int = 5
    RATE_LIMIT_LOGIN_WINDOW_SECONDS: int = 60

    # Payment & Checkout Settings
    ENABLE_COD: bool = True
    ENABLE_PAY_AT_SHOWROOM: bool = True
    RAZORPAY_KEY_ID: Optional[str] = None
    RAZORPAY_KEY_SECRET: Optional[str] = None
    ORDER_TOKEN_SECRET: str = "vr_order_access_token_secret_key_2026"

    # The Jewellers Association Source URL & Cache TTL (300 seconds = 5 minutes)
    JEWELLERS_ASSOCIATION_URL: str = "https://thejewellersassociation.org/"
    PRICE_CACHE_TTL_SECONDS: int = 300
    OROPOCKET_PRICE_URL: str = "https://api.oropocket.com/public/prices"

    # MinIO Object Storage Configuration
    MINIO_ENDPOINT: str = "127.0.0.1:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET: str = "vedharadha-products"
    MINIO_SECURE: bool = False
    MINIO_REGION: Optional[str] = None
    MINIO_AUTO_CREATE_BUCKET: bool = True
    MINIO_PRESIGNED_EXPIRY_SECONDS: int = 86400  # 24 hours
    MAX_IMAGE_UPLOAD_BYTES: int = 5 * 1024 * 1024  # 5 MB

    # Payment Gateway & Checkout Configuration
    RAZORPAY_KEY_ID: Optional[str] = None
    RAZORPAY_KEY_SECRET: Optional[str] = None
    RAZORPAY_WEBHOOK_SECRET: Optional[str] = None
    RAZORPAY_CURRENCY: str = "INR"
    FREE_DELIVERY_THRESHOLD: float = 5000.0
    STANDARD_DELIVERY_CHARGE: float = 250.0
    JEWELLERY_GST_PERCENT: float = 3.0

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str], None]) -> List[str]:
        if not v:
            return []
        if isinstance(v, str):
            v_str = v.strip()
            if v_str.startswith("[") and v_str.endswith("]"):
                try:
                    return json.loads(v_str)
                except Exception:
                    pass
            return [i.strip() for i in v_str.split(",") if i.strip()]
        elif isinstance(v, list):
            return list(v)
        return []

    @model_validator(mode="after")
    def validate_production_security(self):
        if self.ENVIRONMENT.lower() in ("production", "prod"):
            if "change_in_production" in self.JWT_SECRET_KEY or self.JWT_SECRET_KEY == "vr_super_secret_jwt_key_change_in_production_2026_xyz":
                raise ValueError(
                    "CRITICAL SECURITY CONFIGURATION ERROR: "
                    "JWT_SECRET_KEY must be changed to a cryptographically strong, unique secret when running in production!"
                )
        return self

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
