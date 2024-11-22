from ..config.kafka import KafkaConfig
import logging

def process_email_events():
    """
    Traite les événements liés aux emails depuis Kafka.
    """
    from kafka import KafkaConsumer

    consumer = KafkaConsumer(
        KafkaConfig.EMAIL_TOPIC,
        bootstrap_servers=KafkaConfig.BOOTSTRAP_SERVERS,
        group_id="email-consumer-group",
        auto_offset_reset="earliest"
    )
    
    for message in consumer:
        try:
            # Traiter l'événement
            logging.info(f"Received email event: {message.value}")
            # Ajoutez ici l'envoi de l'email via votre service
        except Exception as e:
            logging.error(f"Error processing email event: {e}")
