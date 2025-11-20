import React, { useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import StarRating from './StarRating';
import './ProductCard.css';

function ProductCard({ product, onAddToCart, onShowNotification, onEdit, isAdmin = false }) {
  const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400?text=No+Image';
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleAddToCart = async () => {
    // Check if product is in stock
    if (product.stock === 0) {
      onShowNotification?.('Sorry, this product is out of stock', 'error');
      return;
    }

    setIsAdding(true);
    
    try {
      // Use the onAddToCart prop function
      onAddToCart?.(product, 1);
      
      setShowSuccess(true);
      setTimeout(() => {
        setIsAdding(false);
        setShowSuccess(false);
      }, 1500);
    } catch (error) {
      onShowNotification?.('Failed to add item to cart', 'error');
      setIsAdding(false);
    }
  };

  const openQuickView = () => {
    setShowQuickView(true);
  };

  const closeQuickView = () => {
    setShowQuickView(false);
  };

  return (
    <>
      <div className="product-card">
        <div className="product-image-container">
          <img
            src={product.image || PLACEHOLDER_IMAGE}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
          <div className="product-overlay">
            <button
              className="quick-view-btn"
              onClick={openQuickView}
            >
              Quick View
            </button>
            {isAdmin && onEdit && (
              <button
                className="edit-product-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                title="Edit Product"
              >
                <FiEdit2 />
              </button>
            )}
          </div>
          
          {/* Stock indicator */}
          {product.stock === 0 && (
            <div className="out-of-stock-badge">
              Out of Stock
            </div>
          )}
          
          {/* Category badge */}
          {product.category && (
            <div className="category-badge">
              {product.category}
            </div>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          
          {/* Stock information */}
          <div className="stock-info">
            <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          
          <div className="product-footer">
            <span className="product-price">₹{product.price.toFixed(2)}</span>
            <button
              className={`add-to-cart-btn ${isAdding ? 'adding' : ''} ${showSuccess ? 'success' : ''} ${product.stock === 0 ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
            >
              {isAdding ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  Adding...
                </span>
              ) : showSuccess ? (
                <span className="btn-success">✓ Added!</span>
              ) : product.stock === 0 ? (
                <span className="btn-disabled">Out of Stock</span>
              ) : (
                <span className="btn-default">🛒 Add to Cart</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {showQuickView && (
        <div className="quick-view-modal">
          <div className="quick-view-content">
            <button className="close-btn" onClick={closeQuickView}>&times;</button>
            <img 
              src={product.image || PLACEHOLDER_IMAGE} 
              alt={product.name} 
              className="quick-view-image" 
            />
            <h2>{product.name}</h2>
            
            <div className="quick-view-category">
              <span className="category-tag">{product.category}</span>
            </div>
            
            <div className="quick-view-ratings">
              <StarRating rating={product.rating || 4.5} />
              <span className="review-count">({product.reviewCount || '12'} reviews)</span>
            </div>
            
            <p className="quick-view-description">
              {product.details || product.description}
            </p>
            
            <div className="quick-view-stock">
              <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
            
            <p className="quick-view-price">₹{product.price.toFixed(2)}</p>
            
            <button
              className={`quick-view-add-btn ${product.stock === 0 ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;