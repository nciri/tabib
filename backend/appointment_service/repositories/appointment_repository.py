from common.models.appointment import Appointment
from common.models.practitioner_assistant import Assistant
from common.db import db

class AppointmentRepository:
    def get_by_role(self, user_id, role):
        """
        Retourne les rendez-vous filtrés par rôle.
        - Patient : Ses propres rendez-vous.
        - Practitioner : Les rendez-vous du praticien.
        - Admin : Tous les rendez-vous.
        - Assistant : Les rendez-vous des praticiens auxquels l’assistant est associé.
        """
        query = Appointment.query
        if role == 'patient':
            query = query.filter(Appointment.patient_id == user_id)
        elif role == 'practitioner':
            query = query.filter(Appointment.practitioner_id == user_id)
        elif role == 'admin':
            return query.all()
        elif role == 'assistant':
            # Récupérer les praticiens associés à cet assistant
            practitioner_ids = (
                Assistant.query
                .filter(Assistant.assistant_id == user_id)
                .with_entities(Assistant.practitioner_id)
                .all()
            )
            practitioner_ids = [id[0] for id in practitioner_ids]

            # Filtrer les rendez-vous des praticiens associés
            query = query.filter(Appointment.practitioner_id.in_(practitioner_ids))


        return query.all()

    def create(self, data):
        appointment = Appointment(
            patient_id=data['patient_id'],
            practitioner_id=data['practitioner_id'],
            intervention_type_id=data['intervention_type_id'],
            appointment_date=data['appointment_date'],
            duration=data.get('duration'),
            status=data.get('status', 'scheduled')
        )
        db.session.add(appointment)
        db.session.commit()
        return {'success': True, 'appointment_id': appointment.appointment_id}

    def get_appointment(appointment_id):
        result = Appointment.query.get(appointment_id)
        return result