import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cart from '../components/Cart';
import { useCart } from '../context/CartContext';
import './CartPage.css';

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, cartTotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Promo code handler
  const handleApplyPromo = () => {
    if (promoCode.trim().toLowerCase() === 'save10') {
      setDiscount(cartTotal * 0.1);
      alert('Promo code applied: 10% off!');
    } else {
      setDiscount(0);
      if (promoCode.trim() !== '') {
        alert('Invalid promo code');
      }
    }
  };

  const finalTotal = cartTotal - discount + cartTotal * 0.1; // subtotal - discount + tax

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Shopping Cart</h1>
        <p className="cart-subtitle">Review and manage your items</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-content">
            <span className="empty-cart-icon">🛒</span>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <button 
              className="continue-shopping-button"
              onClick={() => navigate('/products')}
            >
              Start Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="cart-container">
          {/* Cart Items */}
          <div className="cart-main">
            <div className="cart-items-header">
              <h2>Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h2>
              <button 
                className="continue-shopping-link"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
            </div>
            <Cart />
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <div className="summary-header">
              <h2>Order Summary</h2>
            </div>
            <div className="summary-content">
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free-shipping">FREE</span>
                </div>
                <div className="summary-row">
                  <span>Estimated Tax</span>
                  <span>₹{(cartTotal * 0.1).toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="summary-row discount-row">
                    <span>Promo Discount</span>
                    <span>- ₹{discount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              {/* Promo Code */}
              <div className="promo-code">
                <input 
                  type="text" 
                  placeholder="Enter promo code" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                />
                <button 
                  className="apply-promo" 
                  onClick={handleApplyPromo}
                >
                  Apply
                </button>
              </div>

              {/* Total */}
              <div className="summary-total">
                <span>Total</span>
                <span className="total-amount">₹{finalTotal.toFixed(2)}</span>
              </div>

              {/* Checkout */}
              <button 
                className="checkout-button"
                disabled={cartItems.length === 0}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>

              {/* Secure Checkout */}
              <div className="secure-checkout">
                <span className="secure-icon">🔒</span>
                <span>Secure Checkout</span>
              </div>

              {/* Payment Methods */}
              <div className="payment-methods">
                <p>We Accept</p>
                <div className="payment-icons">
                  <span>💳</span>
                  <span>💳</span>
                  <span>💳</span>
                  <span>💳</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
