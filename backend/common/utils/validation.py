from common.models.appointment import Appointment
from common.models.schedule import Schedule
from sqlalchemy import and_, or_, func, text, extract, Date
from datetime import timedelta




def check_schedule(practitioner_id, start_time, end_time):
    """
    Vérifie si un rendez-vous chevauche un créneau d'indisponibilité.

    :param practitioner_id: ID du praticien
    :param start_time: datetime de début du rendez-vous
    :param end_time: datetime de fin du rendez-vous
    :return: True si le créneau est disponible, False sinon
    """
    appointment_date = start_time.date()
    unavailable_slot = Schedule.query.filter(
        and_(
            Schedule.practitioner_id == practitioner_id,
            Schedule.unavailable_date == appointment_date,  # Vérifie la même date
            or_(
                # Chevauchement avec les créneaux d'indisponibilité
                and_(Schedule.start_time <= start_time.time(), Schedule.end_time > start_time.time()),
                and_(Schedule.start_time < end_time.time(), Schedule.end_time >= end_time.time())
            )
        )
    ).first()
    return unavailable_slot is None


def check_availability(practitioner_id, appointment_date):
    """
    Vérifie qu'il n'y a pas de rendez-vous pris à la même date avec le même praticien,
    sauf si le rendez-vous est déjà annulé.

    :param practitioner_id: ID du praticien
    :param appointment_date: Date du rendez-vous à vérifier
    :return: True si aucun rendez-vous n'est pris, False sinon
    """
    # Extraire uniquement la date de l'appointment_date
    appointment_day = appointment_date.date()

    # Requête pour vérifier les rendez-vous existants
    existing_appointment = Appointment.query.filter(
        and_(
            Appointment.practitioner_id == practitioner_id,
            Appointment.appointment_date.cast(Date) == appointment_day,
            Appointment.status != 'cancelled'
        )
    ).first()

    return existing_appointment is None

