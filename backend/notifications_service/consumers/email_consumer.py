from confluent_kafka import Consumer, KafkaError
from common.config import KafkaConfig
import logging
import json

# Configuration des logs
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

def process_email_events():
    """
    Traite les événements liés aux emails depuis Kafka.
    """
    # Initialisation du Kafka Consumer
    consumer = Consumer({
        'bootstrap.servers': KafkaConfig.BOOTSTRAP_SERVERS,
        'group.id': "email-consumer-group",
        'auto.offset.reset': 'earliest'  # Consomme les messages depuis le début si aucun offset n'est défini
    })

    # S'abonner au sujet Kafka
    consumer.subscribe([KafkaConfig.EMAIL_TOPIC])

    logging.info("Email Consumer started. Waiting for email events...")

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
                # Traiter l'événement d'email
                email_event = json.loads(msg.value().decode('utf-8'))
                logging.info(f"Received email event: {email_event}")

                # Simulez ici l'envoi d'un email (ou intégrez votre service d'email)
                process_email(email_event)

            except json.JSONDecodeError as e:
                logging.error(f"Invalid email event format: {msg.value()}. Error: {e}")
            except Exception as e:
                logging.error(f"Error processing email event: {e}")

    except Exception as e:
        logging.error(f"Error initializing Kafka consumer: {e}")

    finally:
        # Fermeture du Kafka Consumer
        consumer.close()


def process_email(email_event):
    """
    Logique pour traiter et envoyer un email.
    """
    try:
        # Exemple d'utilisation des données de l'événement
        recipient = email_event.get("recipient")
        subject = email_event.get("subject")
        body = email_event.get("body")

        if not recipient or not subject or not body:
            logging.warning("Invalid email event: Missing recipient, subject, or body.")
            return

        # Remplacez ceci par l'appel à votre service d'email
        logging.info(f"Sending email to {recipient} with subject '{subject}'")

        # Exemple : envoyer un email avec un service externe (Mailgun, AWS SES, etc.)
        # email_service.send_email(recipient, subject, body)

    except Exception as e:
        logging.error(f"Failed to process email: {e}")
