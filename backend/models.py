# models.py

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Candidate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    resume_url = db.Column(db.String(200))
    documents = db.relationship('Document', backref='candidate', lazy=True)
    applications = db.relationship('Application', backref='candidate', lazy=True)

class ApplicationStatus(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(50), nullable=False)

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'), nullable=False)
    status_id = db.Column(db.Integer, db.ForeignKey('application_status.id'), nullable=False)
    notes = db.Column(db.Text)
    applied_date = db.Column(db.DateTime, nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'candidate_id': self.candidate_id,
            'status': self.status.serialize(),
            'notes': self.notes,
            'applied_date': self.applied_date.strftime('%Y-%m-%d %H:%M:%S')
        }
