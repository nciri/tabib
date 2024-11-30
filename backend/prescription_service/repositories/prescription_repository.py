from common.models.prescription import Prescription
from common.db import db

class PrescriptionRepository:
    @staticmethod
    def create_prescription(appointment_id, content):
        prescription = Prescription(
            appointment_id=appointment_id,
            content=content,
            is_signed=False
        )
        db.session.add(prescription)
        db.session.commit()
        return prescription

    @staticmethod
    def get_prescription_with_details(prescription_id):
        query = """
        SELECT p.id AS prescription_id, p.content, p.is_signed, p.created_at, p.updated_at,
               ap.patient_id, ap.practitioner_id, p.external_code
        FROM prescriptions p
        JOIN appointments ap ON ap.id = p.appointment_id
        WHERE p.id = :prescription_id
        """
        result = db.session.execute(query, {"prescription_id": prescription_id}).fetchone()
        return dict(result) if result else None

    @staticmethod
    def get_prescription_by_id(prescription_id):
        return db.session.query(Prescription).filter_by(id=prescription_id).first()

    @staticmethod
    def update_prescription(prescription):
        db.session.commit()