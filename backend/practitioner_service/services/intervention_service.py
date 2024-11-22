from repositories.intervention_repository import InterventionRepository

class InterventionService:
    def __init__(self):
        self.intervention_repository = InterventionRepository()

    def get_interventions_by_practitioner(self, practitioner_id):
        return self.intervention_repository.get_by_practitioner(practitioner_id)

    def create_intervention(self, data):
        if not data.get('practitioner_id') or not data.get('intervention_type_id'):
            return {'success': False, 'error': 'Missing required fields'}

        return self.intervention_repository.create(data)
