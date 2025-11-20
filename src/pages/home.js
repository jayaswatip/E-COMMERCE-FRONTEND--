import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

function Home() {
  const categories = [
    { name: 'Smart Watches', icon: '⌚', color: 'rgba(132, 250, 176, 0.1)', description: 'Track your fitness and stay connected' },
    { name: 'Wireless Audio', icon: '🎧', color: 'rgba(143, 211, 244, 0.1)', description: 'Immersive sound experience' },
    { name: 'Smart Home', icon: '🏠', color: 'rgba(132, 250, 176, 0.1)', description: 'Make your home smarter' }
  ];

  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            <span className="highlight">Tech</span> Innovation
          </h1>
          <p className="hero-subtitle">Discover premium gadgets that enhance your digital lifestyle</p>
          <div className="cta-container">
            <Link to="/products" className="cta-button primary">
              Explore Collection
            </Link>
            <Link to="/products" className="cta-button secondary">
              View Deals
            </Link>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-header">
          <h2>Featured Categories</h2>
          <div className="design-separator"></div>
        </div>
        <div className="categories-grid">
          {categories.map((category) => (
            <div 
              key={category.name} 
              className="category-card"
              style={{ backgroundColor: category.color }}
            >
              <span className="category-icon">{category.icon}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <Link to="/products" className="category-link">
                Explore →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Us</h2>
          <div className="design-separator"></div>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🛡️</span>
            <h3>Premium Quality</h3>
            <p>Curated selection of top-tier tech products</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🚚</span>
            <h3>Express Delivery</h3>
            <p>Swift and secure shipping worldwide</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💫</span>
            <h3>24/7 Support</h3>
            <p>Expert assistance whenever you need</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Secure Payment</h3>
            <p>Safe and encrypted transactions</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
