from common.db import db
from datetime import datetime
import uuid

class Patient(db.Model):
    __tablename__ = 'patients'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    pseudonymized_id = db.Column(db.UUID, nullable=False, default=uuid.uuid4)
    name = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(255))
    medical_history = db.Column(db.Text)
    allergies = db.Column(db.Text)
    emergency_contact = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100))
    date_of_birth = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)

    # Relationships
    user = db.relationship('User', backref='patient_profile')
    # Let Appointment model define the relationship
    medical_documents = db.relationship('MedicalDocument', backref='patient')