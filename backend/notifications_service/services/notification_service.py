from ..config.email import EmailConfig
from ..config.sms import SMSConfig
import smtplib
from twilio.rest import Client

class NotificationService:
    def __init__(self):
        self.sms_client = Client(SMSConfig.TWILIO_ACCOUNT_SID, SMSConfig.TWILIO_AUTH_TOKEN)

    def send_email(self, to_email, subject, body):
        """
        Envoie un email.
        """
        try:
            with smtplib.SMTP(EmailConfig.SMTP_SERVER, EmailConfig.SMTP_PORT) as server:
                server.starttls()
                server.login(EmailConfig.SMTP_USERNAME, EmailConfig.SMTP_PASSWORD)
                server.sendmail(EmailConfig.FROM_EMAIL, to_email, f"Subject: {subject}\n\n{body}")
            return {"success": True, "message": "Email sent successfully"}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def send_sms(self, to_phone, message):
        """
        Envoie un SMS.
        """
        try:
            self.sms_client.messages.create(
                body=message,
                from_=SMSConfig.TWILIO_PHONE_NUMBER,
                to=to_phone
            )
            return {"success": True, "message": "SMS sent successfully"}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def process_event(self, event_type, event_data):
        """
        Processus pour gérer différents types d'événements.
        """
        if event_type == "user_created":
            self.send_email(event_data["email"], "Bienvenue", "Merci de rejoindre notre plateforme.")
            self.send_sms(event_data["phone"], "Bienvenue sur notre plateforme.")
        
        elif event_type == "password_changed":
            self.send_email(event_data["email"], "Changement de mot de passe", "Votre mot de passe a été modifié.")
        
        elif event_type == "appointment_reminder":
            message = f"Rappel : Vous avez un rendez-vous le {event_data['appointment_date']}."
            self.send_email(event_data["email"], "Rappel de rendez-vous", message)
            self.send_sms(event_data["phone"], message)
        
        elif event_type == "appointment_feedback":
            message = "Merci pour votre visite. Veuillez laisser un avis sur votre praticien."
            self.send_email(event_data["email"], "Demande d'avis", message)
        
        # Ajoutez d'autres cas selon les besoins
