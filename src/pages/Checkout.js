import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Prepare order data
      const orderData = {
        userId: user._id,
        userEmail: user.email,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: cartTotal,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: 'USA' // Default country
        },
        paymentMethod: 'credit_card'
      };

      // Create order in database
      const result = await orderService.createOrder(orderData);
      
      if (result.success) {
        // Clear cart and redirect
        clearCart();
        alert('Order placed successfully! Your order ID is: ' + result.data._id);
        navigate('/');
      } else {
        throw new Error(result.message || 'Failed to create order');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="checkout-container">
        <h2>Please login to continue with checkout</h2>
        <button onClick={() => navigate('/login')} className="login-redirect-btn">
          Go to Login
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/products')} className="shopping-btn">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-summary">
        <h2>Order Summary</h2>
        {cartItems.map(item => (
          <div key={item.id} className="summary-item">
            <span>{item.name} x {item.quantity}</span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="total">
          <strong>Total:</strong>
          <strong>₹{cartTotal.toFixed(2)}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <h2>Shipping Information</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="zipCode">ZIP Code</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <h2>Payment Information</h2>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          className="place-order-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
