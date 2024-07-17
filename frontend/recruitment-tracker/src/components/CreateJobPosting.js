import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css'; // Import your CSS file

function CreateJobPosting() {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    jobType: 'fulltime',
    description: '',
    application_deadline: '',
    category: '',
    visibility_status: true,
  });

  const [jobPostings, setJobPostings] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/job_postings/add', formData);
      if (response.status === 200) {
        console.log('Job posting created successfully:', response.data);
        alert('Job posting created successfully!');
        setFormData({
          title: '',
          department: '',
          location: '',
          jobType: 'fulltime',
          description: '',
          application_deadline: '',
          category: '',
          visibility_status: true,
        });
        
      } else {
        console.error('Failed to create job posting:', response.status);
        alert('Failed to create job posting.');
      }
    } catch (error) {
      console.error('Error creating job posting:', error);
      alert('Error creating job posting. Please try again.');
    }
  };

  

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/job_postings/delete/${id}`);
      if (response.status === 200) {
        alert('Job posting deleted successfully.');
        
      } else {
        alert('Failed to delete job posting.');
      }
    } catch (error) {
      console.error('Error deleting job posting:', error);
      alert('Error deleting job posting. Please try again.');
    }
  };

  useEffect(() => {
    
  }, []);

  return (
    <div className="form-container">
      <h2>Create Job Posting</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Job Title:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="jobType">Job Type:</label>
          <select id="jobType" name="jobType" value={formData.jobType} onChange={handleChange}>
            <option value="fulltime">Full-time</option>
            <option value="parttime">Part-time</option>
            <option value="contract">Contract</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Job Description:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="application_deadline">Application Deadline:</label>
          <input type="date" id="application_deadline" name="application_deadline" value={formData.application_deadline} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="visibility_status">Visibility Status:</label>
          <input type="checkbox" id="visibility_status" name="visibility_status" checked={formData.visibility_status} onChange={(e) => setFormData({...formData, visibility_status: e.target.checked})} />
        </div>
        <button type="submit" className="btn-primary">Submit</button>
      </form>

      
    </div>
  );
}

export default CreateJobPosting;
