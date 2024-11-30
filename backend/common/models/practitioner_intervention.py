from common.db import db

class PractitionerIntervention(db.Model):
    __tablename__ = 'practitioner_interventions'
    practitioner_intervention_id = db.Column(db.Integer, primary_key=True)
    practitioner_id = db.Column(db.Integer, db.ForeignKey('practitioners.practitioner_id'), nullable=False)
    intervention_type_id = db.Column(db.Integer, nullable=False)  # Type d'intervention
    duration_minutes = db.Column(db.Integer, nullable=False)  # Durée de l'intervention
    cost = db.Column(db.Numeric(10, 2), nullable=True)  # Tarif optionnel

    # Relation avec le modèle Practitioner
    practitioner = db.relationship('Practitioner', backref='interventions', lazy=True)
