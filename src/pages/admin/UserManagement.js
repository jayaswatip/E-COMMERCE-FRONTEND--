import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiMoreVertical, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiUser, FiUserCheck, FiUserX } from 'react-icons/fi';
import AdvancedFilters from '../../components/AdvancedFilters';
import QuickFilters from '../../components/QuickFilters';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
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
  const [quickFilter, setQuickFilter] = useState('all');
  const [actionMenu, setActionMenu] = useState(null);
  const { user: currentUser } = useAuth();

  // API Base URL - uses environment variable
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data);
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        ));
        toast.success('User role updated successfully');
      } else {
        throw new Error(data.message || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = (userId) => {
    const userToDelete = users.find(u => u._id === userId);
    
    toast(
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <FiTrash2 className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-gray-900">Delete User</h3>
            <div className="mt-1 text-sm text-gray-500">
              Are you sure you want to delete {userToDelete?.name || 'this user'}? This action cannot be undone.
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => toast.dismiss()}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={async () => {
                  toast.dismiss();
                  try {
                    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                      method: 'DELETE',
                      headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                      }
                    });
            
                    if (response.ok) {
                      setUsers(users.filter(user => user._id !== userId));
                      toast.success('User deleted successfully');
                    } else {
                      const data = await response.json();
                      throw new Error(data.message || 'Failed to delete user');
                    }
                  } catch (error) {
                    console.error('Error deleting user:', error);
                    toast.error(error.message || 'Failed to delete user');
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>,
      {
        position: 'top-center',
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
        className: 'w-full max-w-md',
      }
    );
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, isActive: !currentStatus } : user
        ));
        toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      } else {
        throw new Error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  // Handle advanced filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Handle quick filter changes
  const handleQuickFilter = (filterId) => {
    setQuickFilter(filterId);
    setCurrentPage(1);

    // Apply quick filter logic
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    switch (filterId) {
      case 'today':
        setFilters(prev => ({ ...prev, dateFrom: new Date().toISOString().split('T')[0], dateTo: '' }));
        break;
      case 'week':
        setFilters(prev => ({ ...prev, dateFrom: startOfWeek.toISOString().split('T')[0], dateTo: '' }));
        break;
      case 'month':
        setFilters(prev => ({ ...prev, dateFrom: startOfMonth.toISOString().split('T')[0], dateTo: '' }));
        break;
      case 'active':
        setFilters(prev => ({ ...prev, status: 'active' }));
        break;
      case 'pending':
        setFilters(prev => ({ ...prev, status: 'pending' }));
        break;
      case 'completed':
        setFilters(prev => ({ ...prev, status: 'delivered' }));
        break;
      case 'all':
      default:
        setFilters(prev => ({ 
          ...prev, 
          status: 'all', 
          dateFrom: '', 
          dateTo: '' 
        }));
        break;
    }
  };

  // Filter users based on all filters
  const filteredUsers = users.filter(user => {
    const searchQuery = filters.search || searchTerm;
    const matchesSearch = !searchQuery ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      filters.status === 'all' || 
      (filters.status === 'active' && user.isActive !== false) ||
      (filters.status === 'inactive' && user.isActive === false) ||
      (filters.status === 'pending' && user.status === 'pending') ||
      (filters.status === 'delivered' && user.status === 'delivered');
      
    const matchesRole = 
      filters.role === 'all' || 
      user.role === filters.role;

    // Date filtering
    let matchesDate = true;
    if (filters.dateFrom || filters.dateTo) {
      const userDate = new Date(user.createdAt || user.joinDate);
      if (filters.dateFrom) {
        matchesDate = matchesDate && userDate >= new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        matchesDate = matchesDate && userDate <= new Date(filters.dateTo);
      }
    }
      
    return matchesSearch && matchesStatus && matchesRole && matchesDate;
  });

  // Sort filtered users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (filters.sortBy) {
      case 'newest':
        return new Date(b.createdAt || b.joinDate) - new Date(a.createdAt || a.joinDate);
      case 'oldest':
        return new Date(a.createdAt || a.joinDate) - new Date(b.createdAt || b.joinDate);
      case 'name-asc':
        return (a.name || '').localeCompare(b.name || '');
      case 'name-desc':
        return (b.name || '').localeCompare(a.name || '');
      default:
        return 0;
    }
  });

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
              <div className="p-5">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="user-management-container min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="text-center sm:text-left">
            <h1 className="header-title text-3xl font-bold text-gray-900">👥 User Management</h1>
            <p className="mt-2 text-sm text-gray-600">Manage all registered users and their permissions</p>
          </div>
        </div>

        {/* Quick Filters */}
        <QuickFilters 
          onQuickFilter={handleQuickFilter}
          activeFilter={quickFilter}
        />

        {/* Advanced Filters */}
        <AdvancedFilters 
          onFilterChange={handleFilterChange}
          placeholder="Search users by name or email..."
          showDateRange={true}
          showStatus={true}
          showRole={true}
        />

        {/* Results Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-semibold text-gray-800">
              📊 {sortedUsers.length} {sortedUsers.length === 1 ? 'User' : 'Users'} Found
            </h2>
            <div className="text-sm text-gray-500">
              Showing {Math.min(indexOfFirstUser + 1, sortedUsers.length)}-{Math.min(indexOfLastUser, sortedUsers.length)} of {sortedUsers.length}
            </div>
          </div>
          
          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentUsers.map((user) => (
              <div
                key={user._id}
                className="user-card bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`user-avatar h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${
                        user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'
                      }`}>
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {user.name || 'No Name'}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Role</span>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        disabled={user._id === currentUser._id}
                        className={`role-badge text-xs px-2 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          user.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        } ${user._id === currentUser._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Status</span>
                      <button
                        onClick={() => toggleUserStatus(user._id, user.isActive)}
                        disabled={user._id === currentUser._id}
                        className={`role-badge text-xs px-3 py-1 rounded-full font-medium transition-colors duration-200 ${
                          user.isActive !== false
                            ? 'status-active text-white'
                            : 'status-inactive text-white'
                        } ${user._id === currentUser._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {user.isActive !== false ? (
                          <span className="flex items-center">
                            <FiUserCheck className="mr-1 h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <FiUserX className="mr-1 h-3 w-3" />
                            Inactive
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-2 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActionMenu(actionMenu === user._id ? null : user._id);
                    }}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative"
                  >
                    <FiMoreVertical className="h-5 w-5" />
                    
                    {/* Action Menu */}
                    {actionMenu === user._id && (
                      <div className="action-menu absolute right-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(user.email);
                              toast.success('Email copied to clipboard');
                              setActionMenu(null);
                            }}
                            className="action-menu-item w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <FiUser className="mr-2 h-4 w-4" />
                            Copy Email
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info('Edit user functionality coming soon');
                              setActionMenu(null);
                            }}
                            className="action-menu-item w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <FiEdit2 className="mr-2 h-4 w-4" />
                            Edit Profile
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (user._id !== currentUser._id) {
                                handleDeleteUser(user._id);
                              }
                              setActionMenu(null);
                            }}
                            disabled={user._id === currentUser._id}
                            className={`action-menu-item w-full text-left px-4 py-2 text-sm flex items-center ${
                              user._id === currentUser._id 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                            title={user._id === currentUser._id ? 'Cannot delete your own account' : 'Delete user'}
                          >
                            <FiTrash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </button>
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="empty-state text-center py-12">
              <FiUser className="empty-state-icon mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
                  <span className="font-medium">{filteredUsers.length}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`pagination-button relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === pageNumber
                              ? 'pagination-active z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;