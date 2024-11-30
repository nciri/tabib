from repositories.practitioner_repository import PractitionerRepository
from validations.practitioner_validations import validate_practitioner_data
import requests

class PractitionerService:
    def __init__(self):
        self.practitioner_repository = PractitionerRepository()

    def get_user_data(self, user_id):
        try:
            response = requests.get(f'http://localhost:5001/users/{user_id}')
            if response.ok:
                return response.json()
            print(f"Failed to get user data: {response.status_code}")
            return None
        except Exception as e:
            print(f"Error getting user data: {str(e)}")
            return None

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
            # Get user data from user service
            user_data = self.get_user_data(practitioner.user_id)
            
            doctor = {
                'id': practitioner.practitioner_id,
                'name': f"Dr. {user_data.get('username', 'Unknown')}" if user_data else 'Unknown Doctor',
                'specialty': practitioner.specialty,
                'location': practitioner.location,
                'availability': self.get_availability(practitioner.practitioner_id),
                'image': user_data.get('image') if user_data else None
            }
            
            # Filter based on search criteria
            if search_term and search_type == 'doctor':
                if search_term.lower() not in doctor['name'].lower():
                    continue
            elif search_term and search_type == 'specialty':
                if search_term.lower() not in doctor['specialty'].lower():
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
        user_data = self.get_user_data(practitioner.user_id)
        
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
