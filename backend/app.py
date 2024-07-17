from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_pymongo import PyMongo
from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime
from flask_cors import CORS
import os
import logging
from bson.binary import Binary
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
mongo = PyMongo(app)
CORS(app) 
db = mongo.db
@app.route("/")

def insert_sample_data():
    sample_candidates = [
        {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "phone": "123-456-7890",
            "resume": "resume_john.pdf",
            "documents": ["doc1_john.pdf", "doc2_john.pdf"]
        },
        {
            "name": "Jane Smith",
            "email": "jane.smith@example.com",
            "phone": "098-765-4321",
            "resume": "resume_jane.pdf",
            "documents": ["doc1_jane.pdf"]
        }
    ]
    mongo.db.candidates.insert_many(sample_candidates)
    # sample_job_postings = [
    #     {
    #         "title": "Software Engineer",
    #         "department": "Engineering",
    #         "location": "San Francisco, CA",
    #         "job_type": "Full-time",
    #         "description": "Develop and maintain software applications.",
    #         "application_deadline": datetime.strptime('2024-07-31', '%Y-%m-%d').date().isoformat(),
    #         "visibility_status": True
    #     },
    #     {
    #         "title": "Data Scientist",
    #         "department": "Data Science",
    #         "location": "New York, NY",
    #         "job_type": "Contract",
    #         "description": "Analyze and interpret complex data sets.",
    #         "application_deadline": datetime.strptime('2024-08-15', '%Y-%m-%d').date().isoformat(),
    #         "visibility_status": True
    #     }
    # ]
    
    # mongo.db.job_postings.insert_many(sample_job_postings)
    return jsonify({'message': 'Sample data inserted successfully.'}), 200



@app.route('/candidates/add', methods=['POST'])
def add_candidate():
    try:
        candidate_data = request.json
        
        # Example: Parsing date if needed
        if 'date_of_birth' in candidate_data:
            candidate_data['date_of_birth'] = datetime.strptime(candidate_data['date_of_birth'], '%Y-%m-%d').date().isoformat()
        
        # Inserting candidate into MongoDB
        mongo.db.candidates.insert_one(candidate_data)
        
        return jsonify({'message': 'Candidate added successfully.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_candidates', methods=['GET'])
def get_candidates():
    candidates_collection = mongo.db.candidates
    candidates = candidates_collection.find()
    candidate_list = []
    for candidate in candidates:
        candidate_list.append({
            '_id': str(candidate['_id']),
            'name': candidate['name'],
            'email': candidate['email'],
            'phone': candidate['phone'],
            'resume': candidate.get('resume', ''),  # Assuming this is a URL or path
                'documents': candidate.get('documents', []),
            'job_posting_id': str(candidate.get('job_posting_id', '')),
            'application_status': candidate.get('application_status', ''),  # Handle missing application_status
                'interview_schedule': candidate.get('interview_schedule', []),  # Handle missing interview_schedule
        })
    return jsonify(candidate_list)
@app.route('/candidates/search', methods=['GET'])
def search_candidates():
    email = request.args.get('email')
    job_posting_id = request.args.get('job_posting_id')
    query = {}

    if email:
        query['email'] = {'$regex': email, '$options': 'i'}  # Case-insensitive search for email
    if job_posting_id:
        query['job_posting_id'] = {'$regex': job_posting_id, '$options': 'i'}  # Case-insensitive search for job title

    candidates_col = mongo.db.candidates
    results = list(candidates_col.find(query))
    for result in results:
        result['_id'] = str(result['_id'])  # Convert ObjectId to string for JSON serialization

    return jsonify(results), 200
    return candidates_json
# Route to add a job posting
@app.route('/job_postings/add', methods=['POST'])
def add_job_posting():
    job_posting = request.json
    job_posting['application_deadline'] = datetime.strptime(job_posting['application_deadline'], '%Y-%m-%d').date().isoformat()
    mongo.db.job_postings.insert_one(job_posting)
    return jsonify({'message': 'Job posting added successfully.'}), 200


# Route to get all job postings
@app.route('/job_postings', methods=['GET'])
def get_job_postings():
    job_postings = list(mongo.db.job_postings.find())
    for job_posting in job_postings:
        job_posting['_id'] = str(job_posting['_id'])
    return jsonify(job_postings), 200


@app.route('/job_postings/delete/<id>', methods=['DELETE'])
def delete_job_posting(id):
    try:
        result = mongo.db.job_postings.delete_one({'_id': ObjectId(id)})
        if result.deleted_count > 0:
            return jsonify({'message': 'Job posting deleted successfully.'}), 200
        else:
            return jsonify({'error': 'Job posting not found.'}), 404
    except Exception as e:
        logging.error(f"Error deleting job posting: {str(e)}")
        return jsonify({'error': str(e)}), 500
    


@app.route('/job_postings/search', methods=['GET'])
def search_job_postings():
    title = request.args.get('title')
    location = request.args.get('location')
    department = request.args.get('department')
    job_type = request.args.get('job_type')
    query = {}

    if title:
        query['title'] = {'$regex': title, '$options': 'i'}
    if location:
        query['location'] = {'$regex': location, '$options': 'i'}
    if department:
        query['department'] = {'$regex': department, '$options': 'i'}
    if job_type:
        query['job_type'] = {'$regex': job_type, '$options': 'i'}

    job_postings_col = db['job_postings']
    results = list(job_postings_col.find(query))
    for result in results:
        result['_id'] = str(result['_id'])

    return jsonify(results), 200

@app.route('/job_postings/categories', methods=['GET'])
def get_job_posting_categories():
    pipeline = [
        {
            '$facet': {
                'departments': [
                    {'$group': {'_id': '$department', 'count': {'$sum': 1}}}
                ],
                'locations': [
                    {'$group': {'_id': '$location', 'count': {'$sum': 1}}}
                ],
                'job_types': [
                    {'$group': {'_id': '$job_type', 'count': {'$sum': 1}}}
                ]
            }
        }
    ]

    result = list(mongo.db.job_postings.aggregate(pipeline))[0]
    return jsonify(result), 200

@app.route('/job_postings/edit/<id>', methods=['PUT'])
def edit_job_posting(id):
    try:
        job_posting = request.json
        job_posting['application_deadline'] = datetime.strptime(job_posting['application_deadline'], '%Y-%m-%d').date().isoformat()

        result = mongo.db.job_postings.update_one(
            {'_id': ObjectId(id)},
            {'$set': job_posting}
        )

        if result.modified_count > 0:
            return jsonify({'message': 'Job posting updated successfully.'}), 200
        else:
            return jsonify({'error': 'No job posting found or no changes applied.'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500





# Example: Route to get number of applicants
@app.route('/metrics/number_of_applicants', methods=['GET'])
def get_number_of_applicants():
    try:
        candidates_col = mongo.db.candidates
        total_applicants = candidates_col.count_documents({})
        return jsonify({'number_of_applicants': total_applicants}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Example: Route to get number of applications done
@app.route('/metrics/applications_done', methods=['GET'])
def get_applications_done():
    try:
        applications_done = mongo.db.job_postings.count_documents({"application_status": "Done"})
        return jsonify({'applications_done': applications_done}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Example: Route to get number of applications in progress
@app.route('/metrics/applications_in_progress', methods=['GET'])
def get_applications_in_progress():
    try:
        applications_in_progress = mongo.db.job_postings.count_documents({"application_status": "In Progress"})
        return jsonify({'applications_in_progress': applications_in_progress}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


users_col = db['users']  # Collection for storing users

@app.route('/register', methods=['POST'])
def register_user():
    username = request.json.get('username')
    password = request.json.get('password')
    role = request.json.get('role')
    email = request.json.get('email')

    if not username or not password or not role or not email:
        return jsonify({'error': 'Missing data!'}), 400

    # Example: Save user to MongoDB
    user = {
        'username': username,
        'password': password,  # You should hash the password before saving in production
        'role': role,
        'email': email
    }
    result = users_col.insert_one(user)

    # Assign ObjectId to user dictionary
    user['_id'] = str(result.inserted_id)

    return jsonify({'message': 'User registered successfully!', 'user': user}), 201


@app.route('/login', methods=['POST'])
def login_user():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({'error': 'Missing username or password!'}), 400

    # Example: Check credentials against MongoDB
    user = users_col.find_one({'username': username, 'password': password})

    if not user:
        return jsonify({'error': 'Invalid credentials!'}), 401

    # For demonstration, return user details on successful login
    # You should ideally generate a JWT token here for authentication
    user['_id'] = str(user['_id'])  # Convert ObjectId to string for JSON serialization
    return jsonify({'message': 'Logged in successfully!', 'user': user}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)
