import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">O</span>
          <span className="logo-text">ONTAP</span>
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/services" className="nav-link">Services</Link>
          </li>
          <li className="nav-item">
            <Link to="/marketplace" className="nav-link">Market</Link>
          </li>
          <li className="nav-item">
            <Link to="/rentals" className="nav-link">Rentals</Link>
          </li>
          <li className="nav-item">
            <Link to="/ride-pooling" className="nav-link">Rides</Link>
          </li>
          <li className="nav-item">
            <Link to="/mindwave" className="nav-link nav-link-highlight">MindWave</Link>
          </li>

          {user ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              </li>
              <li className="nav-item nav-user-item">
                <div className="nav-user-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <button onClick={onLogout} className="nav-btn-text">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
