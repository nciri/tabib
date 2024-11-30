import requests
from common.config import Config

class PractitionerApi:
    BASE_URL = Config.MICROSERVICES_URLS["practitioner_service"]  # URL du microservice practitioner_service 

    @staticmethod
    def get_practitioner(id):
        """
        Récupère les informations d'un practicien depuis practitioner_service.
        """
        try:
            response = requests.get(f"{PractitionerApi.BASE_URL}/practitioners/{id}")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching practitioner data: {e}")
            return None
