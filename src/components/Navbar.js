import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaUserShield, FaBoxOpen, FaUsers, FaChartLine } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">E-Commerce Store</Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/products" className="nav-link">Products</Link>
        <Link to="/cart" className="nav-link">
          Cart {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
        </Link>
        {user && (user.role === 'admin' || user.isAdmin) && (
          <div className="admin-dropdown">
            <button className="nav-link admin-dropbtn">
              <FaUserShield className="admin-icon" /> Admin
            </button>
            <div className="admin-dropdown-content">
              <Link to="/admin"><FaChartLine /> Dashboard</Link>
              <Link to="/admin/products"><FaBoxOpen /> Products</Link>
              <Link to="/admin/users"><FaUsers /> Users</Link>
            </div>
          </div>
        )}
        {user ? (
          <>
            <span className="nav-link user-name">Hello, {user.name}</span>
            <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;