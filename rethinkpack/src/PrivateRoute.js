// src/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children, redirectPath = '/login' }) => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    // Optionally, render a loading spinner or placeholder here
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to={redirectPath} />;
};

export default PrivateRoute;
