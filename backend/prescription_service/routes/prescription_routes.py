from flask import Blueprint, request, jsonify
from services.prescription_service import PrescriptionService

prescription_bp = Blueprint("prescriptions", __name__)

@prescription_bp.route("/prescriptions", methods=["POST"])
def create_prescription():
    data = request.json
    prescription = PrescriptionService.create_prescription(
        appointment_id=data["appointment_id"],
        content=data["content"]
    )
    return jsonify({"id": prescription.id}), 201


@prescription_bp.route("/prescriptions/<int:prescription_id>/view", methods=["GET"])
def view_prescription(prescription_id):
    """
    Permet de consulter une prescription après vérification des autorisations.
    """
    user_role = request.args.get("role")  # Récupération du rôle de l'utilisateur
    user_id = request.args.get("user_id", type=int)  # ID de l'utilisateur
    external_code = request.args.get("external_code")  # Code externe pour les tiers

    details = PrescriptionService.view_prescription(
        prescription_id=prescription_id,
        user_role=user_role,
        user_id=user_id,
        external_code=external_code
    )
    return jsonify(details), 200


@prescription_bp.route("/prescriptions/<int:prescription_id>/generate-pdf", methods=["GET"])
def generate_pdf(prescription_id):
    """
    Génère un PDF pour une prescription signée.
    """
    pdf_path = PrescriptionService.generate_prescription_pdf(prescription_id)
    return jsonify({"message": "PDF generated successfully.", "pdf_path": pdf_path}), 200

