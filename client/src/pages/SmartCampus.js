import React, { useState, useEffect } from 'react';
import './SmartCampus.css';
import mockAIService from '../services/mockAIService';

function SmartCampus() {
  const [campusData, setCampusData] = useState(null);
  const [selectedShuttle, setSelectedShuttle] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [liveStats, setLiveStats] = useState(null);
  const [activeTab, setActiveTab] = useState('shuttles');

  // Load campus data and set up live updates
  useEffect(() => {
    loadCampusData();

    // Update every 5 seconds for live feel
    const interval = setInterval(() => {
      loadCampusData();
      updateLiveStats();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadCampusData = async () => {
    const data = await mockAIService.getCampusLiveData();
    setCampusData(data);
  };

  const updateLiveStats = () => {
    const stats = mockAIService.getLiveStats();
    setLiveStats(stats);
  };

  const handleShuttleClick = async (shuttle) => {
    setSelectedShuttle(shuttle);
    const pred = await mockAIService.predictShuttleArrival(shuttle.id, shuttle.nextStop);
    setPrediction(pred);
  };

  if (!campusData) {
    return (
      <div className="smart-campus-loading">
        <div className="loading-spinner"></div>
        <p>Loading live campus data...</p>
      </div>
    );
  }

  return (
    <div className="smart-campus-page">
      <div className="container">
        {/* Header with Live Indicator */}
        <div className="campus-header">
          <div className="header-top">
            <button className="back-btn" onClick={() => window.history.back()}>
              ← Back
            </button>
            <div className="live-indicator">
              <span className="live-dot pulsing"></span>
              LIVE
            </div>
          </div>
          <h1>🗺️ Smart Campus Navigator</h1>
          <p className="header-subtitle">
            Real-time campus tracking powered by AI predictions
          </p>

          {/* Live Stats Bar */}
          {liveStats && (
            <div className="live-stats-bar">
              <div className="stat">
                <span className="stat-icon">👥</span>
                <span className="stat-value">{liveStats.activeUsers}</span>
                <span className="stat-label">Active</span>
              </div>
              <div className="stat">
                <span className="stat-icon">🎯</span>
                <span className="stat-value">{liveStats.aiInteractions}</span>
                <span className="stat-label">AI Queries</span>
              </div>
              <div className="stat">
                <span className="stat-icon">💬</span>
                <span className="stat-value">{liveStats.questionsAnswered}</span>
                <span className="stat-label">Answered</span>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="campus-tabs">
          <button
            className={`tab-btn ${activeTab === 'shuttles' ? 'active' : ''}`}
            onClick={() => setActiveTab('shuttles')}
          >
            🚌 Shuttles
          </button>
          <button
            className={`tab-btn ${activeTab === 'dining' ? 'active' : ''}`}
            onClick={() => setActiveTab('dining')}
          >
            🍽️ Dining
          </button>
          <button
            className={`tab-btn ${activeTab === 'study' ? 'active' : ''}`}
            onClick={() => setActiveTab('study')}
          >
            📚 Study Spaces
          </button>
          <button
            className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            🎉 Events
          </button>
        </div>

        {/* Shuttle Tracking */}
        {activeTab === 'shuttles' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Live Shuttle Tracking</h2>
              <span className="update-time">
                Updated {new Date(campusData.lastUpdated).toLocaleTimeString()}
              </span>
            </div>

            <div className="shuttles-grid">
              {campusData.shuttles.map((shuttle) => (
                <div
                  key={shuttle.id}
                  className={`shuttle-card ${selectedShuttle?.id === shuttle.id ? 'selected' : ''}`}
                  onClick={() => handleShuttleClick(shuttle)}
                >
                  <div className="shuttle-header">
                    <div className="shuttle-route">{shuttle.route}</div>
                    <div className="shuttle-status">
                      <span className="status-dot active"></span>
                      {shuttle.status}
                    </div>
                  </div>

                  <div className="shuttle-info">
                    <div className="info-row">
                      <span className="info-label">Next Stop:</span>
                      <span className="info-value">{shuttle.nextStop}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">ETA:</span>
                      <span className="info-value highlight">{shuttle.eta}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Speed:</span>
                      <span className="info-value">{shuttle.speed} mph</span>
                    </div>
                  </div>

                  <div className="occupancy-bar">
                    <div className="occupancy-label">
                      Occupancy: {shuttle.occupancy}/{shuttle.capacity}
                    </div>
                    <div className="occupancy-track">
                      <div
                        className={`occupancy-fill ${
                          shuttle.occupancy / shuttle.capacity > 0.8 ? 'high' : ''
                        }`}
                        style={{ width: `${(shuttle.occupancy / shuttle.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Prediction Panel */}
            {prediction && (
              <div className="prediction-panel">
                <h3>🤖 AI Arrival Predictions</h3>
                <div className="predictions-list">
                  {prediction.predictions.map((pred, idx) => (
                    <div key={idx} className="prediction-item">
                      <div className="pred-time">{pred.time}</div>
                      <div className="pred-confidence">
                        <div className="confidence-bar">
                          <div
                            className="confidence-fill"
                            style={{ width: `${pred.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span>{(pred.confidence * 100).toFixed(0)}% confident</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="prediction-recommendation">
                  💡 {prediction.recommendation}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dining */}
        {activeTab === 'dining' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Dining Hall Status</h2>
            </div>

            <div className="dining-grid">
              {campusData.cafeterias.map((cafeteria, idx) => (
                <div key={idx} className="dining-card">
                  <h3>{cafeteria.name}</h3>

                  <div className="crowd-indicator">
                    <span className="crowd-label">Crowd Level:</span>
                    <span className={`crowd-level ${cafeteria.crowdLevel}`}>
                      {cafeteria.crowdLevel}
                    </span>
                  </div>

                  <div className="dining-stats">
                    <div className="stat-item">
                      <span className="stat-icon">⏱️</span>
                      <span>{cafeteria.waitTime}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">👥</span>
                      <span>{cafeteria.currentCount}/{cafeteria.capacity}</span>
                    </div>
                  </div>

                  <div className="capacity-bar">
                    <div
                      className="capacity-fill"
                      style={{
                        width: `${(cafeteria.currentCount / cafeteria.capacity) * 100}%`
                      }}
                    ></div>
                  </div>

                  <div className="menu-section">
                    <h4>Today's Menu</h4>
                    <div className="menu-tags">
                      {cafeteria.menuToday.map((item, i) => (
                        <span key={i} className="menu-tag">{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study Spaces */}
        {activeTab === 'study' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Available Study Spaces</h2>
            </div>

            <div className="study-spaces-grid">
              {campusData.studySpaces.map((space, idx) => (
                <div key={idx} className="study-space-card">
                  <div className="space-header">
                    <h3>{space.location}</h3>
                    <span className={`quiet-badge ${space.quietLevel}`}>
                      {space.quietLevel === 'silent' && '🤫 Silent'}
                      {space.quietLevel === 'moderate' && '💬 Moderate'}
                      {space.quietLevel === 'collaborative' && '👥 Collaborative'}
                    </span>
                  </div>

                  <div className="availability">
                    <div className="availability-number">
                      <span className="available">{space.available}</span>
                      <span className="total">/ {space.total} seats</span>
                    </div>
                    <div className="availability-bar">
                      <div
                        className="available-fill"
                        style={{ width: `${(space.available / space.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="amenities">
                    {space.amenities.map((amenity, i) => (
                      <span key={i} className="amenity-tag">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events */}
        {activeTab === 'events' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Happening Now</h2>
            </div>

            <div className="events-list">
              {campusData.events.map((event, idx) => (
                <div key={idx} className="event-card">
                  <div className="event-time">
                    <div className="time-badge">{event.startTime}</div>
                    <div className="duration">{event.duration}</div>
                  </div>

                  <div className="event-details">
                    <h3>{event.title}</h3>
                    <div className="event-location">
                      📍 {event.location}
                    </div>
                    <div className="event-attendance">
                      👥 {event.attendees}/{event.capacity} attending
                    </div>
                  </div>

                  <button className="join-btn">Join Event</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartCampus;
