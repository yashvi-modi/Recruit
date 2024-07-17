import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function CreateCandidate() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    documents: [],
    job_posting_id: '',
    application_status: '',
    interview_schedule: ''
  });

  const [jobPostings, setJobPostings] = useState([]);

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/job_postings');
        setJobPostings(response.data);
      } catch (error) {
        console.error('Error fetching job postings:', error);
      }
    };
    fetchJobPostings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'resume') {
      setFormData({ ...formData, resume: files[0] });
    } else if (name === 'documents') {
      setFormData({ ...formData, documents: files });
    }
  };

  const handleInterviewDateChange = (date) => {
    setFormData({ ...formData, interview_date: date });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/candidates/add', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        alert('Candidate added successfully!');
      } else {
        console.error('Error adding candidate:', response.statusText);
        alert('Error adding candidate. Please try again.');
      }
    } catch (error) {
      console.error('Error adding candidate:', error.message);
      alert('Error adding candidate. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Create Candidate</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="resume">Resume:</label>
          <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <label htmlFor="documents">Additional Documents:</label>
          <input type="file" id="documents" name="documents" multiple accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <label htmlFor="job_posting_id">Job Posting:</label>
          <select id="job_posting_id" name="job_posting_id" value={formData.job_posting_id} onChange={handleChange} required>
            <option value="">Select a Job Posting</option>
            {jobPostings.map((job) => (
              <option key={job._id} value={job._id}>{job.title}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="application_status">Application Status:</label>
          <input type="text" id="application_status" name="application_status" value={formData.application_status} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="interview_date">Interview Date:</label>
          <DatePicker
            id="interview_date"
            name="interview_date"
            selected={formData.interview_date}
            onChange={handleInterviewDateChange}
            dateFormat="yyyy-MM-dd"
            isClearable
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            placeholderText="Select interview date"
            className="form-control"
          />
        </div>
        <button type="submit" className="btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default CreateCandidate;
