import sys
import os

# Ajouter le répertoire parent au chemin Python
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from flask import Flask
from common.db import db
from common.models import Appointment, PractitionerIntervention
from routes.appointment_routes import appointment_bp
from common.config import DATABASE_URI

app = Flask(__name__)

# Configuration de la base de données
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialisation de la base de données
db.init_app(app)

# Enregistrement des routes pour les rendez-vous
app.register_blueprint(appointment_bp, url_prefix='/appointments')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Créer les tables si elles n'existent pas
    app.run(debug=True)
