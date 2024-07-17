import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto'; 

function Analytics() {
  const [metrics, setMetrics] = useState({
    number_of_applicants: 0,
    applications_done: 0,
    applications_in_progress: 0,
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const [applicantsRes, doneRes, inProgressRes] = await Promise.all([
        axios.get('http://localhost:5000/metrics/number_of_applicants'),
        axios.get('http://localhost:5000/metrics/applications_done'),
        axios.get('http://localhost:5000/metrics/applications_in_progress')
      ]);

      setMetrics({
        number_of_applicants: applicantsRes.data.number_of_applicants,
        applications_done: doneRes.data.applications_done,
        applications_in_progress: inProgressRes.data.applications_in_progress
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const applicantData = {
    labels: ['Number of Applicants'],
    datasets: [{
      label: 'Number of Applicants',
      data: [metrics.number_of_applicants],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const applicationStatusData = {
    labels: ['Applications Done', 'Applications In Progress'],
    datasets: [{
      label: 'Application Status',
      data: [metrics.applications_done, metrics.applications_in_progress],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="analytics-container">
      <h2>Recruitment Metrics</h2>
      <div className="chart-container">
        <h3>Number of Applicants</h3>
        <Bar data={applicantData} />
      </div>
      <div className="chart-container">
        <h3>Application Status</h3>
        <Pie data={applicationStatusData} />
      </div>
    </div>
  );
}

export default Analytics;
