import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const categories = [
    {
      title: 'Rides',
      icon: '🚗',
      description: 'Carpooling, airport trips, and campus transportation',
      color: '#4CAF50'
    },
    {
      title: 'Tutoring',
      icon: '📚',
      description: 'Academic help and subject tutoring',
      color: '#2196F3'
    },
    {
      title: 'Errands',
      icon: '🛒',
      description: 'Grocery runs, package pickup, and more',
      color: '#FF9800'
    },
    {
      title: 'Campus Tasks',
      icon: '🏗️',
      description: 'Moving help, event assistance, and odd jobs',
      color: '#9C27B0'
    }
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to ONTAP-SPU</h1>
          <p className="hero-subtitle">
            Your trusted campus marketplace for student services
          </p>
          <p className="hero-description">
            Connect with verified students for affordable help with rides, tutoring, errands, and campus tasks
          </p>
          <div className="hero-buttons">
            <Link to="/services" className="btn btn-primary btn-large">
              Browse Services
            </Link>
            <Link to="/register" className="btn btn-secondary btn-large">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="categories">
        <div className="container">
          <h2 className="section-title">Service Categories</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card" style={{ borderTopColor: category.color }}>
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-title">{category.title}</h3>
                <p className="category-description">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose ONTAP-SPU?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h3>Student Verified</h3>
              <p>All users are verified Saint Peter's University students</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💰</div>
              <h3>Affordable</h3>
              <p>Student-friendly prices within your budget</p>
            </div>
            <div className="feature">
              <div className="feature-icon">⭐</div>
              <h3>Trusted Reviews</h3>
              <p>Rate and review services to build community trust</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h3>Safe & Secure</h3>
              <p>Campus-only marketplace for your safety</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to get started?</h2>
          <p>Join the ONTAP-SPU community today</p>
          <Link to="/register" className="btn btn-primary btn-large">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
