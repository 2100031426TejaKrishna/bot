// src/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children, redirectPath }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to={redirectPath} />;
};

export default PrivateRoute;
