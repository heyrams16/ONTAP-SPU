import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewHome.css';

function NewHome() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingServices, setTrendingServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentText, setCurrentText] = useState(0);
  const [showHero, setShowHero] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const heroTexts = [
    'Campus Life Made Easy',
    'Connect with Students',
    'AI-Powered Learning',
    'Share Rides & Save'
  ];

  const mainServices = [
    {
      id: 'rides',
      title: 'Rides',
      icon: '🚗',
      subtitle: 'Carpooling',
      path: '/ride-pooling'
    },
    {
      id: 'marketplace',
      title: 'Market',
      icon: '🛍️',
      subtitle: 'Buy & Sell',
      path: '/marketplace'
    },
    {
      id: 'rentals',
      title: 'Rentals',
      icon: '📦',
      subtitle: 'Borrow Items',
      path: '/rentals'
    },
    {
      id: 'services',
      title: 'Services',
      icon: '🔧',
      subtitle: 'Get Help',
      path: '/services'
    },
    {
      id: 'mindwave',
      title: 'MindWave',
      icon: '🧠',
      subtitle: 'AI Tools',
      path: '/mindwave'
    },
    {
      id: 'tools',
      title: 'Tools',
      icon: '🎯',
      subtitle: 'Student Tools',
      path: '/student-tools'
    },
    {
      id: 'feed',
      title: 'Feed',
      icon: '📱',
      subtitle: 'Campus News',
      path: '/feed'
    },
    {
      id: 'zone',
      title: 'Zone',
      icon: '🎓',
      subtitle: 'College Life',
      path: '/college-zone'
    }
  ];

  const quickActions = [
    { id: 'study', title: 'Study AI', icon: '📚', path: '/ai/study-assistant' },
    { id: 'wellness', title: 'Wellness', icon: '💚', path: '/ai/wellness' },
    { id: 'campus', title: 'Campus', icon: '🏫', path: '/ai/smart-campus' },
    { id: 'resume', title: 'Resume', icon: '📄', path: '/tools/resume-optimizer' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  // Rotate hero text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToContent = () => {
    setShowHero(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const trendingResponse = await axios.get('/api/recommendations/trending?limit=6', { headers });
      setTrendingServices(trendingResponse.data.trending || []);
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="careem-home">
      {/* Animated Hero Section */}
      {showHero && (
        <div className="animated-hero">
          {/* Animated Background */}
          <div className="hero-bg">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
            <div className="gradient-orb orb-3"></div>
          </div>

          {/* Floating Particles */}
          <div className="particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`particle particle-${i + 1}`}></div>
            ))}
          </div>

          {/* Hero Content */}
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              ONTAP-SPU
            </div>

            <h1 className="hero-title">
              <span className="title-static">Your</span>
              <span className="title-animated" key={currentText}>
                {heroTexts[currentText]}
              </span>
            </h1>

            <p className="hero-subtitle">
              The all-in-one platform for Saint Peter's University students.
              Connect, learn, and thrive together.
            </p>

            <div className="hero-buttons">
              <button className="hero-btn primary" onClick={scrollToContent}>
                Get Started
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="hero-btn secondary" onClick={() => navigate('/mindwave')}>
                Explore AI
              </button>
            </div>

            {/* Animated Stats */}
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-number">500+</span>
                <span className="stat-text">Services</span>
              </div>
              <div className="hero-stat">
                <span className="stat-number">1K+</span>
                <span className="stat-text">Students</span>
              </div>
              <div className="hero-stat">
                <span className="stat-number">24/7</span>
                <span className="stat-text">AI Support</span>
              </div>
            </div>
          </div>

          {/* Floating App Preview Cards */}
          <div className="floating-cards">
            <div className="float-card card-1">
              <div className="card-icon">🚗</div>
              <div className="card-text">
                <span className="card-title">Ride Pool</span>
                <span className="card-desc">Share rides & save</span>
              </div>
            </div>

            <div className="float-card card-2">
              <div className="card-icon">🧠</div>
              <div className="card-text">
                <span className="card-title">AI Assistant</span>
                <span className="card-desc">24/7 help</span>
              </div>
            </div>

            <div className="float-card card-3">
              <div className="card-icon">🛍️</div>
              <div className="card-text">
                <span className="card-title">Marketplace</span>
                <span className="card-desc">Buy & sell</span>
              </div>
            </div>

            <div className="float-card card-4">
              <div className="card-icon">📚</div>
              <div className="card-text">
                <span className="card-title">Study Tools</span>
                <span className="card-desc">Learn smarter</span>
              </div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="phone-mockup">
            <div className="phone-frame">
              <div className="phone-notch"></div>
              <div className="phone-screen">
                <div className="app-header">
                  <span>Good evening</span>
                  <div className="app-avatar">S</div>
                </div>
                <div className="app-grid">
                  <div className="app-tile"><span>🚗</span></div>
                  <div className="app-tile"><span>🛍️</span></div>
                  <div className="app-tile"><span>📦</span></div>
                  <div className="app-tile"><span>🧠</span></div>
                </div>
                <div className="app-promo">
                  <div className="promo-text">MindWave AI</div>
                  <div className="promo-btn">Explore</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="scroll-indicator" onClick={scrollToContent}>
            <span>Scroll to explore</span>
            <div className="scroll-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="home-header">
        <div className="header-top">
          <div className="greeting">
            <h1>{getGreeting()}{user ? `, ${user.name?.split(' ')[0]}` : ''}</h1>
            <p>What do you need today?</p>
          </div>
          {!user && (
            <Link to="/login" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <div className="input-icon">
            <span className="input-icon-left">🔍</span>
            <input
              type="text"
              className="input"
              placeholder="Search services, items, rides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </header>

      {/* Main Services Grid */}
      <section className="services-section">
        <div className="grid grid-4">
          {mainServices.map((service) => (
            <div
              key={service.id}
              className="service-tile"
              onClick={() => navigate(service.path)}
            >
              <div className="service-tile-icon">
                {service.icon}
              </div>
              <div className="service-tile-title">{service.title}</div>
              <div className="service-tile-subtitle">{service.subtitle}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-scroll no-scrollbar">
          {quickActions.map((action) => (
            <div
              key={action.id}
              className="quick-action-chip"
              onClick={() => navigate(action.path)}
            >
              <span className="chip-icon">{action.icon}</span>
              <span className="chip-text">{action.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-section">
        <div className="promo-card">
          <div className="promo-content">
            <h3>MindWave AI</h3>
            <p>Your personal AI assistant for studies, wellness & campus life</p>
            <button
              className="btn btn-dark btn-sm"
              onClick={() => navigate('/mindwave')}
            >
              Explore
            </button>
          </div>
          <div className="promo-icon">🧠</div>
        </div>
      </section>

      {/* Trending Services */}
      {trendingServices.length > 0 && (
        <section className="trending-section">
          <div className="section-header">
            <h2 className="section-title">Trending Now</h2>
            <Link to="/services" className="see-all">See all</Link>
          </div>
          <div className="trending-scroll no-scrollbar">
            {trendingServices.map((service) => (
              <Link
                key={service._id}
                to={`/services/${service._id}`}
                className="trending-card"
              >
                <div className="trending-icon">
                  {service.category === 'rides' ? '🚗' :
                   service.category === 'tutoring' ? '📚' :
                   service.category === 'errands' ? '🛒' :
                   service.category === 'marketplace' ? '🛍️' :
                   service.category === 'rentals' ? '📦' : '🔧'}
                </div>
                <div className="trending-info">
                  <div className="trending-title">{service.title}</div>
                  <div className="trending-price">${service.price}</div>
                </div>
                <div className="trending-rating">
                  ⭐ {service.rating?.toFixed(1) || '5.0'}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Stats Banner */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">500+</div>
            <div className="stat-label">Services</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-value">1K+</div>
            <div className="stat-label">Students</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-value">4.8</div>
            <div className="stat-label">Rating</div>
          </div>
        </div>
      </section>

      {/* CTA for non-logged in users */}
      {!user && (
        <section className="cta-section">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Join ONTAP-SPU</h3>
            <p className="text-secondary mb-4">
              Connect with fellow students and access all campus services
            </p>
            <div className="flex gap-3">
              <Link to="/register" className="btn btn-primary">
                Sign Up Free
              </Link>
              <Link to="/services" className="btn btn-secondary">
                Browse
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default NewHome;
