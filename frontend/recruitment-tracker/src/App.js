import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import JobPostings from './components/JobPostings';
import CreateJobPosting from './components/CreateJobPosting';
import EditJobPosting from './components/EditJobPosting'; // Import EditJobPosting component
import Candidates from './components/Candidates';
import CreateCandidate from './components/CreateCandidate';
import Analytics from './components/Analytics';
import Home from './components/Home';



import './App.css'; // Import your CSS file

function AppRouter() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/jobpostings">Job Postings</Link>
            </li>
            <li className="nav-item">
              <Link to="/createjobposting">Create Job Posting</Link>
            </li>
            <li className="nav-item">
              <Link to="/candidates">Candidates</Link>
            </li>
            <li className="nav-item">
              <Link to="/createcandidate">Create Candidate</Link>
            </li>
            <li className="nav-item">
              <Link to="/analytics">Analytics</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/home" element={<Home />}  />
          
          <Route path="/jobpostings" element={<JobPostings />} />
          <Route path="/createjobposting" element={<CreateJobPosting />} />
          <Route path="/editjobposting/:id" element={<EditJobPosting />} /> {/* New route for editing job postings */}
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/createcandidate" element={<CreateCandidate />} />
          <Route path="/analytics" element={<Analytics />} />
          
      
        </Routes>
      </div>
    </Router>
  );
}



export default AppRouter;
