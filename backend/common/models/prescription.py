from common.db import db
from datetime import datetime

class Prescription(db.Model):
    __tablename__ = "prescriptions"

    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey("appointments.id"), nullable=False)
    content = db.Column(db.Text, nullable=False)
    is_signed = db.Column(db.Boolean, nullable=False, default=False)
    external_code = db.Column(db.String(50))
    external_notes = db.Column(db.Text)
    external_stamp = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)

    # Relationships
    medications = db.relationship('PrescriptionMedication', backref='prescription')

    # Relation avec l'entité Appointment
    appointment = db.relationship("Appointment", backref="prescriptions")
