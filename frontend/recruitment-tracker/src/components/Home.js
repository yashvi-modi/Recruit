
import { Link } from 'react-router-dom';
import axios from 'axios';
import React, { useState } from 'react';
import './style.css'; // Import your CSS file for styling

function Home() {
    const [loggedIn] = useState(false); // Define loggedIn state
  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = {
      username: e.target.username.value,
      password: e.target.password.value,
      role: e.target.role.value,
      email: e.target.email.value
    };

    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      console.log('Registration successful:', response.data);
      alert("registered!!")
      // Handle success, e.g., redirect to login page
    } catch (error) {
      console.error('Error registering user:', error);
      // Handle error, e.g., show error message to user
    }
  };
  const sendReminderEmail = async () => {
    try {
        const response = await axios.post('http://localhost:5000/send-reminder-email', { /* email parameters */ });
        console.log('Email sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Logged in successfully!');
        // Optionally, you can redirect to another page after successful login
        // window.location.href = '/dashboard'; // Example redirection
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in. Please try again later.');
    }
  };

  return (
    <div className="container">
     
        <div className="login-section">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
        </div>

      <div className="create-account-section">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          <input type="text" name="username" placeholder="Username" required />
          <input type="password" name="password" placeholder="Password" required />
          <input type="text" name="role" placeholder="Role" required />
          <input type="email" name="email" placeholder="Email" required />
          <button type="submit" onClick={sendReminderEmail}>Register</button>
        </form>
      </div>

      <div className="new-user-section">
        <p>Don't have an account? </p>
      </div>

      
    </div>
  );
}

export default Home;
