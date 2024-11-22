from flask import Blueprint, jsonify

notification_bp = Blueprint("notifications", __name__)

@notification_bp.route("/health", methods=["GET"])
def health_check():
    """
    Vérifie l'état du microservice.
    """
    return jsonify({"status": "running"}), 200
