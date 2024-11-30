from flask import Blueprint, request, jsonify
from common.models.patient import Patient
from common.db import db

patient_bp = Blueprint('patients', __name__)

@patient_bp.route('/', methods=['GET'])
def list_patients():
    """
    Liste tous les patients.
    """
    patients = Patient.query.all()
    return jsonify([
        {
            'patient_id': patient.patient_id,
            'user_id': patient.user_id,
            'name': patient.name.decode('utf-8') if patient.name else None,
            'address': patient.address.decode('utf-8') if patient.address else None,
            'medical_history': patient.medical_history.decode('utf-8') if patient.medical_history else None,
            'allergies': patient.allergies.decode('utf-8') if patient.allergies else None,
            'emergency_contact': patient.emergency_contact.decode('utf-8') if patient.emergency_contact else None
        } for patient in patients
    ])

@patient_bp.route('/', methods=['POST'])
def create_patient():
    """
    Crée un nouveau patient.
    """
    data = request.json

    # Validation des données obligatoires
    if not data.get('user_id') or not data.get('name'):
        return jsonify({'error': 'Missing required fields'}), 400

    # Création du patient
    patient = Patient(
        user_id=data['user_id'],
        name=data['name'].encode('utf-8'),
        address=data.get('address', '').encode('utf-8'),
        medical_history=data.get('medical_history', '').encode('utf-8'),
        allergies=data.get('allergies', '').encode('utf-8'),
        emergency_contact=data.get('emergency_contact', '').encode('utf-8')
    )
    db.session.add(patient)
    db.session.commit()

    return jsonify({'message': 'Patient created successfully', 'patient_id': patient.patient_id}), 201

@patient_bp.route('/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    """
    Récupère les détails d'un patient spécifique.
    """
    patient = Patient.query.get_or_404(patient_id)
    return jsonify({
        'patient_id': patient.patient_id,
        'user_id': patient.user_id,
        'name': patient.name.decode('utf-8') if patient.name else None,
        'address': patient.address.decode('utf-8') if patient.address else None,
        'medical_history': patient.medical_history.decode('utf-8') if patient.medical_history else None,
        'allergies': patient.allergies.decode('utf-8') if patient.allergies else None,
        'emergency_contact': patient.emergency_contact.decode('utf-8') if patient.emergency_contact else None
    })
