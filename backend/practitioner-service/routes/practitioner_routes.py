from flask import Blueprint, request, jsonify
from services.practitioner_service import PractitionerService

practitioner_bp = Blueprint('practitioners', __name__)
practitioner_service = PractitionerService()

@practitioner_bp.route('/', methods=['GET'])
def list_practitioners():
    practitioners = practitioner_service.get_all_practitioners()
    return jsonify(practitioners), 200

@practitioner_bp.route('/', methods=['POST'])
def create_practitioner():
    data = request.json
    result = practitioner_service.create_practitioner(data)
    return jsonify(result), 201 if result.get('success') else 400
