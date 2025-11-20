import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import  jwtDecode  from "jwt-decode";
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const { register, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setFormError(''); // Clear form errors when user starts typing
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const { email, password, confirmPassword } = formData;

    // Validation
    if (!email || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords don't match!");
      return;
    }

    try {
      await register(email, password);
      setSuccessMessage('Registration successful! Redirecting to home...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
      setFormError(error.message || 'Registration failed. Please try again.');
    }
  };

  // Google Register handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      
      // Register user with Google account
      await register(decoded.email, null, { 
        provider: 'google', 
        profile: decoded 
      });
      setSuccessMessage('Registration successful! Redirecting to home...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Google registration error:', err);
      setFormError(err.message || 'Google signup failed. Please try again.');
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
          <h1>Create Account</h1>
          <p>Join us for exclusive deals and a seamless shopping experience 🚀</p>
        </div>

        <div className="auth-form-container">
          <div className="auth-social">
            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.log('Google Signup Failed');
                  setFormError('Google signup failed. Make sure to add http://localhost:3000 to Authorized JavaScript origins in Google Cloud Console.');
                }}
                theme="outline"
                size="large"
                width="100%"
                text="signup_with"
                shape="rectangular"
                logo_alignment="left"
              />
            </div>
            <div className="divider">
              <span>or register with email</span>
            </div>
          </div>

          {successMessage && <div className="form-success">{successMessage}</div>}
          {formError && <div className="form-error">{formError}</div>}
          {error && <div className="form-error">{error}</div>}
          
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
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <span className="input-icon"></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-container">
                <span className="input-icon"></span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </span>
              </div>
            </div>

            <button type="submit" className="auth-submit">
              ✨ Create Account
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Log In</Link></p>
          </div>
        </div>
      </div>

      <div className="auth-background">
        <div className="auth-decoration"></div>
      </div>
    </div>
  );
}

export default Register;