// ApplicationForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApplicationForm = ({ candidateId }) => {
  const [statuses, setStatuses] = useState([]);
  const [statusId, setStatusId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await axios.get('/statuses');
        setStatuses(response.data);
      } catch (error) {
        console.error('Error fetching statuses:', error);
      }
    };

    fetchStatuses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/candidates/${candidateId}/applications`, { status_id: statusId, notes });
      alert('Application added successfully');
      setStatusId('');
      setNotes('');
    } catch (error) {
      console.error('Error adding application:', error);
      alert('Failed to add application');
    }
  };

  return (
    <div>
      <h3>Add Application</h3>
      <form onSubmit={handleSubmit}>
        <select value={statusId} onChange={(e) => setStatusId(e.target.value)} required>
          <option value="">Select Status</option>
          {statuses.map(status => (
            <option key={status.id} value={status.id}>{status.status}</option>
          ))}
        </select>
        <textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button type="submit">Add Application</button>
      </form>
    </div>
  );
};

export default ApplicationForm;
