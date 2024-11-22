from flask import Blueprint, request, jsonify
from services.appointment_service import AppointmentService

appointment_bp = Blueprint('appointments', __name__)
appointment_service = AppointmentService()

@appointment_bp.route('/', methods=['GET'])
def list_appointments():

    user_id = request.args.get('user_id', type=int)
    role = request.args.get('role', type=str)


    return appointment_service.get_appointments(user_id, role)

@appointment_bp.route('/', methods=['POST'])
def create_appointment():
    """
    Crée un nouveau rendez-vous après validation.
    """
    data = request.json
    result = appointment_service.create_appointment(data)
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
