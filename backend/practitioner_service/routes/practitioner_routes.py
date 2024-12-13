from flask import Blueprint, request, jsonify
from services.practitioner_service import PractitionerService

# For plural routes (list, search)
practitioners_bp = Blueprint('practitioners', __name__, url_prefix='/api/practitioners')
# For singular routes (create, update)
practitioner_bp = Blueprint('practitioner', __name__, url_prefix='/api/practitioner')

practitioner_service = PractitionerService()

def list_practitioners_handler():
    practitioners = practitioner_service.get_all_practitioners()
    return jsonify(practitioners), 200

def create_practitioner_handler():
    data = request.json
    result = practitioner_service.create_practitioner(data)
    return jsonify(result), 201 if result.get('success') else 400

@practitioners_bp.route('/search', methods=['GET'])
def search_practitioners():
    """
    Search practitioners by type, term and location
    """
    search_type = request.args.get('type')
    term = request.args.get('term')
    location = request.args.get('location')
    
    practitioners = practitioner_service.search_practitioners(
        search_type=search_type,
        term=term,
        location=location
    )
    return jsonify(practitioners), 200

@practitioners_bp.route('/', methods=['GET'])
def get_all_practitioners():
    """
    Get all practitioners
    """
    return list_practitioners_handler()

@practitioner_bp.route('/<int:id>', methods=['GET'])
def get_practitioner(id):
    """
    Get a specific practitioner by ID
    """
    practitioner = practitioner_service.get_practitioner_by_id(id)
    if not practitioner:
        return jsonify({'error': 'Practitioner not found'}), 404
    return jsonify(practitioner), 200

@practitioner_bp.route('/', methods=['POST'])
def create_practitioner():
    """
    Create a new practitioner
    """
    return create_practitioner_handler()
