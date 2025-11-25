import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return isAdmin() ? children : <Navigate to="/" />;
};

export default AdminRoute;
