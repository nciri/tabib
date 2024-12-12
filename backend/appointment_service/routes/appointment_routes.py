from flask import Blueprint, request, jsonify
from appointment_service.services.appointment_service import AppointmentService

appointments_bp = Blueprint('appointments_plural', __name__)
appointment_bp = Blueprint('appointment', __name__)

appointment_service = AppointmentService()

@appointments_bp.route('/list', methods=['GET'])
def list():

    # user_id = request.args.get('user_id', type=int)
    # role = request.args.get('role', type=str)
    user_id = 4
    role = 'patient'
    return appointment_service.list(user_id, role)

@appointment_bp.route('/create', methods=['POST', 'OPTIONS'])
def create_appointment():
    """
    Crée un nouveau rendez-vous après validation.
    """
    if request.method == 'OPTIONS':
        return '', 200  # Répond à la requête preflight avec un statut 200
    data = request.json
    user_id = data.get('user_id')  # Récupère user_id du payload
    role = data.get('role')  # Récupère role du payload
    
    if not user_id or not role:
        return jsonify({'error': 'Missing user_id or role'}), 400

    result = AppointmentService.create_appointment(AppointmentService, data, user_id, role)
    return jsonify(result), 201 if result.get('success') else 400


@appointment_bp.route("/available", methods=["GET"])
def get_available_appointments():
    """
    Endpoint pour récupérer les créneaux disponibles pour un praticien.
    Exclut les créneaux d'indisponibilités.
    """
    practitioner_id = request.args.get("practitioner_id", type=int)
    date = request.args.get("date")  # Format attendu : YYYY-MM-DD

    if not practitioner_id or not date:
        return jsonify({"error": "Missing practitioner_id or date"}), 400

    available_appointments = AppointmentService.get_available_appointments(practitioner_id, date)
    return jsonify(available_appointments), 200

@appointment_bp.route('/<int:id>', methods=['GET'])
def get_appointment(id):
    """
    Récupère les détails d'un rendez-vous y inclu les informations du patient.
    """
    result = appointment_service.get_appointment(id)
    return jsonify(result), 200 if result else 404
