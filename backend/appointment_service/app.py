from flask import Flask, request, jsonify
from werkzeug.exceptions import BadRequest

from flask_cors import CORS
from common.db import db
from common.config import Config
from common.models import Appointment, PractitionerIntervention
from appointment_service.routes.appointment_routes import appointment_bp


# Initialisation de Flask
app = Flask(__name__)
CORS(app, resources={
    r"/appointment/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

@app.before_request
def handle_options_request():
    """
    Gère explicitement les requêtes OPTIONS pour les nouvelles routes.
    """
    if request.method == "OPTIONS":
        response = app.make_response("")
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
        return response
    
@app.after_request
def after_request(response):
    """
    Ajoute des en-têtes CORS aux réponses.
    """
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    return response

@app.errorhandler(BadRequest)
def handle_bad_request(e):
    return jsonify({'error': 'Invalid JSON format', 'message': str(e)}), 400

# Chargement de la configuration depuis `common/config.py`
app.config.from_object(Config)

# Initialisation de la base de données
db.init_app(app)



# Enregistrement des routes pour les rendez-vous
app.register_blueprint(appointment_bp, url_prefix='/appointment')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Créer les tables si elles n'existent pas
    app.run(host=Config.HOST, port=5001, debug=True)
