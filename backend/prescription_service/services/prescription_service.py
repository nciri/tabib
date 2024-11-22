from common.models.prescription import Prescription
from common.db import db
from flask import abort

class PrescriptionService:
    @staticmethod
    def create_prescription(appointment_id, content):
        """
        Crée une prescription pour un rendez-vous spécifique.
        """
        prescription = Prescription(
            appointment_id=appointment_id,
            content=content,
            is_signed=False
        )
        db.session.add(prescription)
        db.session.commit()
        return prescription

    @staticmethod
    def sign_prescription(prescription_id, practitioner_id):
        """
        Permet au praticien de signer une prescription associée à un rendez-vous.
        """
        prescription = Prescription.query.get(prescription_id)
        if not prescription:
            abort(404, "Prescription not found.")

        # Vérification que le praticien est lié au rendez-vous
        if prescription.appointment.practitioner_id != practitioner_id:
            abort(403, "You are not allowed to sign this prescription.")

        if prescription.is_signed:
            abort(400, "Prescription is already signed.")
        prescription.is_signed = True
        db.session.commit()
        return prescription

    @staticmethod
    def update_prescription(prescription_id, practitioner_id, new_content):
        """
        Permet au praticien de modifier une prescription avant signature.
        """
        prescription = Prescription.query.get(prescription_id)
        if not prescription:
            abort(404, "Prescription not found.")
        if prescription.is_signed:
            abort(403, "You cannot edit a signed prescription.")
        if prescription.appointment.practitioner_id != practitioner_id:
            abort(403, "You are not allowed to edit this prescription.")
        prescription.content = new_content
        db.session.commit()
        return prescription

    @staticmethod
    def view_prescription(prescription_id, user_role, user_id, external_code=None):
        """
        Récupère les détails complets de la prescription après vérification des autorisations.
        """
        # Récupération des détails de la prescription
        details = PrescriptionService.get_prescription_details(prescription_id)

        # Vérification des autorisations
        prescription = details["prescription"]
        if user_role == "patient" and prescription["patient_id"] != user_id:
            abort(403, "Access denied.")
        if user_role == "assistant" and prescription["practitioner_id"] != user_id:
            abort(403, "Access denied.")
        if user_role == "external" and prescription.get("external_code") != external_code:
            abort(403, "Invalid external code.")

        # Retour des détails
        return details

    @staticmethod
    def add_external_notes(prescription_id, external_code, notes, stamp):
        """
        Permet à un tiers d'ajouter des notes ou un cachet à une prescription.
        """
        prescription = Prescription.query.get(prescription_id)
        if not prescription or prescription.external_code != external_code:
            abort(403, "Invalid external code.")
        prescription.external_notes = notes
        prescription.external_stamp = stamp
        db.session.commit()
        return prescription

    @staticmethod
    def get_prescription_details(prescription_id):
        """
        Récupère les détails complets de la prescription, y compris :
        - Les médicaments prescrits
        - Les informations du praticien
        - Les informations du patient
        """
        prescription = db.session.query(
            Prescription.id.label("prescription_id"),
            Prescription.content.label("content"),
            Prescription.is_signed.label("is_signed"),
            Prescription.created_at.label("created_at"),
            Prescription.updated_at.label("updated_at"),
            db.text("practitioners.name AS practitioner_name"),
            db.text("practitioners.specialty AS practitioner_specialty"),
            db.text("patients.first_name AS patient_first_name"),
            db.text("patients.last_name AS patient_last_name"),
        ).join(
            db.text("appointments ON appointments.appointment_id = prescriptions.appointment_id")
        ).join(
            db.text("practitioners ON practitioners.practitioner_id = appointments.practitioner_id")
        ).join(
            db.text("patients ON patients.patient_id = appointments.patient_id")
        ).filter(Prescription.id == prescription_id).first()

        if not prescription:
            abort(404, "Prescription not found.")

        # Récupérer les médicaments associés
        medications = db.session.execute(
            db.text("""
                SELECT drug_name, dosage, frequency, duration, instructions
                FROM prescription_medications
                WHERE prescription_id = :prescription_id
            """),
            {"prescription_id": prescription_id}
        ).fetchall()

        return {
            "prescription": dict(prescription),
            "medications": [dict(medication) for medication in medications]
        }
    
    @staticmethod
    def generate_prescription_pdf(prescription_id):
        """
        Génère un PDF pour une prescription signée et met à jour la table medical_documents.
        """
        details = PrescriptionService.get_prescription_details(prescription_id)

        # Vérifier si la prescription est signée
        if not details["prescription"]["is_signed"]:
            abort(403, "Prescription must be signed before generating a PDF.")

        #TODO séparer le préparation des données et la génération du pdf en 2 méthodes séparées
        # Création du document PDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)

        # Informations générales
        pdf.set_font("Arial", style="B", size=16)
        pdf.cell(200, 10, txt="Prescription", ln=True, align="C")
        pdf.ln(10)

        # Informations sur le praticien
        practitioner = details["prescription"]
        pdf.cell(200, 10, txt=f"Practitioner: {practitioner['practitioner_name']} ({practitioner['practitioner_specialty']})", ln=True)

        # Informations sur le patient
        patient = details["prescription"]
        pdf.cell(200, 10, txt=f"Patient: {patient['patient_first_name']} {patient['patient_last_name']}", ln=True)

        # Médicaments
        pdf.ln(10)
        pdf.cell(200, 10, txt="Medications:", ln=True)
        for medication in details["medications"]:
            pdf.multi_cell(0, 10, txt=f"- {medication['drug_name']} | {medication['dosage']} | {medication['frequency']} | {medication['duration']}\n{medication['instructions']}")

        # Sauvegarder le PDF
        output_dir = "generated_prescriptions"
        os.makedirs(output_dir, exist_ok=True)
        pdf_file_path = os.path.join(output_dir, f"prescription_{prescription_id}.pdf")
        pdf.output(pdf_file_path)

        #TODO mettre ça en propre en utilisant un modèle et repository dédié
        # Mettre à jour la table medical_documents
        db.session.execute(
            db.text("""
                INSERT INTO medical_documents (patient_id, appointment_id, document_type, file_path)
                VALUES (:patient_id, :appointment_id, :document_type, :file_path)
            """),
            {
                "patient_id": details["prescription"]["patient_id"],
                "appointment_id": details["prescription"]["appointment_id"],
                "document_type": "Prescription",
                "file_path": pdf_file_path
            }
        )
        db.session.commit()

        return pdf_file_path