import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '', address: '' });
  const [assessmentStatus, setAssessmentStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setError(response.status === 404 ? 'Customer not found' : 'Error fetching profile data');
          return;
        }

        const allCustomers = await response.json();
        const customer = allCustomers.find((cust) => cust.email === email);

        if (customer) {
          setProfileData({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
          });
          setAssessmentStatus(customer.assessmentStatus || false);
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
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  }

  return (
    <div style={styles.profileUniqueContainer}>
      <div style={styles.profileUniqueCard}>
        <div style={styles.profileUniqueAvatar}>
          <img
            src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQDw8QDxEPDhEQEA0QEA0QDQ8NDxAQFhEWFhURExUZHSggGBolGxUTITEiJSkrLi4uFx8zODMsNygtLisBCgoKDQ0NDg0NDysZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEBAAMBAQEAAAAAAAAAAAAABAIDBQEGB//EAC4QAQABAwIEBAUEAwAAAAAAAAABAgMRBCExUWFxEkGRsSIygaHwQlKS0QXB4f/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A/cQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABqrvxHXs01aifLEfcFYgm5M+c+rEHRHOZRXMec+oLxHTqKu7dRqInjt7A3AAAAAAAAAAAAAAAAAAA13rvh78ge3LkU8fRLcuzPSOTCqc7y8VAABrqvUx5+m7RfvZ2jh7tALqb9M+frs2Oa22bs09uX9AtCJAZ27k08PTyVWrsVdJ5IiJB0RpsXs7Tx925FAAAAAAAAAAAAAAYXa/DGfRFVOZzLO9c8U9I4NagAINWprxT32bUusneI6fnsCcAAAFekr2mOXs3otLPxR1ytAAAiVtm54o6xxRMrdeJz+YBePInL1FAAAAAAAAAAGrUV4p77NqTVVfFjkDSAqAACTV/N9I95VptZTwn6fn3BMAAADZp/mj6+y5JpKd5nlCsAAAAFWlr2xy9m9FYqxVHXZaigAAAAAAAAACC5Oap7yvc4ABUAAGNyjMTDIBzpjG0vF16zFXSeaWqxVHlntuDWNlNmqfKfrsos2PDvO8/aAZWLfhjrxlsAAAAACJdGHOX2/ljtHsisgAAAAAAAAAHOdFBcjEz3kGICoAAAwuXYp48eQMxHXqKp4bNc1zzn1B0BzoqnnPq2UaiqOvcFo12r0VdJ5NgAAAAC+38sdo9kDoRCK9AAAAAAAAAAR6mn4u6xp1NOYzy9gSAKgDC9c8MZ8/IGF+9jaOPskmSZeAAAAAKtPfztP0lKA6Q1ae54o34x+ZbQAAZ2ac1R6rk+ko4z9IUIoAAAAAAAAAAACG7R4Zx6dmC29b8UdfJFMKgi1Neau2yu7XiJn8y54AAAAAAAAM7VeJifXsvc1bp680x02Bte0U5nEPFentYjM8Z+wNtMYjD0EUAAAAAAAAAAAAab9nO8cfduAcXWVbxTy3lM7Wq0lNe/Cr939uVfsVUTiqO0+U/VUagAAAAAAAG7S14qxz92Fq1VVOKYz/AK7urpNFFG9XxVfaOwM7FnG8/SFAIoAAAAAAAAAAAAAAAA8qpiYxMRMcp3egIb3+NpnemfD0neEVzRXKf05607/9dsB87MY47d9nj6KYzx3YTYo/bT/GAcAh34sUfsp/jDOKYjhER2jAOJb0lyrhTMdZ+FZZ/wAZH65z0jaPV0AGNuiKYxTERHKGQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//2Q=="
            alt="Profile Avatar"
            style={styles.profileImage}
          />
          <h2>{profileData.name}</h2>
        </div>
        <div style={styles.profileUniqueDetails}>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Phone:</strong> {profileData.phone}</p>
          <p><strong>Address:</strong> {profileData.address}</p>
          <p><strong>Assessment Status:</strong> {assessmentStatus ? 'Yes' : 'No'}</p>
          <button
  onClick={() => window.location.href = "/responses"}
  style={styles.profileUniqueReportButton}
>
  View Report
</button>        <br />
        <a href="/customer-dashboard" style={styles.profileUniqueBackLink}>← Back to Dashboard</a>
      </div>
      </div>

    </div>
  );
};

const styles = {
  profileUniqueContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'url("https://img.freepik.com/free-photo/abstract-textured-backgound_1258-30495.jpg?t=st=1730876780~exp=1730880380~hmac=35513278afabd616bb0010fb07c7d9d7699f038d0b1fbf9236133ad09135c295&w=740")',

    margin: 0,
    fontFamily: 'Arial, sans-serif',
  },
  profileUniqueCard: {
    background: 'url("https://img.freepik.com/free-photo/abstract-luxury-gradient-blue-background-smooth-dark-blue-with-black-vignette-studio-banner_1258-72581.jpg?t=st=1730876611~exp=1730880211~hmac=e7da8f115f30f3649e04ef771f0e5a3252c5386637de63fad026122c2b34f1cc&w=740") no-repeat center center',
    backgroundSize: 'cover',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    width: '600px',
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'left',
  },
  profileUniqueAvatar: {
    marginRight: '20px',
    textAlign: 'center',
    flexShrink: 0,
  },
  profileImage: {
    borderRadius: '50%',
    width: '150px',
    height: '150px',
    marginBottom: '10px',
  },
  profileUniqueDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  profileUniqueReportButton: {
    backgroundColor: '#c7c7ed',
    color: '#131314',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 8px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  profileUniqueBackLink: {
    display: 'inline-block',
    marginTop: '10px',
    fontSize: '16px',
    textDecoration: 'none',
    color: '#131314',
  }
};


export default Profile;
