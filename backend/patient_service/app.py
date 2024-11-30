from flask import Flask
from common.db import db
from common.config import Config
from routes.patient_routes import patient_bp

app = Flask(__name__)

# Chargement de la configuration depuis `common/config.py`
app.config.from_object(Config)

# Initialisation de la base de données
db.init_app(app)

# Enregistrement des routes
app.register_blueprint(patient_bp, url_prefix='/patients')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host=Config.HOST, port=5003, debug=True)