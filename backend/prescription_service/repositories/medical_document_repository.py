from common.db import db

class MedicalDocumentRepository:
    @staticmethod
    def save_document(patient_id, appointment_id, document_type, file_path):
        query = """
        INSERT INTO medical_documents (patient_id, appointment_id, document_type, file_path)
        VALUES (:patient_id, :appointment_id, :document_type, :file_path)
        """
        db.session.execute(query, {
            "patient_id": patient_id,
            "appointment_id": appointment_id,
            "document_type": document_type,
            "file_path": file_path
        })
        db.session.commit()
