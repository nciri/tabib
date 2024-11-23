import os

# DATABASE_URI = os.getenv(
#     'DATABASE_URL', 
#     'postgresql://postgres:postgres@localhost/tabibdb'
# )

# KAFKA_BROKER = os.getenv(
#     'KAFKA_BROKER', 
#     'localhost:9092'
# )

class Config:
    # Configuration de la base de données PostgreSQL
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        'postgresql://postgres:%20@localhost/tabibdb'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Autres configurations (si nécessaire)
    DEBUG = True
    SECRET_KEY = os.getenv("SECRET_KEY", "theorca")

class KafkaConfig:
    BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
    GROUP_ID = os.getenv("KAFKA_GROUP_ID", "notifications_service")
    TOPICS = {
        "user_events": os.getenv("KAFKA_USER_EVENTS_TOPIC", "user.events"),
        "appointment_events": os.getenv("KAFKA_APPOINTMENT_EVENTS_TOPIC", "appointment.events"),
        "email_events": os.getenv("KAFKA_EMAIL_EVENTS_TOPIC", "email.events"),
        "sms_events": os.getenv("KAFKA_SMS_EVENTS_TOPIC", "sms.events")
    }

class TwilioConfig:
    ACCOUNT_SID = "your_twilio_account_sid"
    AUTH_TOKEN = "your_twilio_auth_token"
    FROM_NUMBER = "+1234567890"  # Numéro Twilio pour l'envoi des SMS

class SMSConfig:
    PROVIDER = os.getenv("SMS_PROVIDER", "twilio")  # Exemple : 'twilio', 'nexmo'
    TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", TwilioConfig.ACCOUNT_SID)
    TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", TwilioConfig.AUTH_TOKEN)
    TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER", TwilioConfig.FROM_NUMBER)
