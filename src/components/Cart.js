import React from 'react';
import { useCart } from '../context/CartContext';
import './Cart.css';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
      alert(`Decreased quantity of ${item.name}`);
    } else {
      removeFromCart(item.id);
      alert(`${item.name} removed from cart`);
    }
  };

  const handleIncrease = (item) => {
    updateQuantity(item.id, item.quantity + 1);
    alert(`Increased quantity of ${item.name}`);
  };

  const handleRemove = (item) => {
    removeFromCart(item.id);
    alert(`${item.name} removed from cart`);
  };

  if (cartItems.length === 0) {
    return null; // CartPage handles empty cart UI
  }

  return (
    <div className="cart-items">
      {cartItems.map(item => (
        <div key={item.id} className="cart-item">
          <div className="item-details">
            <h3>{item.name}</h3>
            <p className="item-price">₹{item.price.toFixed(2)}</p>
          </div>

          <div className="item-quantity">
            <button
              className="quantity-btn"
              onClick={() => handleDecrease(item)}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              className="quantity-btn"
              onClick={() => handleIncrease(item)}
            >
              +
            </button>
          </div>

          <div className="item-total">
            ₹{(item.price * item.quantity).toFixed(2)}
          </div>

          <button 
            className="remove-btn"
            onClick={() => handleRemove(item)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default Cart;
