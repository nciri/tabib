from repositories.schedule_repository import ScheduleRepository

class ScheduleService:
    @staticmethod
    def create_schedule(practitioner_id, unavailable_date, start_time, end_time):
        return ScheduleRepository.create_schedule(practitioner_id, unavailable_date, start_time, end_time)

    @staticmethod
    def get_schedules_by_practitioner(practitioner_id):
        return ScheduleRepository.get_schedules_by_practitioner(practitioner_id)

    @staticmethod
    def update_schedule(schedule_id, unavailable_date, start_time, end_time):
        return ScheduleRepository.update_schedule(schedule_id, unavailable_date, start_time, end_time)

    @staticmethod
    def delete_schedule(schedule_id):
        return ScheduleRepository.delete_schedule(schedule_id)

    @staticmethod
    def is_time_available(practitioner_id, date, start_time, end_time):
        return ScheduleRepository.is_time_available(practitioner_id, date, start_time, end_time)
