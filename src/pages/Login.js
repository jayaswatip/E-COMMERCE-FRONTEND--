import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode  from 'jwt-decode';

import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { login, loading, error: authError, user } = useAuth();

  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const { email, password } = formData;

    if (!email || !password) {
      setFormError('Please enter both email and password');
      return;
    }
    
    if (!validateEmail(email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    try {
      await login(email, password);
      // No need to navigate here as the useEffect will handle the redirect
    } catch (err) {
      console.error('Login error:', err);
      setFormError(err.message || 'Invalid email or password. Please try again.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      await login(decoded.email, null, {
        provider: 'google',
        profile: decoded,
      });
      // No need to navigate here as the useEffect will handle the redirect
    } catch (err) {
      console.error('Google login error:', err);
      setFormError(err.message || 'Google login failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <button 
            onClick={() => navigate(-1)} 
            className="back-button"
            title="Go back"
          >
            ← Back
          </button>
          <h1>Welcome Back</h1>
          <p>Log in to continue shopping with us 🛍️</p>
          <div className="admin-credentials">
            <p><strong>Admin Login:</strong> admin@example.com / admin123</p>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="auth-social">
            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.log('Google Login Failed');
                  setFormError('Google login failed - Please add localhost:3000 to Google Console OAuth origins');
                }}
                theme="outline"
                size="large"
                width="100%"
              />
            </div>

            <div className="divider">
              <span>or login with email</span>
            </div>
          </div>

          {formError && <div className="form-error">{formError}</div>}
          {authError && <div className="form-error">{authError}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-container">
                <span className="input-icon"></span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>
              <div className="input-container">
                <span className="input-icon"></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword((p) => !p)}
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don&apos;t have an account?{' '}
              <Link to="/register" className="auth-link">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="auth-background">
        <div className="auth-decoration"></div>
      </div>
    </div>
  );
}

export default Login;