import React, { useEffect, useState } from 'react';
import './profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      const email = localStorage.getItem('customerEmail');
      if (!email) {
        console.error('No email found in local storage');
        setError('No email found. Please log in again.');
        setLoading(false);
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:5000/api/allCustomers`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Customer not found');
          } else {
            setError('Error fetching profile data');
          }
          return;
        }
  
        const allCustomers = await response.json();
        const customer = allCustomers.find((cust) => cust.email === email);
  
        if (customer) {
          setProfileData({ name: customer.name, email: customer.email });
        } else {
          setError('Customer not found');
        }
      } catch (error) {
        console.error('Error fetching customer profile:', error);
        setError('Error fetching profile data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCustomerProfile();
  }, []);
  

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <center>
      <div className="profile-container">
        <h1>My Profile</h1>
        <p><strong>Name:</strong> {profileData.name}</p>
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Phone:</strong> {profileData.phone || 'N/A'}</p>
        <p><strong>Address:</strong> {profileData.address || 'N/A'}</p>
        <button onClick={() => (window.location.href = '/customer-dashboard')} className="edit-button">Dashboard</button>
      </div>
    </center>
  );
};

export default Profile;
