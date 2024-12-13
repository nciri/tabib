from common.db import db
from datetime import datetime

class PractitionerIntervention(db.Model):
    __tablename__ = 'practitioner_interventions'
    
    id = db.Column(db.Integer, primary_key=True)
    practitioner_id = db.Column(db.Integer, db.ForeignKey('practitioners.id'), nullable=False)
    intervention_type_id = db.Column(db.Integer, db.ForeignKey('intervention_types.id'), nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=False)
    fees = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)

    # Changed backref names to be more specific
    intervention_type = db.relationship('InterventionType', backref='practitioner_intervention_details')
    # The practitioner relationship is already defined in the Practitioner model