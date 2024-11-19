from flask import Blueprint, request, jsonify
from services.intervention_service import InterventionService

intervention_bp = Blueprint('interventions', __name__)
intervention_service = InterventionService()

@intervention_bp.route('/<int:practitioner_id>', methods=['GET'])
def list_interventions_for_practitioner(practitioner_id):
    interventions = intervention_service.get_interventions_by_practitioner(practitioner_id)
    return jsonify(interventions), 200

@intervention_bp.route('/', methods=['POST'])
def create_intervention():
    data = request.json
    result = intervention_service.create_intervention(data)
    return jsonify(result), 201 if result.get('success') else 400
