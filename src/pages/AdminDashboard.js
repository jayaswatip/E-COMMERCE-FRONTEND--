import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if not admin
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Admin Cards */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Welcome, {user?.name || 'Admin'}</h2>
              <p className="text-blue-600">Manage your e-commerce platform</p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
              <h2 className="text-lg font-semibold text-green-800 mb-2">Quick Actions</h2>
              <ul className="space-y-2">
                <li>
                  <button className="text-green-700 hover:underline">View All Users</button>
                </li>
                <li>
                  <button className="text-green-700 hover:underline">Manage Products</button>
                </li>
                <li>
                  <button className="text-green-700 hover:underline">View Orders</button>
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
              <h2 className="text-lg font-semibold text-purple-800 mb-2">Statistics</h2>
              <div className="space-y-2">
                <p className="text-purple-700">Total Users: <span className="font-medium">1,234</span></p>
                <p className="text-purple-700">Total Products: <span className="font-medium">567</span></p>
                <p className="text-purple-700">Total Orders: <span className="font-medium">89</span></p>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">New user registered</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">user@example.com</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 minutes ago</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Order #12345 placed</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">customer@example.com</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10 minutes ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
