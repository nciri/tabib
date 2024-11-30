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
