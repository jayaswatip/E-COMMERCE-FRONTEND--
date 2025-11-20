import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalUsers: 1247,
          totalOrders: 856,
          totalProducts: 234,
          totalRevenue: 125000
        });

        setRecentOrders([
          { id: 'ORD001', customer: 'John Smith', amount: 1299.99, status: 'Delivered', date: '2024-09-10', product: 'MacBook Pro' },
          { id: 'ORD002', customer: 'Sarah Johnson', amount: 2499.99, status: 'Processing', date: '2024-09-12', product: 'iPhone 15 Pro' },
          { id: 'ORD003', customer: 'Mike Davis', amount: 189.99, status: 'Shipped', date: '2024-09-11', product: 'AirPods Pro' },
          { id: 'ORD004', customer: 'Emma Wilson', amount: 89.99, status: 'Pending', date: '2024-09-13', product: 'Apple Watch' },
        ]);

        setRecentUsers([
          { id: 1, name: 'John Smith', email: 'john@email.com', joinDate: '2024-01-15', status: 'Active' },
          { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', joinDate: '2024-02-03', status: 'Active' },
          { id: 3, name: 'Mike Davis', email: 'mike@email.com', joinDate: '2024-01-28', status: 'Inactive' },
          { id: 4, name: 'Emma Wilson', email: 'emma@email.com', joinDate: '2024-03-05', status: 'Active' },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
              <span className="change-arrow">{change > 0 ? '↗' : '↘'}</span>
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
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
            change={8.5}
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            icon="📦"
            gradient="gradient-green"
            link="/admin/orders"
            change={15.3}
          />
          <StatCard
            title="Products"
            value={stats.totalProducts.toLocaleString()}
            icon="🛍️"
            gradient="gradient-purple"
            link="/admin/products"
            change={12.1}
          />
          <StatCard
            title="Revenue"
            value={`₹${(stats.totalRevenue / 1000).toFixed(0)}K`}
            icon="💰"
            gradient="gradient-gold"
            link="/admin/analytics"
            change={22.4}
          />
        </div>

        {/* Additional Quick Stats */}
        <div className="quick-stats">
          <div className="quick-stat-item">
            <div className="quick-stat-icon">📊</div>
            <div className="quick-stat-info">
              <span className="quick-stat-label">Conversion Rate</span>
              <span className="quick-stat-value">3.2%</span>
            </div>
          </div>
          <div className="quick-stat-item">
            <div className="quick-stat-icon">🎯</div>
            <div className="quick-stat-info">
              <span className="quick-stat-label">Active Users</span>
              <span className="quick-stat-value">856</span>
            </div>
          </div>
          <div className="quick-stat-item">
            <div className="quick-stat-icon">⚠️</div>
            <div className="quick-stat-info">
              <span className="quick-stat-label">Low Stock</span>
              <span className="quick-stat-value">7 items</span>
            </div>
          </div>
        </div>

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
              {/* Display Recent Users */}
              {recentUsers.map((user) => (
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
              
              {/* Display Recent Orders */}
              {recentOrders.map((order) => (
                <div key={`order-${order.id}`} className="activity-item">
                  <div className="activity-item-left">
                    <div className="activity-avatar activity">🛒</div>
                    <div className="activity-details">
                      <p className="activity-title-text">Order</p>
                      <p className="activity-name">{order.customer}</p>
                      <p className="activity-meta">{order.product} • ₹{order.amount}</p>
                    </div>
                  </div>
                  <div className="activity-item-right">
                    <p className="activity-time">{order.date}</p>
                    <span className={`activity-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
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
                <p className="action-.description">View and manage user accounts</p>
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
