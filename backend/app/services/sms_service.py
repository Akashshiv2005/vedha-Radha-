import logging
import urllib.request
import urllib.parse
import json
from typing import Tuple
from ..core.config import settings

logger = logging.getLogger("vedharadha_api.sms")


class SMSService:
    @staticmethod
    def is_configured() -> Tuple[bool, str]:
        """Check if an SMS gateway provider is actively configured."""
        provider = (settings.SMS_PROVIDER or "").strip().lower()

        if provider == "fast2sms":
            if settings.FAST2SMS_API_KEY:
                return True, "Fast2SMS provider configured"
            return False, "Fast2SMS is selected but FAST2SMS_API_KEY is not set in environment."

        if provider == "twilio":
            if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN and settings.TWILIO_FROM_NUMBER:
                return True, "Twilio provider configured"
            return False, "Twilio is selected but TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_FROM_NUMBER is missing."

        if provider == "mock_dev" and settings.ENVIRONMENT.lower() == "development":
            return True, "Development mock SMS provider configured"

        return False, (
            "SMS Gateway service is not configured on this server. "
            "Please configure SMS_PROVIDER ('fast2sms' or 'twilio') and appropriate API keys in backend .env, "
            "or contact Vedha Radha Showroom Support at +91 70108 94104."
        )

    @classmethod
    def send_otp_sms(cls, mobile_number: str, otp_code: str) -> Tuple[bool, str]:
        """
        Send a one-time passcode to customer's mobile number via configured SMS gateway.
        Returns (success: bool, message: str).
        """
        configured, msg = cls.is_configured()
        if not configured:
            logger.error("Attempted to send OTP to %s, but SMS gateway is unconfigured: %s", mobile_number, msg)
            return False, msg

        provider = (settings.SMS_PROVIDER or "").strip().lower()
        message_body = (
            f"Your Vedha Radha Privilege Club verification code is {otp_code}. "
            f"Valid for {settings.OTP_EXPIRE_MINUTES} minutes. Do not share this OTP with anyone."
        )

        try:
            if provider == "mock_dev":
                logger.info("[DEV SMS MOCK] OTP for %s: %s", mobile_number, otp_code)
                return True, "OTP dispatched via mock development gateway."

            if provider == "fast2sms":
                # Fast2SMS Quick SMS API
                url = "https://www.fast2sms.com/dev/bulkV2"
                payload = {
                    "authorization": settings.FAST2SMS_API_KEY,
                    "route": "otp",
                    "variables_values": otp_code,
                    "flash": "0",
                    "numbers": mobile_number,
                }
                data = urllib.parse.urlencode(payload).encode("utf-8")
                req = urllib.request.Request(url, data=data, method="POST")
                req.add_header("Content-Type", "application/x-www-form-urlencoded")
                req.add_header("Cache-Control", "no-cache")

                with urllib.request.urlopen(req, timeout=10) as resp:
                    resp_data = json.loads(resp.read().decode("utf-8"))
                    if resp_data.get("return") is True:
                        logger.info("Fast2SMS successfully sent OTP to %s", mobile_number)
                        return True, "OTP sent successfully to registered mobile number."
                    error_msg = resp_data.get("message", ["Fast2SMS delivery error"])[0]
                    return False, f"SMS Gateway error: {error_msg}"

            if provider == "twilio":
                # Twilio SMS API via HTTP request
                account_sid = settings.TWILIO_ACCOUNT_SID
                auth_token = settings.TWILIO_AUTH_TOKEN
                from_num = settings.TWILIO_FROM_NUMBER

                import base64
                auth_header = "Basic " + base64.b64encode(f"{account_sid}:{auth_token}".encode("utf-8")).decode("utf-8")

                url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
                formatted_to = f"+91{mobile_number}" if not mobile_number.startswith("+") else mobile_number
                payload = {
                    "From": from_num,
                    "To": formatted_to,
                    "Body": message_body,
                }
                data = urllib.parse.urlencode(payload).encode("utf-8")
                req = urllib.request.Request(url, data=data, method="POST")
                req.add_header("Authorization", auth_header)

                with urllib.request.urlopen(req, timeout=10) as resp:
                    if resp.status in (200, 201):
                        logger.info("Twilio successfully sent OTP to %s", mobile_number)
                        return True, "OTP sent successfully to registered mobile number."
                    return False, f"Twilio responded with status {resp.status}"

            return False, f"Unknown SMS provider: {provider}"

        except Exception as e:
            logger.error("Failed to deliver OTP SMS to %s: %s", mobile_number, e)
            return False, f"SMS delivery failed: {str(e)}"


sms_service = SMSService()

