from flask import Flask
from common.db import db
from routes.practitioner_routes import practitioner_bp
from routes.intervention_routes import intervention_bp
from common.config import DATABASE_URI

app = Flask(__name__)

# Configuration de la base de données
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialisation de la base de données
db.init_app(app)

# Enregistrement des routes
app.register_blueprint(practitioner_bp, url_prefix='/practitioners')
app.register_blueprint(intervention_bp, url_prefix='/interventions')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='127.0.0.1', port=5001, debug=True)
