from confluent_kafka import Consumer, KafkaError
import json
import logging
from twilio.rest import Client
from common.config import KafkaConfig, SMSConfig

# Configuration des logs
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

def send_sms_notification(phone_number, message_body):
    """
    Envoie une notification SMS via Twilio.
    """
    try:
        # Initialisation du client Twilio
        client = Client(SMSConfig.ACCOUNT_SID, SMSConfig.AUTH_TOKEN)

        # Envoi du SMS
        message = client.messages.create(
            body=message_body,
            from_=SMSConfig.FROM_NUMBER,
            to=phone_number
        )
        logging.info(f"SMS sent successfully to {phone_number}: SID {message.sid}")

    except Exception as e:
        logging.error(f"Failed to send SMS to {phone_number}: {e}")


def main():
    """
    Initialise le Kafka Consumer pour écouter les messages de notifications SMS
    et déclencher l'envoi via Twilio.
    """
    # Initialisation du Kafka Consumer
    consumer = Consumer({
        'bootstrap.servers': KafkaConfig.BOOTSTRAP_SERVERS,
        'group.id': KafkaConfig.CONSUMER_GROUP,
        'auto.offset.reset': 'earliest'
    })

    # S'abonner au sujet Kafka
    consumer.subscribe([KafkaConfig.SMS_TOPIC])

    logging.info("SMS Consumer started. Waiting for messages...")

    try:
        while True:
            msg = consumer.poll(1.0)  # Attente d'un message pendant 1 seconde
            if msg is None:
                continue

            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    # Fin de la partition, continuer à écouter
                    continue
                else:
                    logging.error(f"Consumer error: {msg.error()}")
                    break

            try:
                # Traite le message reçu
                sms_data = json.loads(msg.value().decode('utf-8'))
                phone_number = sms_data.get("phone_number")
                message_body = sms_data.get("message_body")

                if not phone_number or not message_body:
                    logging.warning(f"Invalid message received: {sms_data}")
                    continue

                # Envoi du SMS
                send_sms_notification(phone_number, message_body)

            except Exception as e:
                logging.error(f"Error processing message: {e}")

    except Exception as e:
        logging.error(f"Error initializing Kafka consumer: {e}")

    finally:
        # Fermeture du Kafka Consumer
        consumer.close()


if __name__ == "__main__":
    main()
