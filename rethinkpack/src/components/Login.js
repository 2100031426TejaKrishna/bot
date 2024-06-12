import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <h2>Login as</h2>
      <div className="button-group">
        <button className="login-button" onClick={() => navigate('/admin-login')}>Admin</button>
        <button className="login-button" onClick={() => navigate('/customer-login')}>Customer</button>
      </div>
    </div>
  );
};

export default Login;
