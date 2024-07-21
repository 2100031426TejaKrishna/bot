// src/components/AdminLogin.js
import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './AdminLogin.css';



const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    } else {
      setEmailError('');
    }

    try {
      //for server -https and change to http  for local machine

      const response = await fetch(`https://localhost:5000/api/adminLogin?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      const result = await response.json();

      if (result.success) {
        login('admin');
        navigate('/admin');
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed');
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {emailError && <p className="error-message">{emailError}</p>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
