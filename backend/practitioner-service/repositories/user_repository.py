from common.models.user import User

class UserRepository:
    def is_assistant(self, user_id):
        """
        Vérifie si l'utilisateur est un assistant (rôle assistant).
        """
        user = User.query.filter_by(user_id=user_id, role='assistant').first()
        return user is not None
