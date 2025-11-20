import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      
      // Simulate API call (replace with your actual reset password logic)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage("Password reset link sent to your email!");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem', color: '#333' }}>Forgot Password</h1>
          <p style={{ color: '#666', margin: 0 }}>
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {message && (
          <div style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '0.75rem',
            borderRadius: '4px',
            border: '1px solid #c3e6cb',
            marginBottom: '1rem'
          }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '0.75rem',
            borderRadius: '4px',
            border: '1px solid #f5c6cb',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="email" style={{
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#007bff';
                e.target.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ddd';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: '0.75rem',
              backgroundColor: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '1rem',
              opacity: loading ? 0.6 : 1
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#0056b3';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#007bff';
              }
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button 
            onClick={() => navigate("/login")}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;