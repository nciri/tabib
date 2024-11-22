from flask import Blueprint, request, jsonify
from services.patient_service import PatientService

patient_bp = Blueprint('patients', __name__)
patient_service = PatientService()

@patient_bp.route('/', methods=['GET'])
def list_patients():
    """
    Liste tous les patients.
    """
    patients = patient_service.get_all_patients()
    return jsonify(patients), 200

@patient_bp.route('/', methods=['POST'])
def create_patient():
    """
    Crée un nouveau patient.
    """
    data = request.json
    result = patient_service.create_patient(data)
    return jsonify(result), 201 if result.get('success') else 400

@patient_bp.route('/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    """
    Récupère les détails d'un patient spécifique.
    """
    result = patient_service.get_patient_by_id(patient_id)
    return jsonify(result), 200 if result else 404
