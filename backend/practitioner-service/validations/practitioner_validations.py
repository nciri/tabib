def validate_practitioner_data(data):
    if not data.get('user_id') or not data.get('specialty'):
        return {'success': False, 'error': 'Missing required fields'}
    if len(data.get('specialty', '')) > 100:
        return {'success': False, 'error': 'Specialty too long'}
    return {'success': True}
