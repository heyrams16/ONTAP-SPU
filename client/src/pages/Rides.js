import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ridesAPI } from '../services/api';
import './Rides.css';

function Rides() {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    destination: '',
    sort: 'departureTime'
  });

  useEffect(() => {
    fetchRides();
  }, [filters]);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const response = await ridesAPI.getAll(filters);
      setRides(response.data || []);
    } catch (error) {
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeUntil = (dateString) => {
    const now = new Date();
    const departure = new Date(dateString);
    const diff = departure - now;

    if (diff < 0) return 'Departed';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `in ${days}d`;
    if (hours > 0) return `in ${hours}h`;
    return 'Soon';
  };

  return (
    <div className="rides-page">
      {/* Header */}
      <div className="rides-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="header-content">
          <h1>Ride Pool</h1>
          <p>Share rides with fellow students</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="rides-search-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              name="search"
              placeholder="Where are you going?"
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="quick-filters">
          <button
            className={`filter-chip ${filters.destination === '' ? 'active' : ''}`}
            onClick={() => setFilters({...filters, destination: ''})}
          >
            All
          </button>
          <button
            className={`filter-chip ${filters.destination === 'airport' ? 'active' : ''}`}
            onClick={() => setFilters({...filters, destination: 'airport'})}
          >
            Airports
          </button>
          <button
            className={`filter-chip ${filters.destination === 'nyc' ? 'active' : ''}`}
            onClick={() => setFilters({...filters, destination: 'nyc'})}
          >
            NYC
          </button>
          <button
            className={`filter-chip ${filters.destination === 'campus' ? 'active' : ''}`}
            onClick={() => setFilters({...filters, destination: 'campus'})}
          >
            To Campus
          </button>
        </div>
      </div>

      {/* Rides List */}
      <div className="rides-content">
        {loading ? (
          <div className="rides-loading">
            <div className="loading-spinner"></div>
            <p>Finding rides...</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="no-rides">
            <div className="no-rides-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M19 17H22L20 13H19M19 17V13M19 17H5M5 17L3 13H5M5 17V13M5 13H19M7 17V19C7 19.5523 6.55228 20 6 20H5C4.44772 20 4 19.5523 4 19V17M17 17V19C17 19.5523 17.4477 20 18 20H19C19.5523 20 20 19.5523 20 19V17M7 10H17M9 7H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>No rides available</h3>
            <p>Check back later or post your own ride</p>
            <button className="post-ride-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Offer a Ride
            </button>
          </div>
        ) : (
          <div className="rides-list">
            {rides.map(ride => (
              <div key={ride._id} className="ride-card">
                {/* Time Badge */}
                <div className="ride-time-badge">
                  {getTimeUntil(ride.departureTime)}
                </div>

                {/* Route Info */}
                <div className="ride-route">
                  <div className="route-point origin">
                    <div className="point-marker origin-marker"></div>
                    <div className="point-info">
                      <span className="point-label">From</span>
                      <span className="point-name">{ride.origin}</span>
                    </div>
                  </div>

                  <div className="route-line">
                    <div className="route-line-inner"></div>
                  </div>

                  <div className="route-point destination">
                    <div className="point-marker destination-marker"></div>
                    <div className="point-info">
                      <span className="point-label">To</span>
                      <span className="point-name">{ride.destination}</span>
                    </div>
                  </div>
                </div>

                {/* Departure Time */}
                <div className="ride-datetime">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>{formatDate(ride.departureTime)} at {formatTime(ride.departureTime)}</span>
                </div>

                {/* Driver & Details */}
                <div className="ride-details">
                  <div className="driver-info">
                    <div className="driver-avatar">
                      {ride.driver?.name?.charAt(0) || 'D'}
                    </div>
                    <div className="driver-meta">
                      <span className="driver-name">{ride.driver?.name || 'Student Driver'}</span>
                      <div className="ride-features">
                        <span className="feature">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          {ride.seats} seats
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ride-price">
                    <span className="price-amount">${ride.price}</span>
                    <span className="price-label">per seat</span>
                  </div>
                </div>

                {/* Description */}
                {ride.description && (
                  <p className="ride-description">{ride.description}</p>
                )}

                {/* Action Button */}
                <button className="book-ride-btn">
                  Request to Join
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button className="fab-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

export default Rides;
