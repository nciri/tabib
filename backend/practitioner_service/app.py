from flask import Flask
from flask_cors import CORS
from common.db import db
from common.config import Config
from routes.practitioner_routes import practitioner_bp
from routes.intervention_routes import intervention_bp


# Initialisation de Flask
app = Flask(__name__)
CORS(app)

# Chargement de la configuration depuis `common/config.py`
app.config.from_object(Config)

# Initialisation de la base de données
db.init_app(app)

# Enregistrement des routes
app.register_blueprint(practitioner_bp, url_prefix='/practitioners')
app.register_blueprint(intervention_bp, url_prefix='/interventions')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='127.0.0.1', port=5001, debug=True)
