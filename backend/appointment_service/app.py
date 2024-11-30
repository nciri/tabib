from flask import Flask
from flask_cors import CORS
from common.db import db
from common.config import Config
from common.models import Appointment, PractitionerIntervention
from routes.appointment_routes import appointment_bp


# Initialisation de Flask
app = Flask(__name__)
CORS(app)

# Chargement de la configuration depuis `common/config.py`
app.config.from_object(Config)

# Initialisation de la base de données
db.init_app(app)



# Enregistrement des routes pour les rendez-vous
app.register_blueprint(appointment_bp, url_prefix='/appointments')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Créer les tables si elles n'existent pas
    app.run(host=Config.HOST, port=5001, debug=True)
