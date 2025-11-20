import React, { useState } from 'react';

const DiagnosticTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:5001';

  const runTests = async () => {
    setLoading(true);
    const testResults = {};

    // Test 1: Backend Health
    try {
      const response = await fetch(`${API_BASE}/`);
      const data = await response.json();
      testResults.health = { status: '✅ Pass', data };
    } catch (error) {
      testResults.health = { status: '❌ Fail', error: error.message };
    }

    // Test 2: Auth Test Endpoint
    try {
      const response = await fetch(`${API_BASE}/api/auth/test`);
      const data = await response.json();
      testResults.authTest = { status: '✅ Pass', data };
    } catch (error) {
      testResults.authTest = { status: '❌ Fail', error: error.message };
    }

    // Test 3: Check Token
    const token = localStorage.getItem('token');
    testResults.token = token 
      ? { status: '✅ Token exists', value: token.substring(0, 20) + '...' }
      : { status: '❌ No token found' };

    // Test 4: Check User Data
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        testResults.user = { 
          status: '✅ User data exists', 
          data: {
            email: userData.email,
            role: userData.role,
            isAdmin: userData.isAdmin
          }
        };
      } catch (error) {
        testResults.user = { status: '❌ Invalid user data', error: error.message };
      }
    } else {
      testResults.user = { status: '❌ No user data' };
    }

    // Test 5: Verify Admin (backend check)
    if (token) {
      try {
        const response = await fetch(`${API_BASE}/api/auth/verify-admin`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          testResults.verifyAdmin = { status: '✅ Pass', data };
        } else {
          const errorData = await response.json().catch(() => ({}));
          testResults.verifyAdmin = { 
            status: `❌ Fail (${response.status})`, 
            error: errorData.message || 'Unknown error',
            details: errorData
          };
        }
      } catch (error) {
        testResults.verifyAdmin = { status: '❌ Fail', error: error.message };
      }
    } else {
      testResults.verifyAdmin = { status: '⚠️ Skipped (no token)' };
    }

    // Test 6: Dashboard Stats (with auth)
    if (token) {
      try {
        const response = await fetch(`${API_BASE}/api/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          testResults.dashboardStats = { status: '✅ Pass', data };
        } else {
          const errorData = await response.json().catch(() => ({}));
          testResults.dashboardStats = { 
            status: `❌ Fail (${response.status})`, 
            error: errorData.message || 'Unknown error',
            details: errorData
          };
        }
      } catch (error) {
        testResults.dashboardStats = { status: '❌ Fail', error: error.message };
      }
    } else {
      testResults.dashboardStats = { status: '⚠️ Skipped (no token)' };
    }

    setResults(testResults);
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h1>🔍 Backend Diagnostic Test</h1>
      <button 
        onClick={runTests}
        disabled={loading}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#14b8a6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Running Tests...' : 'Run Diagnostic Tests'}
      </button>

      {Object.keys(results).length > 0 && (
        <div>
          <h2>Test Results:</h2>
          {Object.entries(results).map(([testName, result]) => (
            <div key={testName} style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '8px',
              border: '2px solid #ddd'
            }}>
              <h3 style={{ marginTop: 0 }}>
                {testName.toUpperCase()}
              </h3>
              <div style={{ marginBottom: '10px' }}>
                <strong>Status:</strong> {result.status}
              </div>
              {result.data && (
                <div>
                  <strong>Data:</strong>
                  <pre style={{
                    backgroundColor: '#fff',
                    padding: '10px',
                    borderRadius: '4px',
                    overflow: 'auto'
                  }}>
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
              {result.error && (
                <div style={{ color: 'red' }}>
                  <strong>Error:</strong> {result.error}
                </div>
              )}
              {result.details && (
                <div>
                  <strong>Details:</strong>
                  <pre style={{
                    backgroundColor: '#fff',
                    padding: '10px',
                    borderRadius: '4px',
                    overflow: 'auto'
                  }}>
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </div>
              )}
              {result.value && (
                <div>
                  <strong>Value:</strong> {result.value}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px'
      }}>
        <h3>📋 Instructions:</h3>
        <ol>
          <li>Make sure backend is running on port 5001</li>
          <li>Make sure you're logged in as admin</li>
          <li>Click "Run Diagnostic Tests" button</li>
          <li>Check which tests pass and which fail</li>
          <li>Share the results if you need help</li>
        </ol>
      </div>
    </div>
  );
};

export default DiagnosticTest;
