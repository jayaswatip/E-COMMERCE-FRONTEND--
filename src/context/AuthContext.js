import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Use relative URL to leverage the proxy in package.json
  const API_BASE_URL = '/api';


  const register = async (email, password, googleData = null) => {
    setLoading(true);
    setError('');
    
    // Basic validation
    if (!email || (!password && !googleData)) {
      setError('Please provide all required fields');
      setLoading(false);
      return;
    }
    
    // Additional validation for email/password registration
    if (!googleData) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }
    }

    try {
      let response;
      
      if (googleData) {
        // Handle Google registration
        response = await fetch(`${API_BASE_URL}/auth/google-register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: googleData.profile.email,
            name: googleData.profile.name,
            googleId: googleData.profile.sub,
            picture: googleData.profile.picture
          }),
        });
      } else {
        // Handle regular email/password registration
        response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email, 
            password,
            name: email.split('@')[0] // Use email prefix as name
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Add admin check to user data
      const userWithAdminCheck = {
        ...data.user,
        isAdmin: data.user.role === 'admin' || data.user.email === 'admin@example.com'
      };

      // Store token and user data with admin flag
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userWithAdminCheck));
      setUser(userWithAdminCheck);
      
      return { ...data, user: userWithAdminCheck };
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, googleData = null) => {
    setLoading(true);
    setError('');
    
    // Basic validation
    if (!email || (!password && !googleData)) {
      setError('Please provide email and password');
      setLoading(false);
      return;
    }
    
    // Basic validation
    if (!email || (!password && !googleData)) {
      setError('Please provide email and password');
      setLoading(false);
      return;
    }

    try {
      let response;
      
      if (googleData) {
        // Handle Google login
        response = await fetch(`${API_BASE_URL}/auth/google-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: googleData.profile.email,
            name: googleData.profile.name,
            googleId: googleData.profile.sub,
            picture: googleData.profile.picture
          }),
        });
      } else {
        // Handle regular email/password login
        response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // ✅ ADD ADMIN CHECK HERE - This is the key change!
      const userWithAdminCheck = {
        ...data.user,
        isAdmin: data.user.role === 'admin' || data.user.email === 'admin@example.com'
      };

      // Store token and user data with admin flag
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userWithAdminCheck));
      setUser(userWithAdminCheck);
      
      return { ...data, user: userWithAdminCheck };
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError('');
  };

  const clearError = () => {
    setError('');
  };

  // Check if current user is admin
  const checkIsAdmin = useCallback(() => {
    return user?.isAdmin === true || user?.role === 'admin';
  }, [user]);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        const isUserAdmin = parsedUser.role === 'admin' || parsedUser.isAdmin === true;
        setUser({
          ...parsedUser,
          isAdmin: isUserAdmin
        });
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [checkIsAdmin]);

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    clearError,
    isAdmin: checkIsAdmin // Expose checkIsAdmin as isAdmin in the context
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};