from repositories.patient_repository import PatientRepository
from validations.patient_validations import validate_patient_data

class PatientService:
    def __init__(self):
        self.patient_repository = PatientRepository()

    def get_all_patients(self):
        patients = self.patient_repository.get_all()
        return [
            {
                'patient_id': patient.patient_id,
                'user_id': patient.user_id,
                'name': patient.name.decode('utf-8') if patient.name else None,
                'address': patient.address.decode('utf-8') if patient.address else None,
                'medical_history': patient.medical_history.decode('utf-8') if patient.medical_history else None,
                'allergies': patient.allergies.decode('utf-8') if patient.allergies else None,
                'emergency_contact': patient.emergency_contact.decode('utf-8') if patient.emergency_contact else None
            } for patient in patients
        ]

    def create_patient(self, data):
        # Validation des données
        validation_result = validate_patient_data(data)
        if not validation_result['success']:
            return validation_result

        # Création du patient
        patient = self.patient_repository.create(data)
        return {'success': True, 'patient_id': patient.patient_id}

    def get_patient_by_id(self, patient_id):
        patient = self.patient_repository.get_by_id(patient_id)
        if not patient:
            return None
        return {
            'patient_id': patient.patient_id,
            'user_id': patient.user_id,
            'name': patient.name.decode('utf-8') if patient.name else None,
            'address': patient.address.decode('utf-8') if patient.address else None,
            'medical_history': patient.medical_history.decode('utf-8') if patient.medical_history else None,
            'allergies': patient.allergies.decode('utf-8') if patient.allergies else None,
            'emergency_contact': patient.emergency_contact.decode('utf-8') if patient.emergency_contact else None
        }
