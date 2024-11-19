from common.db import db

class Assistant(db.Model):
    __tablename__ = 'assistants_practitioners'
    assistant_id = db.Column(db.Integer, nullable=False)
    practitioner_id = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)

    __table_args__ = (
        db.PrimaryKeyConstraint('assistant_id', 'practitioner_id'),
    )
