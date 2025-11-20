import React, { useState, useEffect } from 'react';
import './WellnessCoach.css';
import mockAIService from '../services/mockAIService';

function WellnessCoach() {
  const [currentMood, setCurrentMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [wellnessData, setWellnessData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState('mood');
  const [checkInForm, setCheckInForm] = useState({
    mood: '',
    energy: 5,
    stress: 5,
    sleep: 7,
    notes: ''
  });

  const moods = [
    { id: 'great', emoji: '😄', label: 'Great', color: '#4CAF50' },
    { id: 'good', emoji: '🙂', label: 'Good', color: '#8BC34A' },
    { id: 'okay', emoji: '😐', label: 'Okay', color: '#FFC107' },
    { id: 'down', emoji: '😔', label: 'Down', color: '#FF9800' },
    { id: 'stressed', emoji: '😰', label: 'Stressed', color: '#f44336' }
  ];

  useEffect(() => {
    loadWellnessData();
    const interval = setInterval(loadWellnessData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadWellnessData = async () => {
    try {
      const data = await mockAIService.getWellnessInsights();
      setWellnessData(data);
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Error loading wellness data:', error);
    }
  };

  const handleMoodSelect = (mood) => {
    setCheckInForm({ ...checkInForm, mood: mood.id });
    setCurrentMood(mood);
  };

  const handleCheckIn = async () => {
    if (!checkInForm.mood) {
      alert('Please select your mood');
      return;
    }

    const checkIn = {
      ...checkInForm,
      timestamp: new Date().toISOString(),
      moodData: currentMood
    };

    // Add to history
    setMoodHistory([checkIn, ...moodHistory.slice(0, 6)]);

    // Get AI recommendations
    await loadWellnessData();

    // Reset form
    setCheckInForm({
      mood: '',
      energy: 5,
      stress: 5,
      sleep: 7,
      notes: ''
    });
    setCurrentMood(null);

    alert('✓ Check-in recorded! See your wellness insights below.');
  };

  return (
    <div className="wellness-coach-page">
      <div className="container">
        {/* Header */}
        <div className="wellness-header">
          <div className="header-top">
            <button className="back-btn" onClick={() => window.history.back()}>
              ← Back
            </button>
            <div className="privacy-indicator">
              <span className="privacy-dot"></span>
              Private & Secure
            </div>
          </div>
          <h1>🧘 AI Wellness Coach</h1>
          <p className="header-subtitle">
            Your personal mental health companion, powered by privacy-first AI
          </p>
        </div>

        <div className="wellness-content">
          {/* Sidebar - Quick Stats */}
          <div className="wellness-sidebar">
            <div className="sidebar-section">
              <h3>Today's Summary</h3>
              {wellnessData && (
                <div className="wellness-stats">
                  <div className="stat-box">
                    <div className="stat-icon">😊</div>
                    <div className="stat-label">Avg Mood</div>
                    <div className="stat-value">{wellnessData.avgMood}/10</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-label">Energy</div>
                    <div className="stat-value">{wellnessData.energyLevel}/10</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-icon">😌</div>
                    <div className="stat-label">Stress</div>
                    <div className="stat-value stress">{wellnessData.stressLevel}/10</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-icon">😴</div>
                    <div className="stat-label">Sleep</div>
                    <div className="stat-value">{wellnessData.sleepHours}h</div>
                  </div>
                </div>
              )}
            </div>

            <div className="sidebar-section">
              <h3>7-Day Trend</h3>
              {wellnessData && (
                <div className="trend-chart">
                  <div className="trend-line">
                    {wellnessData.weekTrend.map((day, idx) => (
                      <div key={idx} className="trend-bar">
                        <div
                          className="bar-fill"
                          style={{
                            height: `${day.mood * 10}%`,
                            backgroundColor: day.mood >= 7 ? '#4CAF50' : day.mood >= 5 ? '#FFC107' : '#FF9800'
                          }}
                        ></div>
                        <div className="bar-label">{day.day}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="sidebar-section">
              <h3>Wellness Score</h3>
              {wellnessData && (
                <div className="wellness-score-display">
                  <div className="score-circle">
                    <svg viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#e0e0e0"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#4CAF50"
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - wellnessData.wellnessScore / 100)}`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="score-text">{wellnessData.wellnessScore}</div>
                  </div>
                  <p className="score-description">
                    {wellnessData.wellnessScore >= 80 ? '🌟 Excellent' :
                     wellnessData.wellnessScore >= 60 ? '👍 Good' :
                     '💪 Keep going'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="wellness-main">
            {/* Tabs */}
            <div className="wellness-tabs">
              <button
                className={`tab-btn ${activeTab === 'mood' ? 'active' : ''}`}
                onClick={() => setActiveTab('mood')}
              >
                😊 Mood Check-in
              </button>
              <button
                className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
                onClick={() => setActiveTab('insights')}
              >
                💡 AI Insights
              </button>
              <button
                className={`tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
                onClick={() => setActiveTab('activities')}
              >
                🎯 Activities
              </button>
              <button
                className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                📊 History
              </button>
            </div>

            {/* Mood Check-in Tab */}
            {activeTab === 'mood' && (
              <div className="tab-content">
                <div className="check-in-section">
                  <h2>How are you feeling today?</h2>

                  <div className="mood-selector">
                    {moods.map(mood => (
                      <div
                        key={mood.id}
                        className={`mood-option ${currentMood?.id === mood.id ? 'selected' : ''}`}
                        onClick={() => handleMoodSelect(mood)}
                        style={{
                          borderColor: currentMood?.id === mood.id ? mood.color : '#e0e0e0'
                        }}
                      >
                        <div className="mood-emoji">{mood.emoji}</div>
                        <div className="mood-label">{mood.label}</div>
                      </div>
                    ))}
                  </div>

                  {currentMood && (
                    <div className="check-in-form">
                      <div className="form-group">
                        <label>Energy Level: {checkInForm.energy}/10</label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={checkInForm.energy}
                          onChange={(e) => setCheckInForm({ ...checkInForm, energy: parseInt(e.target.value) })}
                          className="slider"
                        />
                      </div>

                      <div className="form-group">
                        <label>Stress Level: {checkInForm.stress}/10</label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={checkInForm.stress}
                          onChange={(e) => setCheckInForm({ ...checkInForm, stress: parseInt(e.target.value) })}
                          className="slider"
                        />
                      </div>

                      <div className="form-group">
                        <label>Sleep Last Night: {checkInForm.sleep} hours</label>
                        <input
                          type="range"
                          min="0"
                          max="12"
                          value={checkInForm.sleep}
                          onChange={(e) => setCheckInForm({ ...checkInForm, sleep: parseInt(e.target.value) })}
                          className="slider"
                        />
                      </div>

                      <div className="form-group">
                        <label>Notes (Optional)</label>
                        <textarea
                          value={checkInForm.notes}
                          onChange={(e) => setCheckInForm({ ...checkInForm, notes: e.target.value })}
                          placeholder="What's on your mind?"
                          rows={3}
                        />
                      </div>

                      <button className="check-in-btn" onClick={handleCheckIn}>
                        ✓ Complete Check-in
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Insights Tab */}
            {activeTab === 'insights' && (
              <div className="tab-content">
                <h2>🤖 Personalized Insights</h2>

                {recommendations.length > 0 && (
                  <div className="recommendations-grid">
                    {recommendations.map((rec, idx) => (
                      <div key={idx} className={`recommendation-card ${rec.type}`}>
                        <div className="rec-icon">{rec.icon}</div>
                        <div className="rec-content">
                          <h4>{rec.title}</h4>
                          <p>{rec.description}</p>
                          {rec.action && (
                            <button className="rec-action-btn">{rec.action}</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {wellnessData && (
                  <div className="insights-section">
                    <h3>Pattern Analysis</h3>
                    <div className="insight-box">
                      <p>📈 <strong>Mood Patterns:</strong> {wellnessData.moodPattern}</p>
                      <p>⚡ <strong>Energy Peaks:</strong> {wellnessData.energyPeak}</p>
                      <p>😌 <strong>Stress Triggers:</strong> {wellnessData.stressTrigger}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <div className="tab-content">
                <h2>🎯 Recommended Activities</h2>

                {wellnessData && wellnessData.suggestedActivities && (
                  <div className="activities-grid">
                    {wellnessData.suggestedActivities.map((activity, idx) => (
                      <div key={idx} className="activity-card">
                        <div className="activity-icon">{activity.icon}</div>
                        <h4>{activity.name}</h4>
                        <p>{activity.description}</p>
                        <div className="activity-meta">
                          <span className="duration">⏱ {activity.duration}</span>
                          <span className="benefit">{activity.benefit}</span>
                        </div>
                        <button className="start-activity-btn">Start Activity</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="tab-content">
                <h2>📊 Your Wellness Journey</h2>

                {moodHistory.length > 0 ? (
                  <div className="history-timeline">
                    {moodHistory.map((entry, idx) => (
                      <div key={idx} className="history-entry">
                        <div className="entry-time">
                          {new Date(entry.timestamp).toLocaleString()}
                        </div>
                        <div className="entry-mood">
                          <span className="mood-badge" style={{ backgroundColor: entry.moodData.color }}>
                            {entry.moodData.emoji} {entry.moodData.label}
                          </span>
                        </div>
                        <div className="entry-details">
                          <span>Energy: {entry.energy}/10</span>
                          <span>Stress: {entry.stress}/10</span>
                          <span>Sleep: {entry.sleep}h</span>
                        </div>
                        {entry.notes && (
                          <div className="entry-notes">"{entry.notes}"</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No check-ins yet. Start tracking your wellness journey!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WellnessCoach;
