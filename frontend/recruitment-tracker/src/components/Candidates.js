import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  
  
  const [searchParams, setSearchParams] = useState({
    name: '',
    email: '',
    job_title: '',
    application_status: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);
  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/candidates/search', { params: searchParams });
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Error fetching candidates. Please try again later.');
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    fetchCandidates();
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get_candidates');
        setCandidates(response.data);
      } catch (error) {
        console.error("There was an error fetching the candidates!", error);
        setError("There was an error fetching the candidates. Please try again later.");
      }
    };

    fetchCandidates();
  }, []);

  return (
    <div className="table-container">
      <h2>Candidates</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSearch} className="search-form">
        
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            value={searchParams.email}
            onChange={handleInputChange}
            placeholder="Search by email"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="job_posting_id"
            name="job_posting_id"
            value={searchParams.job_posting_id}
            onChange={handleInputChange}
            placeholder="Search by job posting id"
          />
        </div>
       
        <button type="submit">Search</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Job Posting ID</th>
            <th>Application Status</th>
            <th>Interview Schedule</th>
            <th>Resume</th>
            <th>Documents</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate._id}>
              <td>{candidate.name}</td>
              <td>{candidate.email}</td>
              <td>{candidate.phone}</td>
              <td>{candidate.job_posting_id}</td>
              <td>{candidate.application_status}</td>
              
              <td>
  {candidate.interview_schedule 
    ? new Date(candidate.interview_schedule).toLocaleDateString() 
    : 'No Date Scheduled'}
</td>

              <td>
                {/* Assuming the resume is stored as a base64-encoded string */}
                <a href={`data:application/pdf;base64,${candidate.resume}`} download="resume.pdf">
                  Download Resume
                </a>
              </td>
              <td>
                
                <a href={`data:application/pdf;base64,${candidate.documents}`} download="{`document_${index + 1}.pdf`}">
                  Download Document
                </a>
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Candidates;
