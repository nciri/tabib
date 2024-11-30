from common.db import db

class Patient(db.Model):
    __tablename__ = 'patients'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, unique=True, nullable=False)  # Relation avec `users`
    name = db.Column(db.LargeBinary, nullable=True)  # Données sensibles chiffrées
    address = db.Column(db.LargeBinary, nullable=True)
    medical_history = db.Column(db.LargeBinary, nullable=True)
    allergies = db.Column(db.LargeBinary, nullable=True)
    emergency_contact = db.Column(db.LargeBinary, nullable=True)



# from sqlalchemy import create_engine, Column, Integer, LargeBinary
# from sqlalchemy.ext.declarative import declarative_base

# Base = declarative_base()

# class Patient(Base):
#     __tablename__ = 'patients'

#     patient_id = Column(Integer, primary_key=True)
#     pseudonymized_id = Column(LargeBinary)

# # Récupération
# session = Session()
# patient = session.query(Patient).filter_by(patient_id=1).first()
# print(patient.pseudonymized_id)