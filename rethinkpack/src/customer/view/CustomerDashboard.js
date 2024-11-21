import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
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

  const menuToggle = (event) => {
    if (event.type === 'click' || event.key === 'Enter') {
      setDropdownOpen(!isDropdownOpen);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Transparent Navbar */}<br></br>
      <nav className="transparent-navbar">
        <div className="navbar-left">
          <button onClick={() => navigate('/subscribe')} className="navbar-btn">
            Subscribe
          </button>
          <button onClick={() => navigate('/contact')} className="navbar-btn">
            Contact Us
          </button>
        </div>
        <div className="navbar-right">
          <div
            className="profile"
            onClick={menuToggle}
            tabIndex={0}
            role="button"
            aria-label="Profile"
          >
            👤
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
      </nav>

      {/* Background video */}
      <video className="dashboard-video" autoPlay loop muted>
        <source src="https://cdn.pixabay.com/video/2022/06/13/120172-720504774_large.mp4" type="video/mp4" />
      </video>

      {/* Welcome Message */}
      <div className="welcome-message">
        <h1>Welcome {customer ? customer.name : 'Customer'} !</h1>
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Card Section */}
      <div className="card">
        <h2>Get Started with Your Assessment</h2>
        <button onClick={() => navigate('/customer')}>Start Assessment</button><br />
        <button onClick={() => navigate('/#')}>Resume Assessment</button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
