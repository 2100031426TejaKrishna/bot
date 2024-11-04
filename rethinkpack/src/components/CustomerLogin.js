import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './CustomerLogin.css';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState(''); // New state for address
  const [phone, setPhone] = useState(''); // New state for phone number
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState(''); // New state for phone error
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }

    if (password && password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
    } else {
      setPasswordError('');
    }

    if (isSignUp && confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }

    if (isSignUp && name.trim() === '') {
      setNameError('Name is required');
    } else {
      setNameError('');
    }

    if (isSignUp && phone && !/^\d{10}$/.test(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number');
    } else {
      setPhoneError('');
    }
  }, [email, password, confirmPassword, isSignUp, name, phone]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (emailError || passwordError) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/customerLogin?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      const result = await response.json();

      if (result.success) {
        login('customer');
        localStorage.setItem('customerEmail', email);
        navigate('/customer-dashboard');
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed');
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (emailError || passwordError || confirmPasswordError || nameError || phoneError) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/customerSignup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, address, phone }), 
      });
      const result = await response.json();

      if (result.success) {
        alert('Signup successful, please login.');
        setIsSignUp(false);
      } else {
        alert(result.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Signup failed');
    }
  };

  return (
    <div className="customer-login-container">
      <h2>{isSignUp ? 'Customer Signup' : 'Customer Login'}</h2>
      <form onSubmit={isSignUp ? handleSignUpSubmit : handleLoginSubmit}>
        {isSignUp && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {nameError && <p className="error-message">{nameError}</p>}
            
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            {phoneError && <p className="error-message">{phoneError}</p>}
          </>
        )}
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
        {passwordError && <p className="error-message">{passwordError}</p>}
        {isSignUp && (
          <>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
          </>
        )}
        <button type="submit">{isSignUp ? 'Signup' : 'Login'}</button>
      </form>
      <p>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Login' : 'Sign up'}
        </button>
      </p>
    </div>
  );
};

export default CustomerLogin;
