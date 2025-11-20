import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './StudentTools.css';

function StudentTools() {
  const [activeTab, setActiveTab] = useState('overview');

  const tools = [
    {
      id: 'resume-optimizer',
      name: 'ATS Resume Optimizer',
      icon: '📄',
      description: 'Optimize your resume for Applicant Tracking Systems with AI-powered keyword suggestions',
      features: [
        'ATS compatibility score',
        'Keyword optimization',
        'LinkedIn profile matching',
        'Industry-specific suggestions',
        'Real-time feedback'
      ],
      color: '#4CAF50',
      route: '/tools/resume-optimizer'
    },
    {
      id: 'auto-apply',
      name: 'Auto Job Apply',
      icon: '🎯',
      description: 'Automate your job applications with smart form filling and tracking',
      features: [
        'Easy Apply automation',
        'Smart form filling',
        'Application tracking',
        'Cover letter templates',
        'Multi-platform support'
      ],
      color: '#2196F3',
      route: '/tools/auto-apply'
    },
    {
      id: 'interview-prep',
      name: 'Interview Prep AI',
      icon: '💼',
      description: 'Practice interviews with AI-powered mock interviews and feedback',
      features: [
        'Mock interviews',
        'Common questions database',
        'Video practice',
        'Feedback & tips',
        'Company-specific prep'
      ],
      color: '#FF9800',
      route: '/tools/interview-prep',
      comingSoon: true
    },
    {
      id: 'skill-tracker',
      name: 'Skill Progress Tracker',
      icon: '📊',
      description: 'Track your learning progress and get personalized skill recommendations',
      features: [
        'Skill assessments',
        'Learning paths',
        'Progress tracking',
        'Certificate management',
        'Goal setting'
      ],
      color: '#9C27B0',
      route: '/tools/skill-tracker',
      comingSoon: true
    }
  ];

  return (
    <div className="student-tools-page">
      <div className="tools-hero">
        <div className="container">
          <h1 className="tools-hero-title">🚀 Student Career Tools</h1>
          <p className="tools-hero-subtitle">
            AI-powered tools to supercharge your job search and career development
          </p>
        </div>
      </div>

      <div className="container">
        {/* Tools Grid */}
        <section className="tools-grid-section">
          <div className="tools-grid">
            {tools.map((tool, index) => (
              <div
                key={tool.id}
                className={`tool-card ${tool.comingSoon ? 'coming-soon' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {tool.comingSoon && (
                  <div className="coming-soon-badge">Coming Soon</div>
                )}

                <div className="tool-icon" style={{ background: tool.color }}>
                  {tool.icon}
                </div>

                <h3 className="tool-name">{tool.name}</h3>
                <p className="tool-description">{tool.description}</p>

                <div className="tool-features">
                  <h4>Features:</h4>
                  <ul>
                    {tool.features.map((feature, idx) => (
                      <li key={idx}>
                        <span className="feature-bullet">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {!tool.comingSoon ? (
                  <Link to={tool.route} className="tool-action-btn">
                    Get Started →
                  </Link>
                ) : (
                  <button className="tool-action-btn disabled" disabled>
                    Notify Me
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="tools-stats-section">
          <h2 className="section-title">Why Use Our Tools?</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">85%</div>
              <div className="stat-label">ATS Pass Rate Improvement</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">3x</div>
              <div className="stat-label">Faster Application Process</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Students Helped</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">Free</div>
              <div className="stat-label">For SPU Students</div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works-section">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3>Choose Your Tool</h3>
              <p>Select from our suite of career development tools</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h3>Upload & Analyze</h3>
              <p>Upload your documents and let AI do the work</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h3>Get Insights</h3>
              <p>Receive personalized recommendations</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">4</div>
              <h3>Take Action</h3>
              <p>Apply optimizations and track progress</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default StudentTools;
