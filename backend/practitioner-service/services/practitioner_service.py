from repositories.practitioner_repository import PractitionerRepository
from validations.practitioner_validations import validate_practitioner_data

class PractitionerService:
    def __init__(self):
        self.practitioner_repository = PractitionerRepository()

    def get_all_practitioners(self):
        practitioners = self.practitioner_repository.get_all()
        return [
            {
                'practitioner_id': practitioner.practitioner_id,
                'specialty': practitioner.specialty,
                'location': practitioner.location,
                'bio': practitioner.bio,
                'experience_years': practitioner.experience_years,
                'consultation_fee': float(practitioner.consultation_fee) if practitioner.consultation_fee else None
            } for practitioner in practitioners
        ]

    def create_practitioner(self, data):
        validation_result = validate_practitioner_data(data)
        if not validation_result['success']:
            return validation_result

        practitioner = self.practitioner_repository.create(data)
        return {'success': True, 'practitioner_id': practitioner.practitioner_id}
    
    def assign_assistant(self, data):
        assistant_id = data.get('assistant_id')
        practitioner_id = data.get('practitioner_id')

        if not assistant_id or not practitioner_id:
            return {'success': False, 'error': 'Missing required fields'}

        return self.repository.create(assistant_id, practitioner_id)
