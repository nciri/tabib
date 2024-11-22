import os

class KafkaConfig:
    BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
    GROUP_ID = os.getenv("KAFKA_GROUP_ID", "notifications_service")
    TOPICS = {
        "user_events": os.getenv("KAFKA_USER_EVENTS_TOPIC", "user.events"),
        "appointment_events": os.getenv("KAFKA_APPOINTMENT_EVENTS_TOPIC", "appointment.events"),
        "email_events": os.getenv("KAFKA_EMAIL_EVENTS_TOPIC", "email.events"),
        "sms_events": os.getenv("KAFKA_SMS_EVENTS_TOPIC", "sms.events")
    }
