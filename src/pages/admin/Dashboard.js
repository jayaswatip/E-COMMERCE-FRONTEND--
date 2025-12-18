import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Analytics from '../../components/Analytics';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    activeUsers: 0,
    conversionRate: 0,
    userGrowthPercentage: 0,
    productGrowthPercentage: 0,
    orderGrowthPercentage: 0,
    revenueGrowthPercentage: 0,
    lowStockItems: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Base URL - uses environment variable
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE_URL]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch dashboard statistics
      console.log('Fetching dashboard stats from:', `${API_BASE_URL}/api/dashboard/stats`);
      console.log('Token:', token ? 'Present' : 'Missing');
      
      const statsResponse = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Stats response status:', statsResponse.status);

      if (!statsResponse.ok) {
        const errorData = await statsResponse.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Stats error:', errorData);
        throw new Error(errorData.message || `Failed to fetch dashboard statistics (${statsResponse.status})`);
      }

      const statsData = await statsResponse.json();
      console.log('Stats data received:', statsData);
      setStats(statsData);

      // Fetch recent users
      const usersResponse = await fetch(`${API_BASE_URL}/api/dashboard/recent-users?limit=4`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!usersResponse.ok) {
        throw new Error('Failed to fetch recent users');
      }

      const usersData = await usersResponse.json();
      setRecentUsers(usersData);

      // Fetch recent activity
      const activityResponse = await fetch(`${API_BASE_URL}/api/dashboard/recent-activity?limit=4`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!activityResponse.ok) {
        throw new Error('Failed to fetch recent activity');
      }

      const activityData = await activityResponse.json();
      setRecentActivity(activityData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
      toast.error(`Failed to load dashboard data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered': return 'status-delivered';
      case 'Processing': return 'status-processing';
      case 'Shipped': return 'status-shipped';
      case 'Pending': return 'status-pending';
      case 'Active': return 'status-active';
      case 'Inactive': return 'status-inactive';
      default: return 'status-default';
    }
  };

  const StatCard = ({ title, value, icon, gradient, link, change }) => (
    <Link to={link} className="stat-card-link">
      <div className={`stat-card ${gradient}`}>
        <div className="stat-icon">{icon}</div>
        <div className="stat-content">
          <h3 className="stat-title">{title}</h3>
          <p className="stat-value">{value}</p>
          {change && (
            <div className={`stat-change ${change > 0 ? 'positive' : 'negative'}`}>
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );

  // Loading skeleton
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>Unable to load dashboard</h2>
            <p>{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="retry-button"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        {/* Welcome Header */}
        <div className="welcome-header">
          <div className="welcome-content">
            <div className="welcome-text">
              <h1 className="welcome-title">
                👑 Welcome back, {user?.name || 'Admin'}! 
                <span className="wave">👋</span>
              </h1>
              <p className="welcome-subtitle">Here's what's happening with your store today</p>
              <div className="welcome-stats">
                <span className="welcome-stat">📈 Revenue up 12.5% this month</span>
                <span className="welcome-date">📅 {new Date().toLocaleDateString()}</span>
              </div>
            </div>
            <div className="welcome-badge">
              <div className="admin-badge">
                <span className="badge-icon">⚡</span>
                <span className="badge-text">Admin Portal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon="👥"
            gradient="gradient-blue"
            link="/admin/users"
            change={stats.userGrowthPercentage}
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            icon="📦"
            gradient="gradient-green"
            link="/admin/orders"
            change={stats.orderGrowthPercentage}
          />
          <StatCard
            title="Products"
            value={stats.totalProducts.toLocaleString()}
            icon="🛍️"
            gradient="gradient-purple"
            link="/admin/products"
            change={stats.productGrowthPercentage}
          />
          <StatCard
            title="Revenue"
            value={`₹${(stats.totalRevenue / 1000).toFixed(0)}K`}
            icon="💰"
            gradient="gradient-gold"
            link="/admin/analytics"
            change={stats.revenueGrowthPercentage}
          />
        </div>

        {/* Additional Quick Stats */}
        <div className="quick-stats">
          <div className="quick-stat-item">
            <div className="quick-stat-icon">📊</div>
            <div className="quick-stat-info">
              <span className="quick-stat-label">Conversion Rate</span>
              <span className="quick-stat-value">{stats.conversionRate}%</span>
            </div>
          </div>
          <div className="quick-stat-item">
            <div className="quick-stat-icon">🎯</div>
            <div className="quick-stat-info">
              <span className="quick-stat-label">Active Users</span>
              <span className="quick-stat-value">{stats.activeUsers.toLocaleString()}</span>
            </div>
          </div>
          <div className="quick-stat-item">
            <div className="quick-stat-icon">⚠️</div>
            <div className="quick-stat-info">
              <span className="quick-stat-label">Low Stock</span>
              <span className="quick-stat-value">{stats.lowStockItems} items</span>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <Analytics />

        {/* Recent Activity - Combined View */}
        <div className="activity-grid">
          <div className="activity-card">
            <div className="activity-header">
              <h3 className="activity-title">
                <span className="activity-icon">📊</span>
                Recent Activity
              </h3>
              <Link to="/admin/users" className="view-all-btn">
                View All
              </Link>
            </div>
            <div className="activity-content">
              {recentUsers.length > 0 || recentActivity.length > 0 ? (
                <>
                  {/* Display Recent Users */}
                  {recentUsers.slice(0, 4).map((user) => (
                    <div key={`user-${user.id}`} className="activity-item">
                      <div className="activity-item-left">
                        <div className="activity-avatar user">{user.name.split(' ').map(n => n[0]).join('')}</div>
                        <div className="activity-details">
                          <p className="activity-title-text">New User</p>
                          <p className="activity-name">{user.name}</p>
                          <p className="activity-meta">{user.email}</p>
                        </div>
                      </div>
                      <div className="activity-item-right">
                        <p className="activity-time">{user.joinDate}</p>
                        <span className={`activity-badge ${getStatusClass(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Display Recent Activity */}
                  {recentActivity.slice(0, 4).map((activity) => (
                    <div key={`activity-${activity.id}`} className="activity-item">
                      <div className="activity-item-left">
                        <div className="activity-avatar activity">📊</div>
                        <div className="activity-details">
                          <p className="activity-title-text">{activity.type === 'user_registration' ? 'User Registration' : 'Activity'}</p>
                          <p className="activity-name">{activity.user}</p>
                          <p className="activity-meta">{activity.description}</p>
                        </div>
                      </div>
                      <div className="activity-item-right">
                        <p className="activity-time">{activity.time}</p>
                        <span className="activity-badge status-active">New</span>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="no-activity">
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3 className="section-title">
            🚀 Quick Actions
          </h3>
          <div className="actions-grid">
            <Link to="/admin/products/new" className="action-card action-green">
              <div className="action-icon">➕</div>
              <div className="action-content">
                <h4 className="action-title">Add Product</h4>
                <p className="action-description">Add a new product to your store</p>
              </div>
            </Link>
            <Link to="/admin/orders" className="action-card action-blue">
              <div className="action-icon">📋</div>
              <div className="action-content">
                <h4 className="action-title">Manage Orders</h4>
                <p className="action-description">View and update order status</p>
              </div>
            </Link>
            <Link to="/admin/users" className="action-card action-purple">
              <div className="action-icon">👨‍💼</div>
              <div className="action-content">
                <h4 className="action-title">User Management</h4>
                <p className="action-description">View and manage user accounts</p>
              </div>
            </Link>
            <Link to="/admin/analytics" className="action-card action-orange">
              <div className="action-icon">📈</div>
              <div className="action-content">
                <h4 className="action-title">Analytics</h4>
                <p className="action-description">View reports and insights</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer Message */}
        <div className="dashboard-footer">
          <div className="footer-content">
            <h4 className="footer-title">
              🎉 You're doing amazing! Keep up the great work! ⭐
            </h4>
            <p className="footer-subtitle">Your store is growing every day. Here's to continued success!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;