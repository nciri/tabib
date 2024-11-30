from common.db import db

class Appointment(db.Model):
    __tablename__ = 'appointments'
    appointment_id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, nullable=False)
    practitioner_id = db.Column(db.Integer, nullable=False)
    intervention_type_id = db.Column(db.Integer, nullable=False)
    appointment_date = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='scheduled')
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
