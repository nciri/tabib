from common.db import db
from datetime import datetime

# Define the association table first
practitioners_assistants = db.Table('practitioners_assistants',
    db.Column('id', db.Integer, primary_key=True),
    db.Column('practitioner_id', db.Integer, db.ForeignKey('practitioners.id'), nullable=False),
    db.Column('assistant_id', db.Integer, db.ForeignKey('users.id'), nullable=False),
    db.Column('created_at', db.DateTime, default=datetime.utcnow),
    db.Column('updated_at', db.DateTime),
    db.UniqueConstraint('practitioner_id', 'assistant_id', name='uix_practitioner_assistant')
)

class Practitioner(db.Model):
    __tablename__ = 'practitioners'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    specialty = db.Column(db.String(100))
    location = db.Column(db.String(255))
    bio = db.Column(db.Text)
    experience_years = db.Column(db.Integer)
    consultation_fee = db.Column(db.Numeric(10, 2))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)

    # Relationships
    user = db.relationship('User', backref='practitioner_profile')
    interventions = db.relationship('PractitionerIntervention', backref='practitioner_details')
    assistants = db.relationship('User', 
                               secondary=practitioners_assistants,
                               backref=db.backref('assisting_practitioners', lazy='dynamic'))