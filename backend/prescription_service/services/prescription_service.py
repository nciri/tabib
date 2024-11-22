from repositories.prescription_repository import PrescriptionRepository
from repositories.medical_document_repository import MedicalDocumentRepository
from flask import abort
from fpdf import FPDF
import os

class PrescriptionService:
    @staticmethod
    def create_prescription(appointment_id, content):
        return PrescriptionRepository.create_prescription(appointment_id, content)

    @staticmethod
    def view_prescription(prescription_id, user_role, user_id, external_code=None):
        details = PrescriptionRepository.get_prescription_with_details(prescription_id)
        if not details:
            abort(404, "Prescription not found.")

        # Vérification des autorisations
        prescription = details["prescription"]
        if user_role == "patient" and prescription["patient_id"] != user_id:
            abort(403, "Access denied.")
        if user_role == "assistant" and prescription["practitioner_id"] != user_id:
            abort(403, "Access denied.")
        if user_role == "external" and prescription.get("external_code") != external_code:
            abort(403, "Invalid external code.")

        return details

    @staticmethod
    def generate_prescription_pdf(prescription_id):
        details = PrescriptionRepository.get_prescription_with_details(prescription_id)
        if not details:
            abort(404, "Prescription not found.")

        if not details["prescription"]["is_signed"]:
            abort(403, "Prescription must be signed before generating a PDF.")

        # Préparer les données pour le PDF
        pdf_data = PrescriptionService._prepare_pdf_data(details)

        # Générer le PDF
        pdf_path = PrescriptionService._generate_pdf(prescription_id, pdf_data)

        # Enregistrer le document dans la table `medical_documents`
        MedicalDocumentRepository.save_document(
            patient_id=details["prescription"]["patient_id"],
            appointment_id=details["prescription"]["appointment_id"],
            document_type="Prescription",
            file_path=pdf_path
        )
        return pdf_path

    @staticmethod
    def _prepare_pdf_data(details):
        return {
            "practitioner_name": details["prescription"]["practitioner_name"],
            "practitioner_specialty": details["prescription"]["practitioner_specialty"],
            "patient_name": f"{details['prescription']['patient_first_name']} {details['prescription']['patient_last_name']}",
            "medications": details["medications"]
        }

    @staticmethod
    def _generate_pdf(prescription_id, pdf_data):
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)

        # Informations générales
        pdf.set_font("Arial", style="B", size=16)
        pdf.cell(200, 10, txt="Prescription", ln=True, align="C")
        pdf.ln(10)

        # Informations sur le praticien
        pdf.cell(200, 10, txt=f"Practitioner: {pdf_data['practitioner_name']} ({pdf_data['practitioner_specialty']})", ln=True)

        # Informations sur le patient
        pdf.cell(200, 10, txt=f"Patient: {pdf_data['patient_name']}", ln=True)

        # Médicaments
        pdf.ln(10)
        pdf.cell(200, 10, txt="Medications:", ln=True)
        for medication in pdf_data["medications"]:
            pdf.multi_cell(0, 10, txt=f"- {medication['drug_name']} | {medication['dosage']} | {medication['frequency']} | {medication['duration']}\n{medication['instructions']}")

        # Sauvegarder le PDF
        output_dir = "generated_prescriptions"
        os.makedirs(output_dir, exist_ok=True)
        pdf_file_path = os.path.join(output_dir, f"prescription_{prescription_id}.pdf")
        pdf.output(pdf_file_path)
        return pdf_file_path
