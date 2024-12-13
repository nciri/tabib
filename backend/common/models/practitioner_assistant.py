from common.db import db
from datetime import datetime

class Assistant(db.Model):
    __tablename__ = 'practitioner_assistants'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    practitioner_id = db.Column(db.Integer, db.ForeignKey('practitioners.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=True)

    # Relationships
    user = db.relationship('User', backref='assistant_profile')
    practitioner = db.relationship('Practitioner', backref='assistants')
