from common.db import db
from datetime import datetime

class InterventionType(db.Model):
    __tablename__ = 'intervention_types'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)

    # Let other models define their relationships back to InterventionType