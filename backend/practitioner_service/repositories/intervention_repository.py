from common.models.practitioner_intervention import PractitionerIntervention
from common.db import db

class InterventionRepository:
    def get_by_practitioner(self, practitioner_id):
        return PractitionerIntervention.query.filter_by(practitioner_id=practitioner_id).all()

    def create(self, data):
        intervention = PractitionerIntervention(
            practitioner_id=data['practitioner_id'],
            intervention_type_id=data['intervention_type_id'],
            duration=data['duration'],
            cost=data.get('cost')
        )
        db.session.add(intervention)
        db.session.commit()
        return {'success': True, 'practitioner_intervention_id': intervention.practitioner_intervention_id}
