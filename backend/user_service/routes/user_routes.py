from flask import Blueprint, request, jsonify
from common.models.user import User
from common.db import db

user_bp = Blueprint('users', __name__)

@user_bp.route('/', methods=['POST'])
def create_user():
    data = request.json
    user = User(
        username=data['username'],
        password=data['password'],
        role=data['role'],
        email=data['email'],
        phone=data.get('phone')
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created', 'user_id': user.user_id}), 201

@user_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({
        'user_id': user.user_id,
        'username': user.username,
        'email': user.email,
        'phone': user.phone,
        'role': user.role
    }), 200
