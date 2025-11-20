import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewHome.css';

function NewHome() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingServices, setTrendingServices] = useState([]);
  const [personalizedRecs, setPersonalizedRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const categories = [
    {
      id: 'rides',
      title: 'Rides',
      icon: '🚗',
      description: 'Carpooling & Airport Trips',
      color: '#4CAF50',
      image: '🚕'
    },
    {
      id: 'tutoring',
      title: 'Tutoring',
      icon: '📚',
      description: 'Academic Help & Coaching',
      color: '#2196F3',
      image: '👨‍🏫'
    },
    {
      id: 'errands',
      title: 'Errands',
      icon: '🛒',
      description: 'Grocery & Package Pickup',
      color: '#FF9800',
      image: '🛍️'
    },
    {
      id: 'campus-tasks',
      title: 'Campus Tasks',
      icon: '🏗️',
      description: 'Moving & Event Help',
      color: '#9C27B0',
      image: '📦'
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      icon: '🛍️',
      description: 'Buy & Sell Items',
      color: '#E91E63',
      image: '💰'
    },
    {
      id: 'rentals',
      title: 'Rentals',
      icon: '🔑',
      description: 'Rent Equipment & Books',
      color: '#00BCD4',
      image: '📚'
    }
  ];

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch trending services
      const trendingResponse = await axios.get('/api/recommendations/trending?limit=8', { headers });
      setTrendingServices(trendingResponse.data.trending || []);

      // Fetch personalized recommendations if logged in
      if (user && token) {
        try {
          const personalizedResponse = await axios.get('/api/recommendations/personalized?limit=8', { headers });
          setPersonalizedRecs(personalizedResponse.data.recommendations || []);
        } catch (error) {
          console.error('Error fetching personalized recommendations:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (categoryId === 'marketplace') {
      navigate('/marketplace');
    } else if (categoryId === 'rentals') {
      navigate('/rentals');
    } else {
      navigate(`/services?category=${categoryId}`);
    }
  };

  const ServiceCard = ({ service }) => (
    <Link to={`/services/${service._id}`} className="modern-service-card">
      <div className="service-card-header">
        <span className="service-category-badge" style={{ backgroundColor: categories.find(c => c.id === service.category)?.color || '#666' }}>
          {categories.find(c => c.id === service.category)?.icon} {service.category}
        </span>
        <span className="service-rating">
          ⭐ {service.rating?.toFixed(1) || '5.0'}
        </span>
      </div>
      <h3 className="service-card-title">{service.title}</h3>
      <p className="service-card-description">{service.description.substring(0, 80)}...</p>
      <div className="service-card-footer">
        <div className="service-price">
          <span className="price-amount">${service.price}</span>
          <span className="price-type">/{service.priceType === 'hourly' ? 'hr' : service.rentalPeriod || 'fixed'}</span>
        </div>
        <div className="service-provider">
          👤 {service.provider?.name || 'Student'}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="new-home">
      {/* Hero Section */}
      <section className="modern-hero">
        <div className="hero-overlay">
          <div className="hero-container">
            <h1 className="modern-hero-title">
              Your Campus. Your Services. Your Community.
            </h1>
            <p className="modern-hero-subtitle">
              Discover trusted student services, rentals, and marketplace deals at SPU
            </p>

            {/* Search Bar */}
            <form className="hero-search-form" onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="hero-search-input"
                  placeholder="Search for rides, tutoring, textbooks, rentals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">
                  Search
                </button>
              </div>
            </form>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Services</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.8★</div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-heading">
            <span className="heading-highlight">Explore</span> Categories
          </h2>
          <div className="categories-grid-modern">
            {categories.map((category) => (
              <div
                key={category.id}
                className="modern-category-card"
                onClick={() => handleCategoryClick(category.id)}
                style={{ '--category-color': category.color }}
              >
                <div className="category-icon-wrapper">
                  <span className="category-icon-large">{category.image}</span>
                </div>
                <h3 className="category-title-modern">{category.title}</h3>
                <p className="category-desc-modern">{category.description}</p>
                <div className="category-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personalized Recommendations (if logged in) */}
      {user && personalizedRecs.length > 0 && (
        <section className="recommendations-section">
          <div className="container">
            <div className="section-header-row">
              <h2 className="section-heading">
                <span className="heading-highlight">Just for You</span>
              </h2>
              <Link to="/services" className="view-all-link">
                View All →
              </Link>
            </div>
            <div className="services-carousel">
              {personalizedRecs.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Now */}
      {trendingServices.length > 0 && (
        <section className="trending-section">
          <div className="container">
            <div className="section-header-row">
              <h2 className="section-heading">
                🔥 <span className="heading-highlight">Trending</span> Now
              </h2>
              <Link to="/services" className="view-all-link">
                View All →
              </Link>
            </div>
            <div className="services-carousel">
              {trendingServices.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features-section-modern">
        <div className="container">
          <h2 className="section-heading text-center">
            Why Choose <span className="heading-highlight">ONTAP-SPU</span>?
          </h2>
          <div className="features-grid-modern">
            <div className="feature-card-modern">
              <div className="feature-icon-modern">✓</div>
              <h3>Student Verified</h3>
              <p>All users are verified SPU students for your safety</p>
            </div>
            <div className="feature-card-modern">
              <div className="feature-icon-modern">💰</div>
              <h3>Best Prices</h3>
              <p>Student-friendly rates you can afford</p>
            </div>
            <div className="feature-card-modern">
              <div className="feature-icon-modern">🤖</div>
              <h3>Smart Recommendations</h3>
              <p>AI-powered suggestions based on your activity</p>
            </div>
            <div className="feature-card-modern">
              <div className="feature-icon-modern">⚡</div>
              <h3>Instant Booking</h3>
              <p>Book services in seconds, get help quickly</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="cta-section-modern">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Get Started?</h2>
              <p className="cta-subtitle">Join thousands of SPU students saving time and money</p>
              <div className="cta-buttons">
                <Link to="/register" className="btn-cta-primary">
                  Sign Up Free
                </Link>
                <Link to="/services" className="btn-cta-secondary">
                  Browse Services
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default NewHome;
