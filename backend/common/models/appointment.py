from common.db import db

class Appointment(db.Model):
    
    __tablename__ = 'appointments'
    
    appointment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    patient_id = db.Column(db.Integer, nullable=False)
    practitioner_id = db.Column(db.Integer, nullable=False)
    intervention_type_id = db.Column(db.Integer, nullable=False)
    appointment_date = db.Column(db.DateTime, nullable=False)  # Passer de Date à DateTime
    duration = db.Column(db.Integer, nullable=False)  # Durée en minutes
    status = db.Column(db.String(50), nullable=False, default='scheduled')
    notes = db.Column(db.Text)
    
def __repr__(self):
        return f"<Appointment {self.appointment_id}>"