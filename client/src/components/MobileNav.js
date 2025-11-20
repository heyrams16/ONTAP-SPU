import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MobileNav.css';

function MobileNav({ user }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile) return null;

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="mobile-nav">
      <Link
        to="/"
        className={`mobile-nav-item ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
      >
        <span className="mobile-nav-icon">🏠</span>
        <span className="mobile-nav-label">Home</span>
      </Link>

      <Link
        to="/services"
        className={`mobile-nav-item ${isActive('/services') ? 'active' : ''}`}
      >
        <span className="mobile-nav-icon">🛍️</span>
        <span className="mobile-nav-label">Services</span>
      </Link>

      <Link
        to="/feed"
        className={`mobile-nav-item ${isActive('/feed') ? 'active' : ''}`}
      >
        <span className="mobile-nav-icon">📱</span>
        <span className="mobile-nav-label">Feed</span>
      </Link>

      <Link
        to="/ride-pooling"
        className={`mobile-nav-item ${isActive('/ride-pooling') || isActive('/rides') ? 'active' : ''}`}
      >
        <span className="mobile-nav-icon">🚗</span>
        <span className="mobile-nav-label">Rides</span>
      </Link>

      {user ? (
        <Link
          to="/dashboard"
          className={`mobile-nav-item ${isActive('/dashboard') ? 'active' : ''}`}
        >
          <span className="mobile-nav-icon">👤</span>
          <span className="mobile-nav-label">Profile</span>
        </Link>
      ) : (
        <Link
          to="/login"
          className={`mobile-nav-item ${isActive('/login') ? 'active' : ''}`}
        >
          <span className="mobile-nav-icon">🔐</span>
          <span className="mobile-nav-label">Login</span>
        </Link>
      )}
    </nav>
  );
}

export default MobileNav;
