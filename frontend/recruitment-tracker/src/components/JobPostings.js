import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css'; // Import the CSS file

function JobPostingList() {
  const [jobPostings, setJobPostings] = useState([]);
  const [categories, setCategories] = useState({
    departments: [],
    locations: [],
    job_types: []
  });
  const [searchParams, setSearchParams] = useState({
    title: '',
    location: '',
    department: '',
    job_type: ''
  });

  useEffect(() => {
    fetchJobPostings();
    fetchCategories();
  }, []);

  const fetchJobPostings = async (params = {}) => {
    try {
      const response = await axios.get('http://localhost:5000/job_postings/search', { params });
      setJobPostings(response.data);
    } catch (error) {
      console.error('Error fetching job postings:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/job_postings/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobPostings(searchParams);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/job_postings/delete/${id}`);
      if (response.status === 200) {
        alert('Job posting deleted successfully.');
        setJobPostings((prevJobPostings) => prevJobPostings.filter((job) => job._id !== id));
      } else {
        alert('Failed to delete job posting.');
      }
    } catch (error) {
      console.error('Error deleting job posting:', error);
      alert('Error deleting job posting. Please try again.');
    }
  };

  const handleEdit = (id) => {
    // Navigate to edit page using basic HTML link
    window.location.href = `/edit-job-posting/${id}`;
  };

  return (
    <div className="table-container">
      <h2>Job Postings</h2>
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <input
            type="text"
            id="title"
            name="title"
            value={searchParams.title}
            onChange={handleInputChange}
            placeholder="Search by title"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="location"
            name="location"
            value={searchParams.location}
            onChange={handleInputChange}
            placeholder="Search by location"
          />
        </div>
        <div className="form-group">
          <select
            id="department"
            name="department"
            value={searchParams.department}
            onChange={handleInputChange}
          >
            <option value="">Select Department</option>
            {categories.departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept._id}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <select
            id="job_type"
            name="job_type"
            value={searchParams.job_type}
            onChange={handleInputChange}
          >
            <option value="">Select Job Type</option>
            {categories.job_types.map((type) => (
              <option key={type._id} value={type._id}>
                {type._id}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Search</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Department</th>
            <th>Location</th>
            <th>Job Type</th>
            <th>Description</th>
            <th>Application Deadline</th>
            <th>Category</th>
            <th>Visibility</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobPostings.map((job) => (
            <tr key={job._id}>
              <td>{job.title}</td>
              <td>{job.department}</td>
              <td>{job.location}</td>
              <td>{job.jobType}</td>
              <td>{job.description}</td>
              <td>{new Date(job.application_deadline).toLocaleDateString()}</td>
              <td>{job.category}</td>
              <td>{job.visibility_status ? 'Visible' : 'Hidden'}</td>
              <td>
                <button onClick={() => handleDelete(job._id)}>Delete</button>
                <button onClick={() => handleEdit(job._id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobPostingList;
