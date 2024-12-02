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

    def search_practitioners(self, search_type=None, search_term=None, location=None):
        practitioners = self.practitioner_repository.get_all()
        results = []
        
        for practitioner in practitioners:
            user_data = UserService.get_user_data(practitioner.user_id)
            
            doctor = {
                'id': practitioner.practitioner_id,
                'name': f"Dr. {user_data.get('username', 'Unknown')}" if user_data else 'Unknown Doctor',
                'specialty': practitioner.specialty,
                'location': practitioner.location,
                'availability': self.get_availability(practitioner.practitioner_id),
                'image': user_data.get('image') if user_data else None
            }
            
            # Search across all fields when search_type is 'all'
            if search_term and search_type == 'all':
                search_term_lower = search_term.lower()
                if (search_term_lower not in doctor['name'].lower() and
                    search_term_lower not in doctor['specialty'].lower()):
                    continue
                
            if location and location.strip():
                if not doctor['location'] or location.lower() not in doctor['location'].lower():
                    continue
                
            results.append(doctor)
        
        return results

    def get_availability(self, practitioner_id):
        # TODO: Implement actual availability check from schedule service
        # For now, return default availability
        return "Available"

    def get_practitioner(self, practitioner_id):
        practitioner = self.practitioner_repository.get(practitioner_id)
        if not practitioner:
            return None
        
        # Get user data
        user_data = UserService.get_user_data(practitioner.user_id)
        
        return {
            'id': practitioner.practitioner_id,
            'name': f"Dr. {user_data.get('username', 'Unknown')}" if user_data else 'Unknown Doctor',
            'specialty': practitioner.specialty,
            'location': practitioner.location,
            'bio': practitioner.bio,
            'experience_years': practitioner.experience_years,
            'consultation_fee': float(practitioner.consultation_fee) if practitioner.consultation_fee else None,
            'availability': self.get_availability(practitioner.practitioner_id)
        }
