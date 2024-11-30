import os

class EmailConfig:
    SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.example.com")
    SMTP_PORT = os.getenv("SMTP_PORT", 587)
    SMTP_USERNAME = os.getenv("SMTP_USERNAME", "your_username")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "your_password")
    FROM_EMAIL = os.getenv("FROM_EMAIL", "no-reply@example.com")
