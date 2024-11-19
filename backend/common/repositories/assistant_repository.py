from common.models.practitioner_assistant import Assistant
from common.models.user import User

class AssistantRepository:
    def get_practitioners_for_assistant(self, assistant_id):
        """
        Retourne la liste des praticiens associés à un assistant.
        """
        practitioners = (
            Assistant.query
            .filter_by(assistant_id=assistant_id)
            .with_entities(Assistant.practitioner_id)
            .all()
        )
        return [p[0] for p in practitioners]

    def is_assistant(self, user_id):
        """
        Vérifie si un utilisateur est un assistant (rôle assistant).
        """
        user = User.query.filter_by(user_id=user_id, role='assistant').first()
        return user is not None

    def is_associated(self, assistant_id, practitioner_id):
        """
        Vérifie si un assistant est associé à un praticien donné.
        """
        return bool(
            Assistant.query.filter_by(
                assistant_id=assistant_id, practitioner_id=practitioner_id
            ).first()
        )
