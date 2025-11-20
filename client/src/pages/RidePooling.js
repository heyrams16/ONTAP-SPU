import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LocationPicker from '../components/LocationPicker';
import { findWaypointsAlongRoute, getNearbyZones } from '../utils/locationAutocomplete';
import './RidePooling.css';

function RidePooling() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    from: null,
    to: null,
    date: new Date().toISOString().split('T')[0],
    seats: 1
  });
  const [rides, setRides] = useState([]);
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [routeWaypoints, setRouteWaypoints] = useState([]);
  const [nearbyToZones, setNearbyToZones] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    fetchPopularRoutes();
  }, []);

  // Calculate waypoints when route changes (Via-style)
  useEffect(() => {
    if (searchParams.from?.coordinates && searchParams.to?.coordinates) {
      const waypoints = findWaypointsAlongRoute(searchParams.from, searchParams.to, 3);
      setRouteWaypoints(waypoints);

      // Get nearby zones for destination
      const nearbyTo = getNearbyZones(searchParams.to, 2);
      setNearbyToZones(nearbyTo);
    } else {
      setRouteWaypoints([]);
      setNearbyToZones([]);
    }
  }, [searchParams.from, searchParams.to]);

  const fetchPopularRoutes = async () => {
    try {
      const response = await axios.get('/api/rides/popular-routes?limit=6');
      setPopularRoutes(response.data.routes || []);
    } catch (error) {
      console.error('Error fetching popular routes:', error);
    }
  };

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchParams.from || !searchParams.to) {
      alert('Please select both pickup and dropoff locations');
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      // Send location names or IDs to backend for search
      const response = await axios.get('/api/rides/search', {
        params: {
          from: searchParams.from.name || searchParams.from.address,
          to: searchParams.to.name || searchParams.to.address,
          fromZone: searchParams.from.zone,
          toZone: searchParams.to.zone,
          fromCoords: searchParams.from.coordinates,
          toCoords: searchParams.to.coordinates,
          date: searchParams.date,
          seats: searchParams.seats
        }
      });
      setRides(response.data.rides || []);
    } catch (error) {
      console.error('Error searching rides:', error);
      alert('Failed to search rides. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (field, location) => {
    setSearchParams({
      ...searchParams,
      [field]: location
    });
  };

  const handleQuickRoute = (route) => {
    setSearchParams({
      ...searchParams,
      from: route.from,
      to: route.to
    });
  };

  const handleBookRide = async (rideId) => {
    if (!user) {
      alert('Please login to book a ride');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/rides/${rideId}/request`,
        { seatsRequested: searchParams.seats },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Ride request sent successfully! The driver will confirm your booking.');
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error booking ride:', error);
      alert(error.response?.data?.error || 'Failed to book ride');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="ride-pooling-page">
      {/* Hero Section with Search */}
      <section className="ride-hero">
        <div className="ride-hero-overlay">
          <div className="container">
            <h1 className="ride-hero-title">🚗 Ride Pooling & Carpooling</h1>
            <p className="ride-hero-subtitle">Share rides, save money, make friends</p>

            {/* Search Form */}
            <form className="ride-search-form" onSubmit={handleSearch}>
              <div className="ride-search-grid">
                <div className="search-field">
                  <LocationPicker
                    label="📍 Pickup Location"
                    value={searchParams.from}
                    onChange={(location) => handleLocationChange('from', location)}
                    placeholder="Where are you leaving from?"
                  />
                </div>

                <div className="search-field">
                  <LocationPicker
                    label="🎯 Dropoff Location"
                    value={searchParams.to}
                    onChange={(location) => handleLocationChange('to', location)}
                    placeholder="Where are you going?"
                    nearbyZones={searchParams.from ? nearbyToZones : []}
                  />
                </div>

                <div className="search-field">
                  <label>📅 Date</label>
                  <input
                    type="date"
                    name="date"
                    value={searchParams.date}
                    onChange={handleInputChange}
                    className="ride-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="search-field">
                  <label>👥 Passengers</label>
                  <input
                    type="number"
                    name="seats"
                    value={searchParams.seats}
                    onChange={handleInputChange}
                    min="1"
                    max="7"
                    className="ride-input"
                  />
                </div>
              </div>

              <button type="submit" className="ride-search-btn" disabled={loading}>
                {loading ? 'Searching...' : '🔍 Search Rides'}
              </button>

              {/* Via-style: Show waypoints along the route */}
              {routeWaypoints.length > 0 && (
                <div className="route-waypoints-info">
                  <div className="waypoints-header">
                    ✨ <strong>{routeWaypoints.length} pickup points</strong> along this route
                  </div>
                  <div className="waypoints-list">
                    {routeWaypoints.slice(0, 5).map((waypoint) => (
                      <span key={waypoint.id} className="waypoint-chip">
                        {waypoint.name}
                      </span>
                    ))}
                    {routeWaypoints.length > 5 && (
                      <span className="waypoint-chip more">
                        +{routeWaypoints.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </form>

            {/* Offer Ride CTA */}
            {user && (
              <div className="offer-ride-cta">
                <Link to="/rides/offer" className="btn-offer-ride">
                  + Offer a Ride
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container">
        {/* Popular Routes */}
        {!searched && popularRoutes.length > 0 && (
          <section className="popular-routes-section">
            <h2 className="section-title">🔥 Popular Routes</h2>
            <div className="popular-routes-grid">
              {popularRoutes.map((route, index) => (
                <div
                  key={index}
                  className="popular-route-card"
                  onClick={() => handleQuickRoute(route)}
                >
                  <div className="route-path">
                    <span className="from-location">{route.from}</span>
                    <span className="route-arrow">→</span>
                    <span className="to-location">{route.to}</span>
                  </div>
                  <div className="route-meta">
                    <span>{route.rideCount} rides</span>
                    <span className="route-price">from ${route.avgPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Search Results */}
        {searched && (
          <section className="search-results-section">
            <div className="results-header">
              <h2 className="section-title">
                {rides.length} {rides.length === 1 ? 'ride' : 'rides'} found
              </h2>
              {rides.length > 0 && (
                <p className="results-subtitle">
                  From <strong>{searchParams.from}</strong> to <strong>{searchParams.to}</strong>
                </p>
              )}
            </div>

            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Searching for available rides...</p>
              </div>
            ) : rides.length === 0 ? (
              <div className="no-rides-found">
                <div className="no-rides-icon">🚗</div>
                <h3>No rides found</h3>
                <p>Try adjusting your search criteria or check back later</p>
                {user && (
                  <Link to="/rides/offer" className="btn-offer-ride-alt">
                    Be the first to offer this route
                  </Link>
                )}
              </div>
            ) : (
              <div className="rides-list">
                {rides.map((ride) => (
                  <div key={ride._id} className="ride-card">
                    <div className="ride-card-header">
                      <div className="ride-time">
                        <div className="time-large">{formatTime(ride.departureTime)}</div>
                        <div className="date-small">{formatDate(ride.departureTime)}</div>
                      </div>

                      <div className="ride-route">
                        <div className="route-point">
                          <div className="route-dot from"></div>
                          <div className="route-location">{ride.route.from}</div>
                        </div>
                        <div className="route-line">
                          {ride.route.duration && <span className="route-duration">{ride.route.duration} min</span>}
                        </div>
                        <div className="route-point">
                          <div className="route-dot to"></div>
                          <div className="route-location">{ride.route.to}</div>
                        </div>
                      </div>

                      <div className="ride-price-section">
                        <div className="price-large">${ride.price}</div>
                        <div className="price-per">per person</div>
                      </div>
                    </div>

                    <div className="ride-card-body">
                      <div className="driver-info">
                        <div className="driver-avatar">
                          {ride.provider?.name?.charAt(0) || '?'}
                        </div>
                        <div className="driver-details">
                          <div className="driver-name">{ride.provider?.name || 'Driver'}</div>
                          <div className="driver-rating">
                            ⭐ {ride.provider?.rating?.toFixed(1) || '5.0'}
                          </div>
                        </div>
                      </div>

                      <div className="ride-details">
                        <span className="detail-item">
                          🪑 {ride.availableSeats || ride.seatsAvailable - ride.bookedSeats} seats left
                        </span>
                        {ride.vehicleInfo?.model && (
                          <span className="detail-item">
                            🚙 {ride.vehicleInfo.make} {ride.vehicleInfo.model}
                          </span>
                        )}
                        {ride.matchScore && (
                          <span className="detail-item match-score">
                            ✓ {Math.round(ride.matchScore * 100)}% match
                          </span>
                        )}
                      </div>

                      {ride.preferences && (
                        <div className="ride-preferences">
                          {!ride.preferences.smokingAllowed && <span className="pref-tag">🚭 No smoking</span>}
                          {ride.preferences.petsAllowed && <span className="pref-tag">🐕 Pets OK</span>}
                          {ride.preferences.conversationLevel && (
                            <span className="pref-tag">
                              💬 {ride.preferences.conversationLevel}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="ride-card-footer">
                      <button
                        className="btn-book-ride"
                        onClick={() => handleBookRide(ride._id)}
                      >
                        Request to Join
                      </button>
                      <Link to={`/services/${ride._id}`} className="btn-view-details">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* How It Works */}
        {!searched && (
          <section className="how-it-works-section">
            <h2 className="section-title">How Ride Pooling Works</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Search for a ride</h3>
                <p>Enter your route and find drivers going your way</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Request to join</h3>
                <p>Send a booking request to the driver</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Get confirmed</h3>
                <p>Driver accepts your request and shares details</p>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <h3>Travel together</h3>
                <p>Meet up and enjoy your journey!</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default RidePooling;
