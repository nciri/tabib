import requests
from common.config import Config

class PatientApi:
    BASE_URL = Config.MICROSERVICES_URLS["patient_service"]  # URL du microservice patient_service (peut changer en fonction de Docker)

    @staticmethod
    def get_patient(id):
        """
        Récupère les informations d'un patient depuis patient_service.
        """
        try:
            response = requests.get(f"{PatientApi.BASE_URL}/patients/{id}")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching patient data: {e}")
            return None
