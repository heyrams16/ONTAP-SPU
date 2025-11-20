import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MindWaveHub.css';

function MindWaveHub() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  const aiFeatures = [
    {
      id: 'study-assistant',
      category: 'academic',
      name: 'AI Study Assistant',
      icon: '📚',
      description: 'Personalized study plans, quiz generation, and concept explanations',
      features: [
        'Smart study scheduling',
        'Concept explanation with examples',
        'Practice quiz generation',
        'Learning style adaptation',
        'Progress tracking'
      ],
      color: '#4CAF50',
      route: '/ai/study-assistant',
      badge: 'On-Device'
    },
    {
      id: 'career-advisor',
      category: 'career',
      name: 'AI Career Advisor',
      icon: '💼',
      description: 'Resume optimization, interview prep, and career path guidance',
      features: [
        'ATS resume optimization',
        'Mock interview practice',
        'Career path recommendations',
        'Skills gap analysis',
        'Job market insights'
      ],
      color: '#2196F3',
      route: '/ai/career-advisor',
      badge: 'Privacy-First'
    },
    {
      id: 'research-assistant',
      category: 'academic',
      name: 'Research Assistant',
      icon: '🔬',
      description: 'Literature review, citation management, and research insights',
      features: [
        'Paper summarization',
        'Citation generation',
        'Research topic suggestions',
        'Data analysis help',
        'Writing assistance'
      ],
      color: '#9C27B0',
      route: '/ai/research-assistant',
      badge: 'FERPA Compliant'
    },
    {
      id: 'tutor',
      category: 'academic',
      name: 'AI Tutor',
      icon: '👨‍🏫',
      description: '24/7 personalized tutoring across all subjects',
      features: [
        'Step-by-step problem solving',
        'Concept reinforcement',
        'Practice problem generation',
        'Adaptive difficulty',
        'Multi-subject support'
      ],
      color: '#FF9800',
      route: '/ai/tutor',
      badge: 'On-Device'
    },
    {
      id: 'smart-campus',
      category: 'campus',
      name: 'Smart Campus Navigator',
      icon: '🗺️',
      description: 'AI-powered campus navigation and shuttle predictions',
      features: [
        'Real-time shuttle tracking',
        'Arrival time predictions',
        'Optimal route suggestions',
        'Campus event alerts',
        'Crowd density insights'
      ],
      color: '#00BCD4',
      route: '/ai/smart-campus',
      badge: 'Live'
    },
    {
      id: 'wellness',
      category: 'wellness',
      name: 'Wellness Coach',
      icon: '🧘',
      description: 'Mental health support and stress management',
      features: [
        'Stress level monitoring',
        'Mindfulness exercises',
        'Sleep optimization',
        'Study-life balance tips',
        'Anonymous support'
      ],
      color: '#E91E63',
      route: '/ai/wellness',
      badge: 'Privacy-First'
    },
    {
      id: 'writing-assistant',
      category: 'academic',
      name: 'Writing Assistant',
      icon: '✍️',
      description: 'Academic writing support and plagiarism prevention',
      features: [
        'Grammar and style checking',
        'Citation verification',
        'Plagiarism detection',
        'Readability analysis',
        'Structure suggestions'
      ],
      color: '#795548',
      route: '/ai/writing-assistant',
      badge: 'FERPA Compliant'
    },
    {
      id: 'schedule-optimizer',
      category: 'productivity',
      name: 'Schedule Optimizer',
      icon: '📅',
      description: 'AI-powered schedule planning and time management',
      features: [
        'Course schedule optimization',
        'Study time allocation',
        'Deadline management',
        'Energy level optimization',
        'Conflict resolution'
      ],
      color: '#607D8B',
      route: '/ai/schedule-optimizer',
      badge: 'On-Device'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Features', icon: '⚡' },
    { id: 'academic', name: 'Academic', icon: '🎓' },
    { id: 'career', name: 'Career', icon: '💼' },
    { id: 'campus', name: 'Campus Life', icon: '🏫' },
    { id: 'productivity', name: 'Productivity', icon: '⏰' },
    { id: 'wellness', name: 'Wellness', icon: '💚' }
  ];

  const filteredFeatures = activeCategory === 'all'
    ? aiFeatures
    : aiFeatures.filter(f => f.category === activeCategory);

  return (
    <div className="mindwave-hub-page">
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="mindwave-logo">
            <div className="logo-icon">🧠</div>
            <h1>MindWave AI Hub</h1>
          </div>
          <p className="hero-subtitle">
            Ethical AI-Powered Student Platform
          </p>
          <p className="hero-description">
            Privacy-first, on-device AI tools designed to enhance your academic journey.
            All processing happens locally on your device - your data never leaves your control.
          </p>

          <div className="trust-badges">
            <div className="trust-badge">
              <span className="badge-icon">🔒</span>
              <span>FERPA Compliant</span>
            </div>
            <div className="trust-badge">
              <span className="badge-icon">🛡️</span>
              <span>GDPR Compliant</span>
            </div>
            <div className="trust-badge">
              <span className="badge-icon">💻</span>
              <span>On-Device Processing</span>
            </div>
            <div className="trust-badge">
              <span className="badge-icon">🤝</span>
              <span>Human Augmentation</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Active Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-number">95%</div>
            <div className="stat-label">Privacy Retention</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-number">8</div>
            <div className="stat-label">AI Tools</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌍</div>
            <div className="stat-number">0</div>
            <div className="stat-label">Cloud Dependency</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* AI Features Grid */}
        <div className="ai-features-grid">
          {filteredFeatures.map((feature, index) => (
            <div
              key={feature.id}
              className="ai-feature-card"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(feature.route)}
            >
              <div className="feature-badge" style={{ backgroundColor: feature.color }}>
                {feature.badge}
              </div>

              <div className="feature-icon" style={{ background: feature.color }}>
                {feature.icon}
              </div>

              <h3>{feature.name}</h3>
              <p className="feature-description">{feature.description}</p>

              <ul className="feature-list">
                {feature.features.slice(0, 4).map((item, idx) => (
                  <li key={idx}>
                    <span className="check-icon">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <button
                className="launch-btn"
                style={{ background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)` }}
              >
                Launch Tool →
              </button>
            </div>
          ))}
        </div>

        {/* Privacy Section */}
        <div className="privacy-commitment">
          <h2>Our Privacy Commitment</h2>
          <div className="privacy-grid">
            <div className="privacy-card">
              <div className="privacy-icon">🔐</div>
              <h4>Local Processing</h4>
              <p>All AI computations happen on your device. Your data never touches our servers.</p>
            </div>
            <div className="privacy-card">
              <div className="privacy-icon">🚫</div>
              <h4>No Data Collection</h4>
              <p>We don't collect, store, or analyze your personal academic data.</p>
            </div>
            <div className="privacy-card">
              <div className="privacy-icon">👁️</div>
              <h4>Full Transparency</h4>
              <p>See exactly what data is processed and how AI makes decisions.</p>
            </div>
            <div className="privacy-card">
              <div className="privacy-icon">⚖️</div>
              <h4>Ethical AI</h4>
              <p>Designed to augment human capabilities, not replace them.</p>
            </div>
          </div>
        </div>

        {/* Partnership Section */}
        <div className="partnership-section">
          <div className="partnership-content">
            <h3>Powered by MindWave</h3>
            <p>
              In partnership with Rochester Institute of Technology (RIT), MindWave delivers
              cutting-edge AI solutions that prioritize student privacy and academic excellence.
            </p>
            <div className="partner-logos">
              <div className="partner-logo">RIT</div>
              <div className="partner-divider">×</div>
              <div className="partner-logo">MindWave</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h2>Ready to Enhance Your Learning?</h2>
          <p>Choose an AI tool above to get started, or explore our dashboard to customize your experience.</p>
          <button className="cta-btn" onClick={() => navigate('/ai/dashboard')}>
            Open AI Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default MindWaveHub;
