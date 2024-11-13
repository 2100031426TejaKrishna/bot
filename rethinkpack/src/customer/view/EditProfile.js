import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import './EditProfile.css';

const EditProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate(); // Set up navigation

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      const storedEmail = localStorage.getItem('customerEmail');
      if (!storedEmail) {
        setError('No email found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/allCustomers');
        if (!response.ok) throw new Error('Error fetching profile data');

        const allCustomers = await response.json();
        const customer = allCustomers.find((cust) => cust.email === storedEmail);

        if (customer) {
          setName(customer.name || '');
          setEmail(customer.email || '');
          setPhone(customer.phone || '');
          setAddress(customer.address || '');
        } else {
          setError('Customer not found');
        }
      } catch (error) {
        console.error(error);
        setError('Could not load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerProfile();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/customerProfile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          phone,
          address,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message || 'Profile updated successfully!');
        setError(null);
      } else {
        setError(result.message || 'Failed to update profile data');
      }
    } catch (error) {
      console.error('Error saving profile data:', error);
      setError('Error saving profile data');
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="edit-profile-container">
      <h2 className="edit-profile-heading">Update Your Profile</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form className="edit-profile-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            readOnly // Locking the email field
            style={{ cursor: 'not-allowed' }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="button-container">
          <button
            className="update-button"
            type="button"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Update Profile'}
          </button>
          <button className="back-link" onClick={() => navigate('/customer-dashboard')}>
            &larr; Back to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
