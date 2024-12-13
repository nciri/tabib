from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from common.db import db
from common.config import Config

# Import all models
from common.models.user import User
from common.models.patient import Patient
from common.models.practitioner import Practitioner
from common.models.intervention_type import InterventionType
from common.models.practitioner_intervention import PractitionerIntervention
from common.models.schedule import Schedule
from common.models.appointment import Appointment
from common.models.invoice import Invoice
from common.models.payment import Payment
from common.models.prescription import Prescription
from common.models.prescription_medication import PrescriptionMedication
from common.models.medical_document import MedicalDocument
from common.models.notification import Notification

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)

if __name__ == '__main__':
    app.run()