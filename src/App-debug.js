import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/home';

// Simple test component
function TestHome() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎉 React App is Working!</h1>
      <p>If you can see this, the React app is loading correctly.</p>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => alert('Button clicked!')}>Test Button</button>
      </div>
    </div>
  );
}

function App() {
  console.log('App component is rendering...');
  
  try {
    return (
      <Router>
        <AuthProvider>
          <CartProvider>
            <div className="App">
              <header style={{ background: '#282c34', padding: '20px', color: 'white' }}>
                <h2>E-Commerce App - Debug Mode</h2>
              </header>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/test" element={<TestHome />} />
                <Route path="*" element={<TestHome />} />
              </Routes>
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>
    );
  } catch (error) {
    console.error('App rendering error:', error);
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Error Loading App</h1>
        <p>{error.message}</p>
      </div>
    );
  }
}

export default App;
