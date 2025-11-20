import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LocationPicker from '../components/LocationPicker';
import { findWaypointsAlongRoute } from '../utils/locationAutocomplete';
import './OfferRide.css';

function OfferRide() {
  const navigate = useNavigate();
  const [rideData, setRideData] = useState({
    from: null,
    to: null,
    waypoints: [],
    departureTime: '',
    seatsAvailable: 1,
    price: '',
    vehicleInfo: {
      make: '',
      model: '',
      color: '',
      licensePlate: ''
    },
    preferences: {
      smokingAllowed: false,
      petsAllowed: false,
      conversationLevel: 'balanced',
      musicAllowed: true
    },
    notes: ''
  });

  const [suggestedWaypoints, setSuggestedWaypoints] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user) {
      alert('Please login to offer a ride');
      navigate('/login');
    }
  }, [user, navigate]);

  // Calculate suggested waypoints when route changes
  useEffect(() => {
    if (rideData.from?.coordinates && rideData.to?.coordinates) {
      const waypoints = findWaypointsAlongRoute(rideData.from, rideData.to, 3);
      setSuggestedWaypoints(waypoints);
    } else {
      setSuggestedWaypoints([]);
    }
  }, [rideData.from, rideData.to]);

  const handleLocationChange = (field, location) => {
    setRideData({
      ...rideData,
      [field]: location
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setRideData({
        ...rideData,
        [parent]: {
          ...rideData[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setRideData({
        ...rideData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleAddWaypoint = (waypoint) => {
    if (!rideData.waypoints.find(w => w.id === waypoint.id)) {
      setRideData({
        ...rideData,
        waypoints: [...rideData.waypoints, waypoint]
      });
    }
  };

  const handleRemoveWaypoint = (waypointId) => {
    setRideData({
      ...rideData,
      waypoints: rideData.waypoints.filter(w => w.id !== waypointId)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rideData.from || !rideData.to) {
      alert('Please select pickup and dropoff locations');
      return;
    }

    if (!rideData.departureTime || !rideData.price) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // Prepare ride data for backend
      const ridePayload = {
        route: {
          from: rideData.from.name || rideData.from.address,
          to: rideData.to.name || rideData.to.address,
          fromCoords: rideData.from.coordinates,
          toCoords: rideData.to.coordinates,
          fromZone: rideData.from.zone,
          toZone: rideData.to.zone,
          waypoints: rideData.waypoints.map(w => ({
            name: w.name,
            address: w.address,
            coordinates: w.coordinates,
            zone: w.zone
          }))
        },
        departureTime: new Date(rideData.departureTime).toISOString(),
        seatsAvailable: parseInt(rideData.seatsAvailable),
        price: parseFloat(rideData.price),
        vehicleInfo: rideData.vehicleInfo,
        preferences: rideData.preferences,
        notes: rideData.notes,
        serviceType: 'ride-pooling'
      };

      const response = await axios.post('/api/rides', ridePayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Ride posted successfully!');
      navigate('/ride-pooling');
    } catch (error) {
      console.error('Error posting ride:', error);
      alert(error.response?.data?.error || 'Failed to post ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="offer-ride-page">
      <div className="container">
        <div className="offer-ride-header">
          <h1>🚗 Offer a Ride</h1>
          <p>Share your journey and help fellow students save money</p>
        </div>

        <form className="offer-ride-form" onSubmit={handleSubmit}>
          {/* Route Section */}
          <section className="form-section">
            <h2>📍 Your Route</h2>

            <div className="form-row">
              <div className="form-group">
                <LocationPicker
                  label="Starting Location"
                  value={rideData.from}
                  onChange={(location) => handleLocationChange('from', location)}
                  placeholder="Where are you starting from?"
                />
              </div>

              <div className="form-group">
                <LocationPicker
                  label="Destination"
                  value={rideData.to}
                  onChange={(location) => handleLocationChange('to', location)}
                  placeholder="Where are you going?"
                />
              </div>
            </div>

            {/* Suggested Waypoints */}
            {suggestedWaypoints.length > 0 && (
              <div className="waypoints-section">
                <h3>✨ Add Pickup Stops Along Your Route</h3>
                <p className="waypoints-help">
                  These are popular pickup points along your route. Add them to pick up more passengers!
                </p>

                <div className="suggested-waypoints">
                  {suggestedWaypoints.slice(0, 8).map((waypoint) => (
                    <button
                      key={waypoint.id}
                      type="button"
                      className={`waypoint-suggest-btn ${
                        rideData.waypoints.find(w => w.id === waypoint.id) ? 'added' : ''
                      }`}
                      onClick={() => handleAddWaypoint(waypoint)}
                    >
                      <span className="waypoint-name">{waypoint.name}</span>
                      <span className="waypoint-badge">
                        {rideData.waypoints.find(w => w.id === waypoint.id) ? '✓' : '+'}
                      </span>
                    </button>
                  ))}
                </div>

                {rideData.waypoints.length > 0 && (
                  <div className="selected-waypoints">
                    <h4>Selected Stops ({rideData.waypoints.length})</h4>
                    <div className="waypoint-chips">
                      {rideData.waypoints.map((waypoint) => (
                        <span key={waypoint.id} className="waypoint-chip-selected">
                          {waypoint.name}
                          <button
                            type="button"
                            onClick={() => handleRemoveWaypoint(waypoint.id)}
                            className="remove-waypoint"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Ride Details */}
          <section className="form-section">
            <h2>🕐 Ride Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Departure Date & Time *</label>
                <input
                  type="datetime-local"
                  name="departureTime"
                  value={rideData.departureTime}
                  onChange={handleInputChange}
                  min={new Date().toISOString().slice(0, 16)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Available Seats *</label>
                <input
                  type="number"
                  name="seatsAvailable"
                  value={rideData.seatsAvailable}
                  onChange={handleInputChange}
                  min="1"
                  max="7"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Price per Passenger ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={rideData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="15.00"
                  className="form-input"
                  required
                />
              </div>
            </div>
          </section>

          {/* Vehicle Info */}
          <section className="form-section">
            <h2>🚙 Vehicle Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Make</label>
                <input
                  type="text"
                  name="vehicleInfo.make"
                  value={rideData.vehicleInfo.make}
                  onChange={handleInputChange}
                  placeholder="Toyota"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Model</label>
                <input
                  type="text"
                  name="vehicleInfo.model"
                  value={rideData.vehicleInfo.model}
                  onChange={handleInputChange}
                  placeholder="Camry"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Color</label>
                <input
                  type="text"
                  name="vehicleInfo.color"
                  value={rideData.vehicleInfo.color}
                  onChange={handleInputChange}
                  placeholder="Silver"
                  className="form-input"
                />
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="form-section">
            <h2>⚙️ Ride Preferences</h2>

            <div className="preferences-grid">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="preferences.smokingAllowed"
                  checked={rideData.preferences.smokingAllowed}
                  onChange={handleInputChange}
                />
                <span>🚬 Smoking Allowed</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="preferences.petsAllowed"
                  checked={rideData.preferences.petsAllowed}
                  onChange={handleInputChange}
                />
                <span>🐕 Pets Allowed</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="preferences.musicAllowed"
                  checked={rideData.preferences.musicAllowed}
                  onChange={handleInputChange}
                />
                <span>🎵 Music Allowed</span>
              </label>
            </div>

            <div className="form-group">
              <label>Conversation Level</label>
              <select
                name="preferences.conversationLevel"
                value={rideData.preferences.conversationLevel}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="quiet">😌 Quiet (Minimal talking)</option>
                <option value="balanced">💬 Balanced (Some conversation)</option>
                <option value="chatty">🗣️ Chatty (Love to talk!)</option>
              </select>
            </div>
          </section>

          {/* Additional Notes */}
          <section className="form-section">
            <h2>📝 Additional Notes</h2>
            <textarea
              name="notes"
              value={rideData.notes}
              onChange={handleInputChange}
              placeholder="Any additional information for passengers (meeting point details, luggage space, etc.)"
              className="form-textarea"
              rows="4"
            />
          </section>

          {/* Submit */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/ride-pooling')}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              {loading ? 'Posting...' : '🚗 Post Ride'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OfferRide;
