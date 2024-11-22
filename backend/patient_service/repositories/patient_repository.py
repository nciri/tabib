from common.models.patient import Patient
from common.db import db

class PatientRepository:
    def get_all(self):
        return Patient.query.all()

    def create(self, data):
        patient = Patient(
            user_id=data['user_id'],
            name=data['name'].encode('utf-8'),
            address=data.get('address', '').encode('utf-8'),
            medical_history=data.get('medical_history', '').encode('utf-8'),
            allergies=data.get('allergies', '').encode('utf-8'),
            emergency_contact=data.get('emergency_contact', '').encode('utf-8')
        )
        db.session.add(patient)
        db.session.commit()
        return patient

    def get_by_id(self, patient_id):
        return Patient.query.get(patient_id)
