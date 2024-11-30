def validate_patient_data(data):
    if not data.get('user_id') or not data.get('name'):
        return {'success': False, 'error': 'Missing required fields'}
    if len(data.get('name', '')) > 100:
        return {'success': False, 'error': 'Name too long'}
    # Ajoutez d'autres règles de validation ici
    return {'success': True}
