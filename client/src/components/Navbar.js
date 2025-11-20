import React from 'react';
import { Link } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          ONTAP-SPU
        </Link>
        <MobileMenu user={user} onLogout={onLogout} />
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/services" className="nav-link">Browse Services</Link>
          </li>
          <li className="nav-item">
            <Link to="/ride-pooling" className="nav-link">Ride Pooling</Link>
          </li>
          <li className="nav-item">
            <Link to="/marketplace" className="nav-link">Marketplace</Link>
          </li>
          <li className="nav-item">
            <Link to="/rentals" className="nav-link">Rentals</Link>
          </li>
          <li className="nav-item">
            <Link to="/college-zone" className="nav-link">College Zone</Link>
          </li>
          <li className="nav-item">
            <Link to="/feed" className="nav-link">OnTap Feed</Link>
          </li>
          <li className="nav-item">
            <Link to="/student-tools" className="nav-link">Student Tools</Link>
          </li>
          <li className="nav-item">
            <Link to="/mindwave" className="nav-link mindwave-link">🧠 MindWave AI</Link>
          </li>
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/create-service" className="nav-link">Offer Service</Link>
              </li>
              <li className="nav-item">
                <Link to="/my-bookings" className="nav-link">My Bookings</Link>
              </li>
              <li className="nav-item">
                <span className="nav-user">Hi, {user.name}</span>
              </li>
              <li className="nav-item">
                <button onClick={onLogout} className="nav-btn">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-btn">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
