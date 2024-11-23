from common.models.practitioner import Practitioner
from common.db import db

class PractitionerRepository:
    def get_all(self):
        return Practitioner.query.all()

    def create(self, data):
        practitioner = Practitioner(
            user_id=data['user_id'],
            specialty=data['specialty'],
            location=data.get('location'),
            bio=data.get('bio'),
            experience_years=data.get('experience_years'),
            consultation_fee=data.get('consultation_fee')
        )
        db.session.add(practitioner)
        db.session.commit()
        return practitioner

    def get_by_id(self, practitioner_id):
        return Practitioner.query.get(practitioner_id)
