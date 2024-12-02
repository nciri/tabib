from flask import Blueprint, request, jsonify
from services.appointment_service import AppointmentService

appointment_bp = Blueprint('appointments', __name__)
appointment_service = AppointmentService()

@appointment_bp.route('/', methods=['GET'])
def list_appointments():

    user_id = request.args.get('user_id', type=int)
    role = request.args.get('role', type=str)


    return appointment_service.get_appointments(user_id, role)

@appointment_bp.route('/appointments', methods=['POST'])
def create_appointment():
    """
    Crée un nouveau rendez-vous après validation.
    """
    data = request.json
    user_id = data.pop('user_id', None)
    role = data.pop('role', None)
    
    if not user_id or not role:
        return jsonify({'error': 'Missing user_id or role'}), 400
        
    result = appointment_service.create_appointment(data, user_id, role)
    return jsonify(result), 201 if result.get('success') else 400


@appointment_bp.route("/appointments/available", methods=["GET"])
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
