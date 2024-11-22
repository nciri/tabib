from kafka import KafkaConsumer
from ..services.notification_service import NotificationService
import json
from ..config.kafka import KafkaConfig

consumer = KafkaConsumer(
    KafkaConfig.TOPICS["appointment_events"],
    bootstrap_servers=KafkaConfig.BOOTSTRAP_SERVERS,
    group_id=KafkaConfig.GROUP_ID,
    value_deserializer=lambda x: json.loads(x.decode("utf-8"))
)

service = NotificationService()

for message in consumer:
    event = message.value
    service.process_event(event["type"], event["data"])
