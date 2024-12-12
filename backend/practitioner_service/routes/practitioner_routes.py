from flask import Blueprint, request, jsonify
from practitioner_service.services.practitioner_service import PractitionerService

# Créer un second Blueprint pour la version au pluriel
practitioners_bp = Blueprint('practitioners_plural', __name__, url_prefix='/practitioners')
practitioner_bp = Blueprint('practitioner', __name__, url_prefix='/practitioner')

practitioner_service = PractitionerService()


def list_practitioners_handler():
    practitioners = practitioner_service.get_all_practitioners()
    return jsonify(practitioners), 200

def create_practitioner_handler():
    data = request.json
    result = practitioner_service.create_practitioner(data)
    return jsonify(result), 201 if result.get('success') else 400

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
@practitioners_bp.route('/<int:practitioner_id>', methods=['GET'])
def get_practitioner(practitioner_id):
    if not (practitioner := practitioner_service.get_practitioner(practitioner_id)):
        return jsonify({'error': 'Practitioner not found'}), 404
    else:
        return jsonify(practitioner), 200

# Enregistrer les routes sur les deux Blueprints
practitioner_bp.route('/')(list_practitioners_handler)
practitioners_bp.route('/')(list_practitioners_handler)

practitioner_bp.route('/', methods=['POST'])(create_practitioner_handler)
practitioners_bp.route('/', methods=['POST'])(create_practitioner_handler)
