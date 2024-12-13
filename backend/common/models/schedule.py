from common.db import db
from datetime import datetime

class Schedule(db.Model):
    __tablename__ = 'schedules'
    
    id = db.Column(db.Integer, primary_key=True)
    practitioner_id = db.Column(db.Integer, db.ForeignKey('practitioners.id'), nullable=False)
    unavailable_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)

    # Relationships
    practitioner = db.relationship('Practitioner', backref='schedule_slots')

    def __repr__(self):
        return f"<Schedule {self.id} for Practitioner {self.practitioner_id}>"