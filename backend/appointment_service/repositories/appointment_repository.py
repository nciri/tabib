from common.models.appointment import Appointment
from common.models.patient import Patient
from common.models.practitioner import Practitioner
from common.models.practitioner_assistant import Assistant
from common.db import db
from common.models.user import User

class AppointmentRepository:
    def list(self, user_id, role):
        """
        Retourne les rendez-vous avec les informations associées selon le rôle.
        """
        query = (
            Appointment.query
            .join(Patient, Patient.id == Appointment.patient_id)
            .join(Practitioner, Practitioner.practitioner_id == Appointment.practitioner_id)
            .join(db.aliased(User, name='practitioner'), 
                  db.aliased(User, name='practitioner').user_id == Practitioner.user_id)
            .add_columns(
                Appointment.appointment_id,
                Appointment.appointment_date,
                Appointment.duration,
                Appointment.status,
                Patient.name.label('patient_name'),
                Patient.email.label('patient_email'),
                Patient.phone.label('patient_phone')
            )
        )

        # Appliquer les filtres selon le rôle
        if role == 'patient':
            query = query.join(User, User.user_id == Patient.user_id)
            query = query.filter(Patient.user_id == user_id)
        elif role == 'practitioner':
            query = query.filter(Practitioner.user_id == user_id)
        elif role == 'assistant':
            practitioner_ids = (
                Assistant.query
                .join(Practitioner, Practitioner.practitioner_id == Assistant.practitioner_id)
                .filter(Assistant.user_id == user_id)
                .with_entities(Assistant.practitioner_id)
                .all()
            )
            practitioner_ids = [id[0] for id in practitioner_ids]
            query = query.filter(Appointment.practitioner_id.in_(practitioner_ids))

        # Exécuter la requête et formater les résultats
        appointments = query.all()
        
        # Convertir les résultats en dictionnaires sérialisables
        result = []
        for appointment in appointments:
            appointment_dict = {
                'appointment_id': appointment.appointment_id,
                'appointment_date': appointment.appointment_date.isoformat() if appointment.appointment_date else None,
                'duration': appointment.duration,
                'status': appointment.status,
                'patient': {
                    'name': appointment.patient_name,
                    'email': appointment.patient_email,
                    'phone': appointment.patient_phone
                }
            }
            result.append(appointment_dict)
        print(result)
        return result

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

    @staticmethod
    def get_appointment(appointment_id):
        if appointment := Appointment.query.get(appointment_id):
            return {
                'appointment_id': appointment.appointment_id,
                'appointment_date': appointment.appointment_date.isoformat() if appointment.appointment_date else None,
                'duration': appointment.duration,
                'status': appointment.status,
                'patient_id': appointment.patient_id,
                'practitioner_id': appointment.practitioner_id,
                'intervention_type_id': appointment.intervention_type_id
            }
        return None