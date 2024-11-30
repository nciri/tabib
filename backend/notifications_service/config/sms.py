import os

class SMSConfig:
    TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "your_account_sid")
    TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "your_auth_token")
    TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER", "+123456789")
