import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const { logout } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      const email = localStorage.getItem('customerEmail');
      if (!email) {
        console.error('No email found in local storage');
        setError('No email found. Please log in again.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/allCustomers`);
        if (!response.ok) {
          setError(response.status === 404 ? 'Customer not found' : 'Error fetching profile data');
          return;
        }

        const allCustomers = await response.json();
        const foundCustomer = allCustomers.find((cust) => cust.email === email);
        if (foundCustomer) {
          setCustomer(foundCustomer);
        } else {
          setError('Customer not found');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Could not load profile data');
      }
    };

    fetchCustomerProfile();
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const menuToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Background video */}
      <video className="dashboard-video" autoPlay loop muted>
        <source src="https://cdn.pixabay.com/video/2022/06/13/120172-720504774_large.mp4" type="video/mp4" />
      </video>

      <div className="profile-action">
        <div className="profile" onClick={menuToggle}>
          <span role="img" aria-label="Profile Icon">👤</span>
        </div>
        {isDropdownOpen && (
          <div className="menu active">
            <ul>
              <li><a href="/profile">My Profile</a></li>
              <li><a href="/editprofile">Update Profile</a></li>
              <li><a href="/" onClick={handleLogout}>Logout</a></li>
            </ul>
          </div>
        )}
      </div>

      <div className="welcome-message">
        <h1>Welcome {customer ? customer.name : 'Customer'} !</h1>
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="card">
        <h2>Get Started with Your Assessment</h2>
        <button onClick={() => (window.location.href = '/customer')}>Start Assessment</button><br />
        <button onClick={() => (window.location.href = '/#')}>Resume Assessment</button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
