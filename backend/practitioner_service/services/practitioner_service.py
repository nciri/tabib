from repositories.practitioner_repository import PractitionerRepository
from validations.practitioner_validations import validate_practitioner_data
from common.services.user_service import UserService

class PractitionerService:
    def __init__(self):
        self.practitioner_repository = PractitionerRepository()
        self.user_service = UserService()

    def get_all_practitioners(self):
        practitioners = self.practitioner_repository.get_all()
        return [
            {
                'id': practitioner.id,
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
        return {'success': True, 'practitioner_id': practitioner.id}
    
    def assign_assistant(self, data):
        assistant_id = data.get('assistant_id')
        practitioner_id = data.get('practitioner_id')

        if not assistant_id or not practitioner_id:
            return {'success': False, 'error': 'Missing required fields'}

        return self.repository.create(assistant_id, practitioner_id)

    def search_practitioners(self, search_type=None, term=None, location=None):
        practitioners = self.practitioner_repository.search(search_type, term, location)
        
        # Transform the data to include user information
        practitioners_data = []
        for practitioner in practitioners:
            practitioners_data.append({
                'id': practitioner.id,
                'user': {
                    'id': practitioner.user.id,
                    'username': practitioner.user.username,
                    'email': practitioner.user.email,
                    'phone': practitioner.user.phone
                },
                'specialty': practitioner.specialty,
                'location': practitioner.location,
                'bio': practitioner.bio,
                'experience_years': practitioner.experience_years,
                'consultation_fee': practitioner.consultation_fee
            })

        return {
            'data': practitioners_data,
            'total': len(practitioners_data),
            'total_pages': 1  # Add pagination later if needed
        }

    def get_availability(self, practitioner_id):
        # TODO: Implement actual availability check from schedule service
        return "Available"

    def get_practitioner_by_id(self, id):
        practitioner = self.practitioner_repository.get_by_id(id)
        if not practitioner:
            return None
            
        return {
            'id': practitioner.id,
            'user': {
                'id': practitioner.user.id,
                'username': practitioner.user.username,
                'email': practitioner.user.email,
                'phone': practitioner.user.phone
            },
            'specialty': practitioner.specialty,
            'location': practitioner.location,
            'bio': practitioner.bio,
            'experience_years': practitioner.experience_years,
            'consultation_fee': practitioner.consultation_fee
        }