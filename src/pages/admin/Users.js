import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: currentUser } = useAuth();

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API_BASE}/api/users`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        
        if (data.success) {
          setUsers(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch users');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [API_BASE]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`${API_BASE}/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      const data = await response.json();
      
      if (data.success) {
        // Update the user in the local state
        setUsers(users.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        ));
      } else {
        throw new Error(data.message || 'Failed to update user role');
      }
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(err.message);
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          You don't have permission to access this page.
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="admin-users">
      <div className="admin-header">
        <h2>Manage Users</h2>
        <p>View and manage all registered users</p>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Last Login</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name || 'N/A'}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role || 'user'}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="form-select form-select-sm"
                    disabled={user._id === currentUser._id}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                <td>{user.totalOrders || 0}</td>
                <td>₹{(user.totalSpent || 0).toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {/* Implement delete user */}}
                    disabled={user.role === 'admin' || user._id === currentUser._id}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
