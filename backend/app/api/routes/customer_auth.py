import logging
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ...core.config import settings
from ...core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)
from ...core.rate_limiter import InMemoryRateLimiter
from ...db.session import get_db
from ...models.customer import Customer, CustomerOTP
from ...models.order import Order
from ...schemas.customer import (
    CustomerRegisterRequest,
    CustomerLoginRequest,
    CustomerPublic,
    CustomerLoginResponse,
    CustomerProfileUpdate,
    CustomerChangePasswordRequest,
    ForgotPasswordRequest,
    VerifyOTPRequest,
    ResetPasswordRequest,
)
from ...schemas.order import OrderPublic
from ...services.auth_service import token_blacklist
from ...services.sms_service import sms_service
from ..deps import get_current_customer, get_token_from_request

logger = logging.getLogger("vedharadha_api.customer_auth")

router = APIRouter(prefix="/customer", tags=["Customer Authentication & Profile"])

customer_login_limiter = InMemoryRateLimiter(
    max_attempts=settings.RATE_LIMIT_LOGIN_MAX_ATTEMPTS,
    window_seconds=settings.RATE_LIMIT_LOGIN_WINDOW_SECONDS,
)

otp_request_limiter = InMemoryRateLimiter(
    max_attempts=3,
    window_seconds=180,
)


@router.post("/auth/register", status_code=status.HTTP_201_CREATED)
async def register_customer(
    payload: CustomerRegisterRequest,
    db: Session = Depends(get_db),
):
    """
    Register a new customer for Vedha Radha Privilege Club.
    Validates input fields, verifies uniqueness of mobile number, and creates an authenticated session.
    """
    # 1. Check for duplicate mobile number
    existing = db.query(Customer).filter(Customer.mobile_number == payload.mobile_number).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "success": False,
                "error": f"An account with mobile number {payload.mobile_number} is already registered. Please sign in.",
            },
        )

    # 2. Hash password securely
    hashed_pw = hash_password(payload.password)

    # 3. Create customer record
    new_customer = Customer(
        customer_name=payload.customer_name,
        mobile_number=payload.mobile_number,
        alternative_mobile_number=payload.alternative_mobile_number,
        full_address=payload.full_address,
        pin_code=payload.pin_code,
        password_hash=hashed_pw,
        is_active=True,
        is_verified=True,
        last_login_at=datetime.now(timezone.utc),
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    # 4. Generate persistent customer access token (7 days)
    token = create_access_token(
        subject=str(new_customer.id),
        claims={
            "role": "customer",
            "name": new_customer.customer_name,
            "mobile": new_customer.mobile_number,
        },
        expires_delta=timedelta(minutes=settings.CUSTOMER_ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    logger.info("New customer registered: %s (%s)", new_customer.customer_name, new_customer.mobile_number)

    return {
        "success": True,
        "message": f"Welcome to Vedha Radha Privilege Club, {new_customer.customer_name}!",
        "access_token": token,
        "token_type": "bearer",
        "customer": CustomerPublic.model_validate(new_customer),
    }


@router.post("/auth/login", response_model=CustomerLoginResponse)
async def login_customer(
    payload: CustomerLoginRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Authenticate customer using 10-digit mobile number and password.
    Enforces brute-force rate limiting and returns a signed JWT session.
    """
    client_ip = request.client.host if request.client else "unknown"
    rate_limit_key = f"customer_login:{client_ip}:{payload.mobile_number}"

    if customer_login_limiter.is_rate_limited(rate_limit_key):
        logger.warning("Customer login rate limit exceeded for %s from IP %s", payload.mobile_number, client_ip)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "success": False,
                "error": "Too many consecutive failed login attempts. Please wait 60 seconds before trying again.",
            },
        )

    customer = db.query(Customer).filter(Customer.mobile_number == payload.mobile_number).first()

    if not customer or not customer.is_active or not verify_password(payload.password, customer.password_hash):
        customer_login_limiter.record_attempt(rate_limit_key)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success": False,
                "error": "Invalid mobile number or password. Please verify and try again.",
            },
        )

    # Reset failed attempts upon successful login
    customer_login_limiter.reset(rate_limit_key)

    # Update last login timestamp
    customer.last_login_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(customer)

    token = create_access_token(
        subject=str(customer.id),
        claims={
            "role": "customer",
            "name": customer.customer_name,
            "mobile": customer.mobile_number,
        },
        expires_delta=timedelta(minutes=settings.CUSTOMER_ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    logger.info("Customer logged in: %s (%s)", customer.customer_name, customer.mobile_number)

    return CustomerLoginResponse(
        success=True,
        access_token=token,
        token_type="bearer",
        customer=CustomerPublic.model_validate(customer),
    )


@router.post("/auth/logout")
async def logout_customer(
    token: Optional[str] = Depends(get_token_from_request),
    current_customer: Customer = Depends(get_current_customer),
):
    """Terminate the active customer session and blacklist the token."""
    if token:
        token_blacklist.revoke(token)
    logger.info("Customer logged out: %s (%s)", current_customer.customer_name, current_customer.mobile_number)
    return {"success": True, "message": "You have been logged out of your account successfully."}


@router.get("/auth/me")
async def get_current_customer_profile(
    current_customer: Customer = Depends(get_current_customer),
):
    """Retrieve the authenticated customer's profile."""
    return {
        "success": True,
        "customer": CustomerPublic.model_validate(current_customer),
    }


@router.put("/profile")
async def update_customer_profile(
    payload: CustomerProfileUpdate,
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer),
):
    """
    Update customer profile information with server-side validation.
    Mobile number remains protected and cannot be arbitrarily overwritten.
    """
    if payload.customer_name is not None:
        current_customer.customer_name = payload.customer_name

    if payload.alternative_mobile_number is not None:
        if payload.alternative_mobile_number == current_customer.mobile_number:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"success": False, "error": "Alternative mobile cannot be the same as primary mobile number."},
            )
        current_customer.alternative_mobile_number = payload.alternative_mobile_number or None

    if payload.full_address is not None:
        current_customer.full_address = payload.full_address

    if payload.pin_code is not None:
        current_customer.pin_code = payload.pin_code

    current_customer.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(current_customer)

    logger.info("Customer profile updated: %s (%s)", current_customer.customer_name, current_customer.mobile_number)

    return {
        "success": True,
        "message": "Your profile information has been updated successfully.",
        "customer": CustomerPublic.model_validate(current_customer),
    }


@router.post("/auth/change-password")
async def change_customer_password(
    payload: CustomerChangePasswordRequest,
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer),
):
    """Change customer account password verifying existing credentials."""
    if not verify_password(payload.current_password, current_customer.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "error": "Your current password is incorrect."},
        )

    current_customer.password_hash = hash_password(payload.new_password)
    current_customer.updated_at = datetime.now(timezone.utc)
    db.commit()

    logger.info("Customer changed password: %s", current_customer.mobile_number)

    return {
        "success": True,
        "message": "Your password has been changed successfully.",
    }


@router.post("/auth/forgot-password")
async def forgot_password_request_otp(
    payload: ForgotPasswordRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Initiate password recovery for customer.
    Checks SMS gateway configuration; if unconfigured, cleanly returns 503 Service Unavailable.
    Generates a cryptographically secure 6-digit OTP and delivers via SMS.
    """
    client_ip = request.client.host if request.client else "unknown"
    rate_key = f"otp_req:{payload.mobile_number}:{client_ip}"

    # Verify SMS Gateway provider configuration
    is_configured, config_msg = sms_service.is_configured()
    if not is_configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "success": False,
                "error": config_msg,
            },
        )

    if otp_request_limiter.is_rate_limited(rate_key):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "success": False,
                "error": "Please wait a moment before requesting another verification code.",
            },
        )
    otp_request_limiter.record_attempt(rate_key)

    customer = db.query(Customer).filter(
        Customer.mobile_number == payload.mobile_number,
        Customer.is_active == True,
    ).first()

    if customer:
        # Invalidate any existing unused OTPs for this mobile number
        db.query(CustomerOTP).filter(
            CustomerOTP.mobile_number == payload.mobile_number,
            CustomerOTP.is_used == False,
        ).update({"is_used": True})

        # Generate secure 6-digit OTP
        code = str(secrets.randbelow(900000) + 100000)
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)

        otp_record = CustomerOTP(
            mobile_number=payload.mobile_number,
            otp_code=code,
            purpose="FORGOT_PASSWORD",
            is_used=False,
            attempts=0,
            expires_at=expires_at,
        )
        db.add(otp_record)
        db.commit()

        # Dispatch via SMS gateway
        sms_ok, sms_res = sms_service.send_otp_sms(payload.mobile_number, code)
        if not sms_ok:
            logger.error("SMS Gateway error dispatching OTP to %s: %s", payload.mobile_number, sms_res)

    # Return standard response without leaking whether an arbitrary phone number exists
    return {
        "success": True,
        "message": "If this mobile number is registered with Vedha Radha, a 6-digit verification code has been dispatched via SMS.",
    }


@router.post("/auth/verify-otp")
async def verify_password_reset_otp(
    payload: VerifyOTPRequest,
    db: Session = Depends(get_db),
):
    """
    Verify customer OTP for password recovery.
    Upon successful validation, issues a short-lived reset authorization token.
    """
    now = datetime.now(timezone.utc)

    # Find the latest unused OTP
    otp_record = (
        db.query(CustomerOTP)
        .filter(
            CustomerOTP.mobile_number == payload.mobile_number,
            CustomerOTP.purpose == "FORGOT_PASSWORD",
            CustomerOTP.is_used == False,
        )
        .order_by(desc(CustomerOTP.created_at))
        .first()
    )

    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "error": "No active verification code found. Please request a new OTP."},
        )

    if otp_record.expires_at < now:
        otp_record.is_used = True
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "error": "The verification code has expired. Please request a fresh OTP."},
        )

    otp_record.attempts += 1

    if otp_record.attempts > settings.OTP_MAX_ATTEMPTS:
        otp_record.is_used = True
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={"success": False, "error": "Maximum verification attempts exceeded. Please request a new OTP."},
        )

    if otp_record.otp_code != payload.otp:
        remaining = settings.OTP_MAX_ATTEMPTS - otp_record.attempts
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error": f"Invalid verification code. {remaining} attempt(s) remaining.",
            },
        )

    # OTP is valid: mark as used
    otp_record.is_used = True
    db.commit()

    # Issue a signed, short-lived 15-minute password reset token
    reset_token = create_access_token(
        subject=payload.mobile_number,
        claims={"role": "customer", "purpose": "password_reset"},
        expires_delta=timedelta(minutes=15),
    )

    return {
        "success": True,
        "message": "OTP verified successfully. Please enter your new password.",
        "reset_token": reset_token,
    }


@router.post("/auth/reset-password")
async def reset_password_with_token(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    """Reset customer password using authorized reset token."""
    decoded = decode_access_token(payload.reset_token)
    if (
        not decoded
        or decoded.get("purpose") != "password_reset"
        or decoded.get("sub") != payload.mobile_number
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "error": "Reset session is invalid or has expired. Please start over."},
        )

    customer = db.query(Customer).filter(
        Customer.mobile_number == payload.mobile_number,
        Customer.is_active == True,
    ).first()

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"success": False, "error": "Customer account not found."},
        )

    # Invalidate token to prevent reuse
    token_blacklist.revoke(payload.reset_token)

    customer.password_hash = hash_password(payload.new_password)
    customer.updated_at = datetime.now(timezone.utc)
    db.commit()

    logger.info("Customer password successfully reset for: %s", customer.mobile_number)

    return {
        "success": True,
        "message": "Your password has been reset successfully. Please sign in with your new password.",
    }


@router.get("/orders", response_model=List[OrderPublic])
async def get_customer_order_history(
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer),
):
    """
    Retrieve customer order history and active reservations
    matching the authenticated customer's registered mobile number.
    """
    orders = (
        db.query(Order)
        .filter((Order.customer_id == current_customer.id) | (Order.phone == current_customer.mobile_number))
        .order_by(desc(Order.created_at))
        .all()
    )
    return [OrderPublic.model_validate(o) for o in orders]

