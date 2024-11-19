from common.models.appointment import Appointment
from common.models.schedule import Schedule
from sqlalchemy import and_, or_
from datetime import timedelta

def check_availability(practitioner_id, start_time, end_time):
    conflicting_appointment = Appointment.query.filter(
        and_(
            Appointment.practitioner_id == practitioner_id,
            Appointment.status == 'scheduled',
            Appointment.appointment_date < end_time,
            (Appointment.appointment_date + timedelta(minutes=Appointment.duration_minutes)) > start_time
        )
    ).first()
    return conflicting_appointment is None

def check_schedule(practitioner_id, start_time, end_time):
    appointment_date = start_time.date()
    unavailable_slot = Schedule.query.filter(
        and_(
            Schedule.practitioner_id == practitioner_id,
            Schedule.unavailable_date == appointment_date,
            or_(
                and_(Schedule.start_time <= start_time.time(), Schedule.end_time > start_time.time()),
                and_(Schedule.start_time < end_time.time(), Schedule.end_time >= end_time.time())
            )
        )
    ).first()
    return unavailable_slot is None
