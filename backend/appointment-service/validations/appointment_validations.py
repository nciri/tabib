from datetime import datetime

def validate_appointment_data(data):
    """
    Valide les données pour la création d'un rendez-vous.
    """
    required_fields = ['patient_id', 'practitioner_id', 'intervention_type_id', 'appointment_date']
    for field in required_fields:
        if field not in data:
            return {'success': False, 'error': f'Missing required field: {field}'}
    
    try:
        datetime.strptime(data['appointment_date'], '%Y-%m-%dT%H:%M:%S')
    except ValueError:
        return {'success': False, 'error': 'Invalid appointment_date format. Expected: YYYY-MM-DDTHH:MM:SS'}
    
    if not isinstance(data.get('patient_id'), int) or data['patient_id'] <= 0:
        return {'success': False, 'error': 'Invalid patient_id'}

    if not isinstance(data.get('practitioner_id'), int) or data['practitioner_id'] <= 0:
        return {'success': False, 'error': 'Invalid practitioner_id'}

    if not isinstance(data.get('intervention_type_id'), int) or data['intervention_type_id'] <= 0:
        return {'success': False, 'error': 'Invalid intervention_type_id'}

    return {'success': True}
