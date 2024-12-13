from common.models.practitioner import Practitioner
from common.models.user import User
from common.models.practitioner_intervention import PractitionerIntervention
from common.models.intervention_type import InterventionType
from sqlalchemy import or_
from common.db import db

class PractitionerRepository:
    def get_all(self):
        return Practitioner.query.all()

    def search(self, search_type=None, term=None, location=None):
        # Start with a base query that joins practitioners with users
        query = Practitioner.query.join(User, User.id == Practitioner.user_id)

        # Apply search filters
        if term:
            query = query.filter(
                or_(
                    User.username.ilike(f'%{term}%'),  # Search in username
                    Practitioner.specialty.ilike(f'%{term}%'),  # Search in specialty
                    Practitioner.location.ilike(f'%{term}%')  # Search in location
                )
            )
        
        if location:
            query = query.filter(Practitioner.location.ilike(f'%{location}%'))

        # Add any other filters based on search_type if needed
        
        return query.all()

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

    def get(self, practitioner_id):
        return Practitioner.query.get(practitioner_id)

    def get_by_id(self, id):
        return Practitioner.query.get(id)
