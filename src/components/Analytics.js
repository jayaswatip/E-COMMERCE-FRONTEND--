import React, { useState, useEffect } from 'react';
import './Analytics.css';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, [timeRange]);

  const getTotalRevenue = () => {
    const revenues = {
      week: 16700,
      month: 46000,
      year: 467000
    };
    return revenues[timeRange];
  };


  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <h2 className="analytics-title">📊 Analytics Dashboard</h2>
          <p className="analytics-subtitle">Track your business performance</p>
        </div>
        <div className="time-range-selector">
          <button 
            className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={`time-btn ${timeRange === 'year' ? 'active' : ''}`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <p className="metric-label">Total Revenue</p>
            <h3 className="metric-value">
              ₹{getTotalRevenue().toLocaleString()}
            </h3>
            <span className="metric-change positive">+12.5% from last {timeRange}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🛍️</div>
          <div className="metric-content">
            <p className="metric-label">Total Orders</p>
            <h3 className="metric-value">1,847</h3>
            <span className="metric-change positive">+8.2% from last {timeRange}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <p className="metric-label">New Customers</p>
            <h3 className="metric-value">342</h3>
            <span className="metric-change positive">+15.3% from last {timeRange}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <p className="metric-label">Conversion Rate</p>
            <h3 className="metric-value">3.8%</h3>
            <span className="metric-change negative">-0.5% from last {timeRange}</span>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="charts-grid">
        <div className="chart-card large">
          <div className="chart-header">
            <h3 className="chart-title">📊 Revenue Trend</h3>
            <span className="chart-badge">Live</span>
          </div>
          <div className="chart-container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '1.1rem'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📈</div>
              <p>Revenue trending upward</p>
              <p style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>Charts will be available after fixing dependencies</p>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">📦 Order Status</h3>
          </div>
          <div className="chart-container doughnut" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '1.1rem'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🎯</div>
              <p>45% Delivered</p>
              <p>25% Shipped</p>
              <p>20% Processing</p>
              <p>10% Pending</p>
            </div>
          </div>
        </div>

        <div className="chart-card large">
          <div className="chart-header">
            <h3 className="chart-title">🛍️ Sales by Category</h3>
          </div>
          <div className="chart-container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '1.1rem'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📊</div>
              <p>Top: Clothing (₹18.5k)</p>
              <p>Second: Home (₹15.4k)</p>
              <p style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>Charts will be available after fixing dependencies</p>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">👥 User Growth</h3>
          </div>
          <div className="chart-container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '1.1rem'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📈</div>
              <p>Growing steadily</p>
              <p>420+ new users/month</p>
              <p style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>Charts will be available after fixing dependencies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
