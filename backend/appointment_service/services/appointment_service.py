from common.repositories.assistant_repository import AssistantRepository
from common.utils.validation import check_availability, check_schedule
from appointment_service.services.patient_api import PatientApi
from appointment_service.services.practitioner_api import PractitionerApi

from appointment_service.repositories.appointment_repository import AppointmentRepository
from appointment_service.repositories.schedule_repository import ScheduleRepository
from appointment_service.validations.appointment_validations import validate_appointment_data

from datetime import datetime, timedelta

class AppointmentService:
    def __init__(self):
        self.appointment_repository = AppointmentRepository()
        self.assistant_practitioner_repository = AssistantRepository()
        self.schedule_repository = ScheduleRepository()

    def list(self, user_id, role):
        return self.appointment_repository.list(user_id, role)

    from datetime import datetime, timedelta

    def create_appointment(self, data, user_id, role="patient"):
        """
        Crée un rendez-vous après validation.
        """
        # Valider les données
        validation_result = validate_appointment_data(data)
        if not validation_result["success"]:
            return validation_result

        if not user_id or not role:
            return {"success": False, "error": "Missing user_id or role"}

        # Vérifier le champ appointment_date
        try:
            appointment_date = datetime.strptime(data["appointment_date"], "%Y-%m-%dT%H:%M:%S")
            data["appointment_date"] = appointment_date
        except ValueError:
            return {"success": False, "error": "Invalid appointment_date format. Expected: YYYY-MM-DDTHH:MM:SS"}

        # Vérification des disponibilités et indisponibilités
        practitioner_id = data["practitioner_id"]
        duration = data.get("duration")
        
        # Si l'utilisateur est un assistant, vérifier qu'il est autorisé
        if role == 'assistant' and not self.assistant_practitioner_repository.is_associated(user_id, practitioner_id):
            return {'success': False, 'error': 'You are not authorized to create appointments for this practitioner'}

        if not check_availability(practitioner_id, appointment_date):
            return {"success": False, "error": "The practitioner is not available at this time"}
        
        # if not check_schedule(practitioner_id, appointment_date, duration):
        #     return {"success": False, "error": "The appointment falls within an unavailable schedule"}

        # Enregistrer le rendez-vous
        repository = AppointmentRepository()
        return repository.create(data)


    
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
    
    @staticmethod
    def get_appointment(appointment_id):
        """
        Récupère les détails du rendez-vous, y compris les informations sur le patient.
        """
        
        try:
            # Récupérer les informations de l'appointment depuis la base
            appointment = AppointmentRepository.get_appointment(appointment_id)

            if not appointment:
                return None

            patient = PatientApi.get_patient(appointment.patient_id)
            practitioner = PractitionerApi.get_practitioner(appointment.practitioner_id)
                
            
            return {
                        "appointment_id": appointment.appointment_id,
                        "appointment_date": appointment.appointment_date,
                        "duration": appointment.duration,
                        "patient": patient, # Détails du patient récupérés via l'API
                        "practitioner": practitioner # Détails du Practicien récupérés via l'API
                    }
        except Exception as e:
            print(f"Error getting data: {str(e)}")
            return None