import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  // Check if user is authenticated and has admin role
  if (!user || !user.isAdmin) {
    // Redirect to login or home page if not admin
    return <Navigate to="/" replace />;
  }

  // If user is admin, render the child routes
  return <Outlet />;
};

export default AdminRoute;
