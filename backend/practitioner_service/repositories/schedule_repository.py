from common.models.schedule import Schedule
from common.db import db

class ScheduleRepository:
    @staticmethod
    def create_schedule(practitioner_id, unavailable_date, start_time, end_time):
        schedule = Schedule(
            practitioner_id=practitioner_id,
            unavailable_date=unavailable_date,
            start_time=start_time,
            end_time=end_time
        )
        db.session.add(schedule)
        db.session.commit()
        return schedule

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
    def update_schedule(schedule_id, unavailable_date, start_time, end_time):
        schedule = Schedule.query.get(schedule_id)
        if schedule:
            schedule.unavailable_date = unavailable_date
            schedule.start_time = start_time
            schedule.end_time = end_time
            db.session.commit()
        return schedule

    @staticmethod
    def delete_schedule(schedule_id):
        schedule = Schedule.query.get(schedule_id)
        if schedule:
            db.session.delete(schedule)
            db.session.commit()
        return schedule

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
