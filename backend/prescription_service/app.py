from flask import Flask
from common.db import db
from common.config import DATABASE_URI, Config
from routes.prescription_routes import prescription_bp
import logging

# Configuration des logs
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

# Initialisation de Flask
app = Flask(__name__)

# Chargement de la configuration depuis `common/config.py`
app.config.from_object(Config)

# Initialisation de la base de données
db.init_app(app)

# Enregistrement des routes
app.register_blueprint(prescription_bp)

if __name__ == "__main__":
    logging.info("Starting prescription service...")
    with app.app_context():
        db.create_all()  # Crée les tables si elles n'existent pas
    app.run(host="0.0.0.0", port=5000)
