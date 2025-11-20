import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin (email is admin@gmail.com)
  if (user.email !== 'admin@gmail.com') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need admin privileges to access this area.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // If user is admin, render the admin routes
  return (
    <div className="admin-layout">
      {/* Admin Header */}
      <header className="bg-gray-800 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user.name || user.email}</span>
            <span className="bg-red-500 px-3 py-1 rounded-full text-xs font-bold">
              ADMIN
            </span>
          </div>
        </div>
      </header>
      
      {/* Admin Content */}
      <Outlet />
    </div>
  );
};

export default AdminRoute;