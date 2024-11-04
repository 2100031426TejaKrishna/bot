import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const { logout } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const menuToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="dashboard-container">
      <div className="profile-action">
        <div className="profile" onClick={menuToggle}>
        <span role="img" aria-label="Profile Icon">👤</span>
        </div>
        {isDropdownOpen && (
          <div className="menu active">
            <ul>
              <li><a href="/profile">My Profile</a></li>
              <li><a href="/editprofile">Edit Profile</a></li>
              <li><a href="/" onClick={handleLogout}>Logout</a></li>
            </ul>
          </div>
        )}
      </div>
      <div className="welcome-message">
        <h1>Welcome, Customer</h1>
      </div>
      <div className="card">
        <h2>Get Started with Your Survey</h2>
        <button onClick={() => (window.location.href = '/customer')}>Start Survey</button><br></br>
        <button onClick={() => (window.location.href = '/#')}>Resume Survey</button>

      </div>
    </div>
  );
};

export default CustomerDashboard;
