from datetime import datetime

def validate_appointment_data(data):
    """
    Valide les données pour la création d'un rendez-vous.
    """
    required_fields = ["patient_id", "practitioner_id", "intervention_type_id", "appointment_date", "duration"]
    missing_fields = [field for field in required_fields if field not in data or not data[field]]

    if missing_fields:
        return {'success': False, 'error': f"Missing required fields: {', '.join(missing_fields)}"}

    # Vérifier le format de appointment_date
    try:
        datetime.strptime(data["appointment_date"], "%Y-%m-%dT%H:%M:%S")
    except ValueError:
        return {'success': False, 'error': "Invalid appointment_date format. Expected: YYYY-MM-DDTHH:MM:SS"}

    # Vérifier que duration est un entier positif
    try:
        duration = int(data["duration"])
        if duration <= 0:
            raise ValueError
    except (ValueError, TypeError):
        return {'success': False, 'error': "Invalid duration. Must be a positive integer."}

    return {'success': True}

