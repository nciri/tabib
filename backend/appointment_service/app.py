import sys
import os

# Ajouter le répertoire parent au chemin Python
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from flask import Flask
from common.db import db
from common.config import Config
from common.models import Appointment, PractitionerIntervention
from routes.appointment_routes import appointment_bp


# Initialisation de Flask
app = Flask(__name__)

# Chargement de la configuration depuis `common/config.py`
app.config.from_object(Config)

# Initialisation de la base de données
db.init_app(app)



# Enregistrement des routes pour les rendez-vous
app.register_blueprint(appointment_bp, url_prefix='/appointments')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Créer les tables si elles n'existent pas
    app.run(debug=True)
