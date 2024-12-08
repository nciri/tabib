import sys
import os

# Add parent directory to Python path
sys.path.append(os.path.abspath(os.path.dirname(os.path.dirname(__file__))))

from flask import Flask
from flask_cors import CORS
from common.db import db
from common.models import User
from routes.user_routes import user_bp
from common.config import Config

app = Flask(__name__)
CORS(app)

# Load configuration from common/config.py
app.config.from_object(Config)

# Initialize database
db.init_app(app)

# Register routes
app.register_blueprint(user_bp, url_prefix='/users')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host=Config.HOST, port=5005, debug=True)
