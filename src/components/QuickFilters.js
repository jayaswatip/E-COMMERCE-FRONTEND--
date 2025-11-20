import React from 'react';
import './QuickFilters.css';

const QuickFilters = ({ onQuickFilter, activeFilter = 'all' }) => {
  const quickFilters = [
    {
      id: 'all',
      label: 'All',
      icon: '📋',
      color: 'gray'
    },
    {
      id: 'today',
      label: 'Today',
      icon: '📅',
      color: 'blue'
    },
    {
      id: 'week',
      label: 'This Week',
      icon: '📆',
      color: 'purple'
    },
    {
      id: 'month',
      label: 'This Month',
      icon: '🗓️',
      color: 'green'
    },
    {
      id: 'active',
      label: 'Active',
      icon: '✅',
      color: 'teal'
    },
    {
      id: 'pending',
      label: 'Pending',
      icon: '⏳',
      color: 'yellow'
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: '🎉',
      color: 'emerald'
    }
  ];

  return (
    <div className="quick-filters">
      <div className="quick-filters-label">
        <span className="quick-icon">⚡</span>
        <span>Quick Filters:</span>
      </div>
      <div className="quick-filters-buttons">
        {quickFilters.map(filter => (
          <button
            key={filter.id}
            className={`quick-filter-btn ${filter.color} ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => onQuickFilter(filter.id)}
          >
            <span className="quick-filter-icon">{filter.icon}</span>
            <span>{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickFilters;
