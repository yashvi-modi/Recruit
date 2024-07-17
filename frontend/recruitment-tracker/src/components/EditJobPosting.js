import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function EditJobPosting() {
  const { id } = useParams();
  const [jobPosting, setJobPosting] = useState({
    title: '',
    department: '',
    location: '',
    jobType: '',
    description: '',
    application_deadline: '',
    category: '',
    visibility_status: false
  });

  // Use useEffect to fetch job posting details based on id
  useEffect(() => {
    const fetchJobPosting = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/job_postings/${id}`);
        setJobPosting(response.data);
      } catch (error) {
        console.error('Error fetching job posting:', error);
      }
    };

    fetchJobPosting(); // Invoke the fetchJobPosting function
  }, [id]); // Include id in the dependency array

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobPosting({ ...jobPosting, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/job_postings/update/${id}`, jobPosting);
      if (response.status === 200) {
        alert('Job posting updated successfully.');
        // Redirect or handle navigation after successful update
      } else {
        alert('Failed to update job posting.');
      }
    } catch (error) {
      console.error('Error updating job posting:', error);
      alert('Error updating job posting. Please try again.');
    }
  };

  return (
    <div className="edit-job-posting-container">
      <h2>Edit Job Posting</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={jobPosting.title} onChange={handleInputChange} />
        </div>
        <div>
          <label>Department:</label>
          <input type="text" name="department" value={jobPosting.department} onChange={handleInputChange} />
        </div>
        <div>
          <label>Location:</label>
          <input type="text" name="location" value={jobPosting.location} onChange={handleInputChange} />
        </div>
        <div>
          <label>Job Type:</label>
          <input type="text" name="jobType" value={jobPosting.jobType} onChange={handleInputChange} />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={jobPosting.description} onChange={handleInputChange} />
        </div>
        <div>
          <label>Application Deadline:</label>
          <input type="date" name="application_deadline" value={jobPosting.application_deadline} onChange={handleInputChange} />
        </div>
        <div>
          <label>Category:</label>
          <input type="text" name="category" value={jobPosting.category} onChange={handleInputChange} />
        </div>
        <div>
          <label>Visibility:</label>
          <input type="checkbox" name="visibility_status" checked={jobPosting.visibility_status} onChange={() => setJobPosting({ ...jobPosting, visibility_status: !jobPosting.visibility_status })} />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default EditJobPosting;
