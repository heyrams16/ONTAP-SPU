import React, { useState, useEffect, useRef } from 'react';
import './WellnessCoach.css';
import mockAIService from '../services/mockAIService';
import axios from 'axios';

function WellnessCoach() {
  const [currentMood, setCurrentMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [wellnessData, setWellnessData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState('chat');
  const [checkInForm, setCheckInForm] = useState({
    mood: '',
    energy: 5,
    stress: 5,
    sleep: 7,
    notes: ''
  });

  // Chat state
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI Wellness Coach. I'm here to support your mental health and well-being. How are you feeling today? You can talk to me about stress, anxiety, sleep issues, or anything else on your mind. Everything shared here is private and confidential."
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Use the AI endpoint with wellness context
      const response = await axios.post('/api/ai/wellness-chat', {
        message: inputMessage,
        context: 'wellness'
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response || getWellnessResponse(inputMessage)
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      // Fallback to local responses
      const assistantMessage = {
        role: 'assistant',
        content: getWellnessResponse(inputMessage)
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const getWellnessResponse = (message) => {
    const lower = message.toLowerCase();

    if (lower.includes('stress') || lower.includes('anxious') || lower.includes('anxiety')) {
      return "I hear that you're feeling stressed. That's completely valid, and I'm here to help. Here are some techniques that might help:\n\n**Immediate Relief:**\n• Try the 4-7-8 breathing technique: breathe in for 4 seconds, hold for 7, exhale for 8\n• Ground yourself by naming 5 things you can see, 4 you can touch, 3 you can hear\n\n**Longer-term strategies:**\n• Break tasks into smaller, manageable pieces\n• Set boundaries and learn to say no\n• Schedule regular breaks throughout your day\n\nWould you like to try a guided breathing exercise right now?";
    }

    if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('tired')) {
      return "Sleep issues are really common among students. Here are some evidence-based strategies:\n\n**Sleep Hygiene Tips:**\n• Maintain a consistent sleep schedule, even on weekends\n• Avoid screens 1 hour before bed (blue light blocks melatonin)\n• Keep your room cool (65-68°F is ideal)\n• Limit caffeine after 2 PM\n\n**Relaxation Techniques:**\n• Progressive muscle relaxation\n• Body scan meditation\n• White noise or sleep sounds\n\nHow many hours of sleep are you currently getting?";
    }

    if (lower.includes('sad') || lower.includes('depressed') || lower.includes('down')) {
      return "I'm sorry you're feeling down. Your feelings are valid and it takes courage to reach out. Here are some things that might help:\n\n**Immediate Steps:**\n• Reach out to a friend or family member\n• Try to get outside for some sunlight and fresh air\n• Do one small task to create a sense of accomplishment\n\n**Self-Care Ideas:**\n• Listen to music that makes you feel good\n• Practice gratitude by noting 3 good things from today\n• Be gentle with yourself - you're doing your best\n\n**Important:** If you're having thoughts of self-harm, please contact:\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Campus counseling services\n\nIs there something specific that's contributing to how you feel?";
    }

    if (lower.includes('overwhelm') || lower.includes('too much') || lower.includes('can\'t handle')) {
      return "Feeling overwhelmed is really challenging. Let's break this down together:\n\n**Right Now:**\n• Take a deep breath - you're going to be okay\n• Write down everything on your mind (brain dump)\n• Identify the ONE most urgent thing\n\n**Prioritization Strategy:**\n1. What's due in the next 24 hours?\n2. What can be delegated or asked for an extension?\n3. What can wait until next week?\n\n**Self-Compassion:**\n• You don't have to be perfect\n• It's okay to ask for help\n• One step at a time is still progress\n\nWhat's the biggest thing weighing on you right now?";
    }

    if (lower.includes('lonely') || lower.includes('alone') || lower.includes('isolated')) {
      return "Feeling lonely is painful, and it's more common than you might think. Here are some ways to connect:\n\n**On Campus:**\n• Join a club or student organization\n• Study groups in the library\n• Campus events and activities\n• Fitness classes or intramural sports\n\n**Online:**\n• Reach out to old friends\n• Join online communities around your interests\n• Video call family\n\n**Small Steps:**\n• Say hi to someone in class\n• Ask a classmate about homework\n• Sit in common areas instead of alone\n\nWould you like some suggestions for campus events or groups to join?";
    }

    if (lower.includes('thank') || lower.includes('better') || lower.includes('helped')) {
      return "I'm so glad I could help! Remember, taking care of your mental health is just as important as your physical health. Feel free to come back anytime you need support. You're doing great! 💚";
    }

    return "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about what you're experiencing? Are you feeling stressed, anxious, having trouble sleeping, or dealing with something else? The more you share, the better I can help you find strategies that work for you.";
  };

  const quickPrompts = [
    "I'm feeling stressed about exams",
    "I can't sleep well",
    "I'm feeling overwhelmed",
    "How can I manage anxiety?",
    "I need motivation"
  ];

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
                className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
                onClick={() => setActiveTab('chat')}
              >
                💬 Chat
              </button>
              <button
                className={`tab-btn ${activeTab === 'mood' ? 'active' : ''}`}
                onClick={() => setActiveTab('mood')}
              >
                😊 Check-in
              </button>
              <button
                className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
                onClick={() => setActiveTab('insights')}
              >
                💡 Insights
              </button>
              <button
                className={`tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
                onClick={() => setActiveTab('activities')}
              >
                🎯 Activities
              </button>
            </div>

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div className="tab-content chat-tab">
                <div className="chat-container">
                  <div className="chat-messages">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`chat-message ${msg.role}`}>
                        {msg.role === 'assistant' && (
                          <div className="message-avatar">🧘</div>
                        )}
                        <div className="message-content">
                          <p>{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="chat-message assistant">
                        <div className="message-avatar">🧘</div>
                        <div className="message-content typing">
                          <span></span><span></span><span></span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="quick-prompts">
                    {quickPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        className="quick-prompt-btn"
                        onClick={() => {
                          setInputMessage(prompt);
                        }}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  <div className="chat-input-container">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Share what's on your mind..."
                      className="chat-input"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="send-btn"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

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
