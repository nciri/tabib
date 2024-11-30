from flask import Blueprint, request, jsonify
from services.practitioner_service import PractitionerService

assistant_practitioner_bp = Blueprint('assistant_practitioners', __name__)
practitioner_service = PractitionerService()

@assistant_practitioner_bp.route('/', methods=['POST'])
def assign_assistant_to_practitioner():
    """
    Associe un assistant (utilisateur avec le rôle assistant) à un praticien.
    """
    data = request.json
    result = practitioner_service.assign_assistant(data)
    return jsonify(result), 201 if result.get('success') else 400
