import React, { useState } from 'react';

const DiagnosticTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  // API Base URL - uses environment variable
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const runTests = async () => {
    setLoading(true);
    const testResults = {};

    // Test 1: Backend Health
    try {
      console.log('Test 1: Backend Health Check');
      console.log('URL:', `${API_BASE_URL}/`);
      const response = await fetch(`${API_BASE_URL}/`);
      const data = await response.json();
      testResults.health = { status: '✅ Pass', data };
    } catch (error) {
      testResults.health = { status: '❌ Fail', error: error.message };
    }

    // Test 2: Auth Test Endpoint
    try {
      console.log('Test 2: Auth Test Endpoint');
      console.log('URL:', `${API_BASE_URL}/api/auth/test`);
      const response = await fetch(`${API_BASE_URL}/api/auth/test`);
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
        console.log('Test 5: Verify Admin');
        console.log('URL:', `${API_BASE_URL}/api/auth/verify-admin`);
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-admin`, {
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
        console.log('Test 6: Dashboard Stats');
        console.log('URL:', `${API_BASE_URL}/api/dashboard/stats`);
        const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
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

    // Test 7: Products Endpoint (with auth)
    if (token) {
      try {
        console.log('Test 7: Products Endpoint');
        console.log('URL:', `${API_BASE_URL}/api/products`);
        const response = await fetch(`${API_BASE_URL}/api/products`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          testResults.products = { 
            status: '✅ Pass', 
            data: {
              message: 'Successfully fetched products',
              count: Array.isArray(data) ? data.length : data.products?.length || 0
            }
          };
        } else {
          const errorData = await response.json().catch(() => ({}));
          testResults.products = { 
            status: `❌ Fail (${response.status})`, 
            error: errorData.message || 'Unknown error',
            details: errorData
          };
        }
      } catch (error) {
        testResults.products = { status: '❌ Fail', error: error.message };
      }
    } else {
      testResults.products = { status: '⚠️ Skipped (no token)' };
    }

    // Test 8: Users Endpoint (with auth)
    if (token) {
      try {
        console.log('Test 8: Users Endpoint');
        console.log('URL:', `${API_BASE_URL}/api/users`);
        const response = await fetch(`${API_BASE_URL}/api/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          testResults.users = { 
            status: '✅ Pass', 
            data: {
              message: 'Successfully fetched users',
              count: Array.isArray(data) ? data.length : 0
            }
          };
        } else {
          const errorData = await response.json().catch(() => ({}));
          testResults.users = { 
            status: `❌ Fail (${response.status})`, 
            error: errorData.message || 'Unknown error',
            details: errorData
          };
        }
      } catch (error) {
        testResults.users = { status: '❌ Fail', error: error.message };
      }
    } else {
      testResults.users = { status: '⚠️ Skipped (no token)' };
    }

    // Test 9: Environment Check
    testResults.environment = {
      status: '✅ Check',
      data: {
        API_BASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        REACT_APP_API_URL: process.env.REACT_APP_API_URL || 'Not set'
      }
    };

    // Test 10: Connection Summary
    const passCount = Object.values(testResults).filter(r => r.status.includes('✅')).length;
    const failCount = Object.values(testResults).filter(r => r.status.includes('❌')).length;
    const skipCount = Object.values(testResults).filter(r => r.status.includes('⚠️')).length;
    
    testResults.summary = {
      status: '📊 Summary',
      data: {
        total: Object.keys(testResults).length - 1, // Excluding summary itself
        passed: passCount,
        failed: failCount,
        skipped: skipCount,
        overallStatus: failCount === 0 ? '✅ All critical tests passed!' : '❌ Some tests failed'
      }
    };

    console.log('All tests completed:', testResults);
    setResults(testResults);
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>🔍 Backend Diagnostic Test</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>Test all critical API endpoints and connections</p>
        
        <button 
          onClick={runTests}
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: loading ? '#ccc' : '#14b8a6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '30px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            if (!loading) e.target.style.backgroundColor = '#0d9488';
          }}
          onMouseOut={(e) => {
            if (!loading) e.target.style.backgroundColor = '#14b8a6';
          }}
        >
          {loading ? '⏳ Running Tests...' : '▶️ Run Diagnostic Tests'}
        </button>

        {Object.keys(results).length > 0 && (
          <div>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>📋 Test Results:</h2>
            
            {/* Summary Card */}
            {results.summary && (
              <div style={{
                backgroundColor: '#e8f5e9',
                padding: '20px',
                marginBottom: '30px',
                borderRadius: '12px',
                border: '2px solid #4caf50'
              }}>
                <h3 style={{ marginTop: 0, color: '#2e7d32' }}>
                  {results.summary.data.overallStatus}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                  <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>
                      {results.summary.data.total}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Total Tests</div>
                  </div>
                  <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>
                      {results.summary.data.passed}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Passed</div>
                  </div>
                  <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f44336' }}>
                      {results.summary.data.failed}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Failed</div>
                  </div>
                  <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>
                      {results.summary.data.skipped}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Skipped</div>
                  </div>
                </div>
              </div>
            )}

            {/* Individual Test Results */}
            {Object.entries(results)
              .filter(([testName]) => testName !== 'summary')
              .map(([testName, result]) => {
                let bgColor = '#f5f5f5';
                let borderColor = '#ddd';
                
                if (result.status.includes('✅')) {
                  bgColor = '#e8f5e9';
                  borderColor = '#4caf50';
                } else if (result.status.includes('❌')) {
                  bgColor = '#ffebee';
                  borderColor = '#f44336';
                } else if (result.status.includes('⚠️')) {
                  bgColor = '#fff3e0';
                  borderColor = '#ff9800';
                }

                return (
                  <div key={testName} style={{
                    backgroundColor: bgColor,
                    padding: '20px',
                    marginBottom: '15px',
                    borderRadius: '8px',
                    border: `2px solid ${borderColor}`
                  }}>
                    <h3 style={{ marginTop: 0, marginBottom: '15px', textTransform: 'uppercase', fontSize: '14px' }}>
                      {testName.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <div style={{ marginBottom: '10px' }}>
                      <strong>Status:</strong> <span style={{ fontSize: '18px' }}>{result.status}</span>
                    </div>
                    
                    {result.data && (
                      <div style={{ marginBottom: '10px' }}>
                        <strong>Data:</strong>
                        <pre style={{
                          backgroundColor: '#fff',
                          padding: '15px',
                          borderRadius: '4px',
                          overflow: 'auto',
                          maxHeight: '300px',
                          fontSize: '12px',
                          margin: '8px 0 0 0'
                        }}>
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {result.error && (
                      <div style={{ color: '#c62828', marginBottom: '10px' }}>
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}
                    
                    {result.details && (
                      <div>
                        <strong>Details:</strong>
                        <pre style={{
                          backgroundColor: '#fff',
                          padding: '15px',
                          borderRadius: '4px',
                          overflow: 'auto',
                          maxHeight: '300px',
                          fontSize: '12px',
                          margin: '8px 0 0 0'
                        }}>
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {result.value && (
                      <div>
                        <strong>Value:</strong> 
                        <code style={{
                          backgroundColor: '#fff',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          marginLeft: '8px',
                          fontSize: '12px'
                        }}>
                          {result.value}
                        </code>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        <div style={{
          marginTop: '40px',
          padding: '25px',
          backgroundColor: '#fff3cd',
          borderRadius: '12px',
          border: '2px solid #ffc107'
        }}>
          <h3 style={{ marginTop: 0, color: '#856404' }}>📋 Instructions:</h3>
          <ol style={{ color: '#856404' }}>
            <li>Make sure your backend is running on <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px' }}>port 5001</code> or your Render deployment is active</li>
            <li>Make sure you're logged in as an <strong>admin</strong> user</li>
            <li>Check your <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px' }}>.env</code> file has <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px' }}>REACT_APP_API_URL</code> set correctly</li>
            <li>Click the <strong>"Run Diagnostic Tests"</strong> button above</li>
            <li>Review all test results - ✅ means working, ❌ means error, ⚠️ means skipped</li>
            <li>If tests fail, check the error messages and browser console</li>
            <li>Share the results if you need help debugging</li>
          </ol>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#e3f2fd',
          borderRadius: '12px',
          border: '2px solid #2196f3'
        }}>
          <h3 style={{ marginTop: 0, color: '#1565c0' }}>💡 Environment Info:</h3>
          <ul style={{ color: '#1565c0', margin: '10px 0' }}>
            <li><strong>API Base URL:</strong> <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px' }}>{API_BASE_URL}</code></li>
            <li><strong>Node Environment:</strong> <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px' }}>{process.env.NODE_ENV}</code></li>
            <li><strong>React App Base URL:</strong> <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px' }}>{process.env.REACT_APP_API_URL || 'Not set (using default)'}</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticTest;