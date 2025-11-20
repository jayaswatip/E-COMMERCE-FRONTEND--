import React, { useState, useEffect } from 'react';
import './AdvancedFilters.css';

const AdvancedFilters = ({ 
  onFilterChange, 
  filterOptions = {},
  placeholder = "Search...",
  showDateRange = false,
  showStatus = false,
  showRole = false,
  showCategory = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    role: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'newest',
    minAmount: '',
    maxAmount: ''
  });

  const [savedFilters, setSavedFilters] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  // Load saved filters from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedFilters');
    if (saved) {
      setSavedFilters(JSON.parse(saved));
    }
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      status: 'all',
      role: 'all',
      category: 'all',
      dateFrom: '',
      dateTo: '',
      sortBy: 'newest',
      minAmount: '',
      maxAmount: ''
    };
    setFilters(clearedFilters);
  };

  const saveCurrentFilter = () => {
    if (!filterName.trim()) return;

    const newFilter = {
      id: Date.now(),
      name: filterName,
      filters: { ...filters }
    };

    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem('savedFilters', JSON.stringify(updated));
    setShowSaveDialog(false);
    setFilterName('');
  };

  const loadSavedFilter = (savedFilter) => {
    setFilters(savedFilter.filters);
  };

  const deleteSavedFilter = (filterId) => {
    const updated = savedFilters.filter(f => f.id !== filterId);
    setSavedFilters(updated);
    localStorage.setItem('savedFilters', JSON.stringify(updated));
  };

  const hasActiveFilters = () => {
    return filters.search !== '' ||
           filters.status !== 'all' ||
           filters.role !== 'all' ||
           filters.category !== 'all' ||
           filters.dateFrom !== '' ||
           filters.dateTo !== '' ||
           filters.minAmount !== '' ||
           filters.maxAmount !== '';
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.role !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.minAmount || filters.maxAmount) count++;
    return count;
  };

  return (
    <div className="advanced-filters">
      {/* Search Bar */}
      <div className="filter-search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="filter-search-input"
            placeholder={placeholder}
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
          />
          {filters.search && (
            <button 
              className="clear-search-btn"
              onClick={() => handleInputChange('search', '')}
            >
              ✕
            </button>
          )}
        </div>

        <button 
          className={`expand-filters-btn ${isExpanded ? 'active' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="filter-icon">⚙️</span>
          <span>Filters</span>
          {hasActiveFilters() && (
            <span className="filter-badge">{getActiveFilterCount()}</span>
          )}
        </button>

        {hasActiveFilters() && (
          <button 
            className="clear-all-btn"
            onClick={clearAllFilters}
          >
            Clear All
          </button>
        )}

        <button 
          className="save-filter-btn"
          onClick={() => setShowSaveDialog(true)}
          title="Save current filter"
        >
          💾
        </button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="filters-expanded">
          <div className="filters-grid">
            {/* Status Filter */}
            {showStatus && (
              <div className="filter-group">
                <label className="filter-label">Status</label>
                <select
                  className="filter-select"
                  value={filters.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                </select>
              </div>
            )}

            {/* Role Filter */}
            {showRole && (
              <div className="filter-group">
                <label className="filter-label">Role</label>
                <select
                  className="filter-select"
                  value={filters.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            )}

            {/* Category Filter */}
            {showCategory && (
              <div className="filter-group">
                <label className="filter-label">Category</label>
                <select
                  className="filter-select"
                  value={filters.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="books">Books</option>
                  <option value="home">Home</option>
                  <option value="sports">Sports</option>
                  <option value="beauty">Beauty</option>
                </select>
              </div>
            )}

            {/* Sort By */}
            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                className="filter-select"
                value={filters.sortBy}
                onChange={(e) => handleInputChange('sortBy', e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="amount-high">Amount (High to Low)</option>
                <option value="amount-low">Amount (Low to High)</option>
              </select>
            </div>

            {/* Date Range */}
            {showDateRange && (
              <>
                <div className="filter-group">
                  <label className="filter-label">From Date</label>
                  <input
                    type="date"
                    className="filter-input"
                    value={filters.dateFrom}
                    onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">To Date</label>
                  <input
                    type="date"
                    className="filter-input"
                    value={filters.dateTo}
                    onChange={(e) => handleInputChange('dateTo', e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Amount Range */}
            <div className="filter-group">
              <label className="filter-label">Min Amount</label>
              <input
                type="number"
                className="filter-input"
                placeholder="₹0"
                value={filters.minAmount}
                onChange={(e) => handleInputChange('minAmount', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Max Amount</label>
              <input
                type="number"
                className="filter-input"
                placeholder="₹999+"
                value={filters.maxAmount}
                onChange={(e) => handleInputChange('maxAmount', e.target.value)}
              />
            </div>
          </div>

          {/* Saved Filters */}
          {savedFilters.length > 0 && (
            <div className="saved-filters-section">
              <h4 className="saved-filters-title">💾 Saved Filters</h4>
              <div className="saved-filters-list">
                {savedFilters.map(saved => (
                  <div key={saved.id} className="saved-filter-item">
                    <button
                      className="saved-filter-btn"
                      onClick={() => loadSavedFilter(saved)}
                    >
                      <span className="saved-filter-icon">📌</span>
                      {saved.name}
                    </button>
                    <button
                      className="delete-saved-btn"
                      onClick={() => deleteSavedFilter(saved.id)}
                      title="Delete saved filter"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <div className="save-dialog-overlay" onClick={() => setShowSaveDialog(false)}>
          <div className="save-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="save-dialog-title">Save Current Filter</h3>
            <input
              type="text"
              className="save-dialog-input"
              placeholder="Enter filter name..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && saveCurrentFilter()}
              autoFocus
            />
            <div className="save-dialog-actions">
              <button 
                className="save-dialog-btn cancel"
                onClick={() => setShowSaveDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="save-dialog-btn save"
                onClick={saveCurrentFilter}
                disabled={!filterName.trim()}
              >
                💾 Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
