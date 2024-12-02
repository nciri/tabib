from common.config import Config
import requests

class UserService:
    @staticmethod
    def get_user_data(user_id):
        try:
            user_service_url = Config.USER_SERVICE_URL
            response = requests.get(f'{user_service_url}/users/{user_id}')
            if response.ok:
                return response.json()
            print(f"Failed to get user data: {response.status_code}")
            return None
        except Exception as e:
            print(f"Error getting user data: {str(e)}")
            return None 