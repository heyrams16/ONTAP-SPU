import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MobileMenu.css';

function MobileMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button className="mobile-menu-trigger" onClick={toggleMenu}>
        <span className="menu-icon">☰</span>
      </button>

      {isOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={closeMenu}></div>
          <div className="mobile-menu-drawer">
            <div className="mobile-menu-header">
              <h2>Menu</h2>
              <button className="menu-close-btn" onClick={closeMenu}>✕</button>
            </div>

            {user && (
              <div className="mobile-menu-user">
                <div className="user-avatar-mobile">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="user-info-mobile">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
              </div>
            )}

            <div className="mobile-menu-section">
              <h4>Main</h4>
              <Link to="/" className="mobile-menu-link" onClick={closeMenu}>
                <span className="menu-link-icon">🏠</span>
                <span>Home</span>
              </Link>
              <Link to="/services" className="mobile-menu-link" onClick={closeMenu}>
                <span className="menu-link-icon">🛍️</span>
                <span>Browse Services</span>
              </Link>
              <Link to="/marketplace" className="mobile-menu-link" onClick={closeMenu}>
                <span className="menu-link-icon">🏪</span>
                <span>Marketplace</span>
              </Link>
              <Link to="/rentals" className="mobile-menu-link" onClick={closeMenu}>
                <span className="menu-link-icon">🏠</span>
                <span>Rentals</span>
              </Link>
              <Link to="/ride-pooling" className="mobile-menu-link" onClick={closeMenu}>
                <span className="menu-link-icon">🚗</span>
                <span>Ride Pooling</span>
              </Link>
              <Link to="/feed" className="mobile-menu-link" onClick={closeMenu}>
                <span className="menu-link-icon">📱</span>
                <span>OnTap Feed</span>
              </Link>
              <Link to="/college-zone" className="mobile-menu-link" onClick={closeMenu}>
                <span className="menu-link-icon">🎓</span>
                <span>College Zone</span>
              </Link>
              <Link to="/student-tools" className="mobile-menu-link" onClick={closeMenu}>
                <span className="menu-link-icon">🧰</span>
                <span>Student Tools</span>
              </Link>
              <Link to="/mindwave" className="mobile-menu-link mindwave-menu-link" onClick={closeMenu}>
                <span className="menu-link-icon">🧠</span>
                <span>MindWave AI</span>
              </Link>
            </div>

            {user ? (
              <>
                <div className="mobile-menu-section">
                  <h4>Your Account</h4>
                  <Link to="/dashboard" className="mobile-menu-link" onClick={closeMenu}>
                    <span className="menu-link-icon">📊</span>
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/create-service" className="mobile-menu-link" onClick={closeMenu}>
                    <span className="menu-link-icon">➕</span>
                    <span>Offer Service</span>
                  </Link>
                  <Link to="/rides/offer" className="mobile-menu-link" onClick={closeMenu}>
                    <span className="menu-link-icon">🚙</span>
                    <span>Offer Ride</span>
                  </Link>
                  <Link to="/my-bookings" className="mobile-menu-link" onClick={closeMenu}>
                    <span className="menu-link-icon">📋</span>
                    <span>My Bookings</span>
                  </Link>
                </div>

                <div className="mobile-menu-footer">
                  <button
                    className="mobile-menu-logout"
                    onClick={() => {
                      onLogout();
                      closeMenu();
                    }}
                  >
                    <span className="menu-link-icon">🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="mobile-menu-section">
                <h4>Account</h4>
                <Link to="/login" className="mobile-menu-link" onClick={closeMenu}>
                  <span className="menu-link-icon">🔐</span>
                  <span>Login</span>
                </Link>
                <Link to="/register" className="mobile-menu-link" onClick={closeMenu}>
                  <span className="menu-link-icon">📝</span>
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default MobileMenu;
