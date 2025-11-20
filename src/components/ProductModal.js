import React from 'react';
import { useAuth } from '../context/AuthContext';
import './ProductModal.css';

function ProductModal({ product, onClose }) {
  const { user } = useAuth();

  const handleAddToCart = () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    // Add your cart logic here
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!user) {
      alert('Please login to purchase');
      return;
    }
    // Add your buy now logic here
    alert(`Proceeding to checkout for ${product.name}`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        
        <div className="modal-body">
          <div className="product-image-section">
            <img src={product.image} alt={product.name} className="product-modal-image" />
            <div className="product-status">
              <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-stock'}`}>
                {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
              </span>
              {product.rating && (
                <div className="rating-section">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(product.rating) ? 'star filled' : 'star'}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="rating-text">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="product-info-section">
            <div className="product-header">
              <h2 className="product-modal-title">{product.name}</h2>
              <p className="product-modal-price">₹{product.price}</p>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.detailedDescription || product.description}</p>
            </div>

            {product.features && (
              <div className="product-features">
                <h3>Key Features</h3>
                <ul className="features-list">
                  {product.features.map((feature, index) => (
                    <li key={index} className="feature-item">
                      <span className="feature-icon">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.specifications && (
              <div className="product-specifications">
                <h3>Specifications</h3>
                <div className="specs-grid">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-label">{key}:</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button 
                className="btn-add-cart"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                🛒 Add to Cart
              </button>
              <button 
                className="btn-buy-now"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                ⚡ Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;