import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/home';
import Products from './pages/Products';
import CartPage from './pages/CartPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Admin Components
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import DiagnosticTest from './pages/admin/DiagnosticTest';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  console.log('App component rendering...');
  console.log('Google Client ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);
  
  try {
    return (
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <Router>
          <AuthProvider>
            <CartProvider>
              <div className="App">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/diagnostic" element={<DiagnosticTest />} />
                  
                  {/* Admin Routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin/users" 
                    element={
                      <ProtectedRoute adminOnly>
                        <UserManagement />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin/products" 
                    element={
                      <ProtectedRoute adminOnly>
                        <ProductManagement />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
                
                {/* Toast Notifications */}
                <ToastContainer position="top-right" autoClose={3000} />
              </div>
            </CartProvider>
          </AuthProvider>
        </Router>
      </GoogleOAuthProvider>
    );
  } catch (error) {
    console.error('App rendering error:', error);
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        <h1>Application Error</h1>
        <p>{error.message}</p>
        <p>Check the browser console for more details.</p>
      </div>
    );
  }
}

export default App;
