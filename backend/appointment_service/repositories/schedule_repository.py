from common.models.schedule import Schedule
from common.db import db

class ScheduleRepository:
    
    @staticmethod
    def get_schedules_by_practitioner(practitioner_id):
        return Schedule.query.filter_by(practitioner_id=practitioner_id).all()

    @staticmethod
    def get_schedules_by_practitioner_and_date(practitioner_id, date):
        """
        Récupère les indisponibilités pour un praticien à une date donnée.
        """
        return Schedule.query.filter_by(
            practitioner_id=practitioner_id,
            unavailable_date=date
        ).all()

    @staticmethod
    def is_time_available(practitioner_id, date, start_time, end_time):
        """
        Vérifie si une plage horaire est disponible pour un praticien.
        """
        overlapping = Schedule.query.filter(
            Schedule.practitioner_id == practitioner_id,
            Schedule.unavailable_date == date,
            Schedule.start_time < end_time,
            Schedule.end_time > start_time
        ).first()
        return overlapping is None
