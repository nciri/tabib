from common.repositories.assistant_repository import AssistantRepository
from common.utils.validation import check_availability, check_schedule

from repositories.appointment_repository import AppointmentRepository
from repositories.schedule_repository import ScheduleRepository
from validations.appointment_validations import validate_appointment_data

class AppointmentService:
    def __init__(self):
        self.appointment_repository = AppointmentRepository()
        self.assistant_practitioner_repository = AssistantRepository()

    def get_appointments(self, user_id, role):
        return self.appointment_repository.get_by_role(user_id, role)

    def create_appointment(self, data, user_id, role):
        # Valider les données
        validation_result = validate_appointment_data(data)
        if not validation_result['success']:
            return validation_result

        # Si l'utilisateur est un assistant, vérifier qu'il est autorisé
        if role == 'assistant':
            practitioner_id = data.get('practitioner_id')
            if not self.assistant_practitioner_repository.is_associated(user_id, practitioner_id):
                return {'success': False, 'error': 'You are not authorized to create appointments for this practitioner'}

        # Vérification des disponibilités et indisponibilités
        practitioner_id = data['practitioner_id']
        appointment_date = data['appointment_date']

        if not check_availability(practitioner_id, appointment_date):
            return {'success': False, 'error': 'The practitioner is not available at this time'}

        if not check_schedule(practitioner_id, appointment_date):
            return {'success': False, 'error': 'The appointment falls within an unavailable schedule'}

        # Enregistrer le rendez-vous
        return self.appointment_repository.create(data)
    
    @staticmethod
    def get_available_appointments(practitioner_id, date):
        """
        Récupère les rendez-vous disponibles pour un praticien à une date donnée,
        en excluant les créneaux d'indisponibilités.
        """
        # Récupérer tous les rendez-vous existants pour le praticien à la date donnée
        appointments = AppointmentRepository.get_appointments_by_practitioner_and_date(practitioner_id, date)

        # Récupérer les créneaux d'indisponibilités pour le praticien
        schedules = ScheduleRepository.get_schedules_by_practitioner_and_date(practitioner_id, date)

        # Construire une liste des créneaux indisponibles
        unavailable_slots = [
            {"start_time": schedule.start_time, "end_time": schedule.end_time}
            for schedule in schedules
        ]

        # Filtrer les rendez-vous pour exclure ceux qui chevauchent les créneaux indisponibles
        available_appointments = []
        for appointment in appointments:
            is_available = all(
                not (
                    appointment["start_time"] < slot["end_time"] and
                    appointment["end_time"] > slot["start_time"]
                )
                for slot in unavailable_slots
            )
            if is_available:
                available_appointments.append(appointment)

        return available_appointments
