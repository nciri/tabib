from common.db import db

class Practitioner(db.Model):
    __tablename__ = 'practitioners'
    practitioner_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, unique=True, nullable=False)  # Relation avec la table `users`
    specialty = db.Column(db.String(100), nullable=False)  # Spécialité
    location = db.Column(db.String(100), nullable=True)  # Localisation
    bio = db.Column(db.Text, nullable=True)  # Biographie
    experience_years = db.Column(db.Integer, nullable=True)  # Années d'expérience
    consultation_fee = db.Column(db.Numeric(10, 2), nullable=True)  # Tarif de consultation
