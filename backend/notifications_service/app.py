from multiprocessing import Process
from flask import Flask
from common.config.kafka import KafkaConfig
from routes.notification_routes import notification_bp
from consumers.email_consumer import process_email_events
from consumers.sms_consumer import process_sms_events
import logging

# Configuration des logs
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

# Initialiser Flask
app = Flask(__name__)
app.register_blueprint(notification_bp)  # Enregistrer les routes REST


def start_email_consumer():
    """
    Lance le consommateur pour traiter les événements liés aux emails.
    """
    logging.info("Starting email consumer...")
    process_email_events()


def start_sms_consumer():
    """
    Lance le consommateur pour traiter les événements liés aux SMS.
    """
    logging.info("Starting SMS consumer...")
    process_sms_events()


if __name__ == "__main__":
    logging.info("Starting notifications_service...")

    # Lancer les consommateurs Kafka ou SQS en parallèle
    email_process = Process(target=start_email_consumer)
    sms_process = Process(target=start_sms_consumer)

    email_process.start()
    sms_process.start()

    # Lancer le serveur Flask
    app.run(host="0.0.0.0", port=5000)

    # Attendre la fin des processus
    email_process.join()
    sms_process.join()
