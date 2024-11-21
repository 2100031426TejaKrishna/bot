import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileIcon = () => {
  const { logout } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const menuToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
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
  );
};

export default ProfileIcon;
