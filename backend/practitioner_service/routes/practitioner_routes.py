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

@practitioner_bp.route('/search', methods=['GET'])
def search_practitioners():
    """
    Search practitioners by type, term and location
    """
    search_type = request.args.get('type')
    search_term = request.args.get('term')
    location = request.args.get('location')
    
    practitioners = practitioner_service.search_practitioners(
        search_type=search_type,
        search_term=search_term,
        location=location
    )
    return jsonify(practitioners), 200

@practitioner_bp.route('/<int:practitioner_id>', methods=['GET'])
def get_practitioner(practitioner_id):
    practitioner = practitioner_service.get_practitioner_by_id(practitioner_id)
    if not practitioner:
        return jsonify({'error': 'Practitioner not found'}), 404
    return jsonify(practitioner), 200
