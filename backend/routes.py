# routes.py

from flask import Blueprint, request, jsonify
from .models import db, Candidate, Application, ApplicationStatus
from datetime import datetime

candidate_bp = Blueprint('candidates', __name__)

# CRUD operations for candidates (existing)

# CRUD operations for applications
@candidate_bp.route('/candidates/<int:candidate_id>/applications', methods=['GET'])
def get_applications(candidate_id):
    applications = Application.query.filter_by(candidate_id=candidate_id).all()
    return jsonify([application.serialize() for application in applications])

@candidate_bp.route('/candidates/<int:candidate_id>/applications', methods=['POST'])
def add_application(candidate_id):
    data = request.json
    status_id = data.get('status_id')
    new_application = Application(candidate_id=candidate_id, status_id=status_id, 
                                  notes=data.get('notes'), applied_date=datetime.utcnow())
    db.session.add(new_application)
    db.session.commit()
    return jsonify({'message': 'Application added successfully'})

@candidate_bp.route('/applications/<int:application_id>', methods=['PUT'])
def update_application(application_id):
    application = Application.query.get_or_404(application_id)
    data = request.json
    application.status_id = data.get('status_id', application.status_id)
    application.notes = data.get('notes', application.notes)
    db.session.commit()
    return jsonify({'message': 'Application updated successfully'})

# CRUD operations for application statuses
@candidate_bp.route('/statuses', methods=['GET'])
def get_statuses():
    statuses = ApplicationStatus.query.all()
    return jsonify([status.serialize() for status in statuses])

@candidate_bp.route('/statuses', methods=['POST'])
def add_status():
    data = request.json
    new_status = ApplicationStatus(status=data['status'])
    db.session.add(new_status)
    db.session.commit()
    return jsonify({'message': 'Status added successfully'})
