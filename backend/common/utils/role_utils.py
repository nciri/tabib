from common.models import Appointment, User, PractitionerIntervention, db

def get_appointments_by_role(user_id, role):
    """
    Retourne les rendez-vous filtrés en fonction du rôle de l'utilisateur.
    """
    if role == 'patient':
        # Le patient ne voit que ses rendez-vous passés et futurs
        return Appointment.query.filter_by(patient_id=user_id).all()
    
    elif role == 'practitioner':
        # Le médecin voit tous ses rendez-vous
        return Appointment.query.filter_by(practitioner_id=user_id).all()
    
    elif role == 'admin':
        # L'administrateur voit tous les rendez-vous
        return Appointment.query.all()
    
    elif role == 'assistant':
        # L'assistante voit les rendez-vous des médecins qui lui sont associés
        practitioner_ids = db.session.query(PractitionerIntervention.practitioner_id).join(
            User, User.user_id == PractitionerIntervention.practitioner_id
        ).filter(
            PractitionerIntervention.practitioner_id.in_(
                db.session.query(Appointment.practitioner_id)
                .filter(Appointment.patient_id == user_id)
            )
        ).all()
        return Appointment.query.filter(Appointment.practitioner_id.in_(practitioner_ids)).all()
    
    else:
        raise ValueError("Invalid role")
