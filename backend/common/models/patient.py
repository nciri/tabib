from common.db import db

class Patient(db.Model):
    __tablename__ = 'patients'
    patient_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, unique=True, nullable=False)  # Relation avec `users`
    name = db.Column(db.LargeBinary, nullable=True)  # Données sensibles chiffrées
    address = db.Column(db.LargeBinary, nullable=True)
    medical_history = db.Column(db.LargeBinary, nullable=True)
    allergies = db.Column(db.LargeBinary, nullable=True)
    emergency_contact = db.Column(db.LargeBinary, nullable=True)
