import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ user }) {
  const quickActions = [
    {
      title: 'Browse Services',
      description: 'Find services offered by other students',
      link: '/services',
      icon: '🔍',
      color: '#4CAF50'
    },
    {
      title: 'Offer a Service',
      description: 'Create a new service listing',
      link: '/create-service',
      icon: '➕',
      color: '#2196F3'
    },
    {
      title: 'My Bookings',
      description: 'View your active and past bookings',
      link: '/my-bookings',
      icon: '📅',
      color: '#FF9800'
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user.name}!</h1>
          <p className="dashboard-subtitle">
            {user.isVerified ? (
              <span className="verified">✓ Verified Student</span>
            ) : (
              <span className="unverified">⚠ Pending Verification</span>
            )}
          </p>
        </div>

        <div className="user-stats">
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-value">{(user.rating || 5.0).toFixed(1)}</div>
              <div className="stat-label">Your Rating</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-content">
              <div className="stat-value">{user.totalReviews || 0}</div>
              <div className="stat-label">Reviews</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📧</div>
            <div className="stat-content">
              <div className="stat-value">{user.email}</div>
              <div className="stat-label">Email</div>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="action-card"
                style={{ borderLeftColor: action.color }}
              >
                <div className="action-icon">{action.icon}</div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
