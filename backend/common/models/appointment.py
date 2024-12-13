from common.db import db
from datetime import datetime

class Appointment(db.Model):
    __tablename__ = 'appointments'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    practitioner_id = db.Column(db.Integer, db.ForeignKey('practitioners.id'), nullable=False)
    intervention_type_id = db.Column(db.Integer, db.ForeignKey('intervention_types.id'))
    scheduled_at = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='scheduled')
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)

    # Define relationships in one direction only
    patient = db.relationship('Patient', backref='appointments')
    practitioner = db.relationship('Practitioner', backref='practitioner_appointments')
    intervention_type = db.relationship('InterventionType', backref='appointment_types')
    invoice = db.relationship('Invoice', backref='related_appointment', uselist=False)
    prescription = db.relationship('Prescription', backref='related_appointment', uselist=False)
    medical_documents = db.relationship('MedicalDocument', backref='related_appointment')

def __repr__(self):
        return f"<Appointment {self.id}>"