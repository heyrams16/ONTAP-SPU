import React, { useState } from 'react';
import './AutoApply.css';

function AutoApply() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    resumeUrl: '',
    coverLetterTemplate: ''
  });

  const [jobPreferences, setJobPreferences] = useState({
    jobTitle: '',
    location: '',
    remotePreference: 'hybrid',
    salaryMin: '',
    experienceLevel: 'entry',
    employmentType: 'full-time'
  });

  const [savedApplications, setSavedApplications] = useState([
    {
      id: 1,
      company: 'Google',
      position: 'Software Engineer Intern',
      platform: 'LinkedIn',
      status: 'applied',
      appliedDate: '2024-01-15',
      easyApply: true
    },
    {
      id: 2,
      company: 'Microsoft',
      position: 'Data Science Intern',
      platform: 'Indeed',
      status: 'pending',
      appliedDate: '2024-01-14',
      easyApply: true
    },
    {
      id: 3,
      company: 'Amazon',
      position: 'Product Manager Intern',
      platform: 'LinkedIn',
      status: 'reviewing',
      appliedDate: '2024-01-13',
      easyApply: false
    }
  ]);

  const [activeTab, setActiveTab] = useState('profile');

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handlePreferencesChange = (e) => {
    setJobPreferences({
      ...jobPreferences,
      [e.target.name]: e.target.value
    });
  };

  const saveProfile = () => {
    // In production, save to backend
    localStorage.setItem('autoApplyProfile', JSON.stringify(profile));
    alert('✓ Profile saved successfully!');
  };

  const getStatusColor = (status) => {
    const colors = {
      'applied': '#2196F3',
      'pending': '#FF9800',
      'reviewing': '#9C27B0',
      'interview': '#4CAF50',
      'rejected': '#f44336'
    };
    return colors[status] || '#666';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'applied': '📤',
      'pending': '⏳',
      'reviewing': '👀',
      'interview': '🎯',
      'rejected': '❌'
    };
    return icons[status] || '📝';
  };

  return (
    <div className="auto-apply-page">
      <div className="container">
        <div className="page-header">
          <h1>🎯 Auto Job Apply</h1>
          <p>Automate your job applications with smart form filling and tracking</p>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile Setup
          </button>
          <button
            className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            ⚙️ Job Preferences
          </button>
          <button
            className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            📊 My Applications
          </button>
          <button
            className={`tab-btn ${activeTab === 'apply' ? 'active' : ''}`}
            onClick={() => setActiveTab('apply')}
          >
            🚀 Start Applying
          </button>
        </div>

        {/* Profile Setup Tab */}
        {activeTab === 'profile' && (
          <div className="tab-content">
            <div className="profile-section">
              <h2>Basic Information</h2>
              <p className="section-description">
                Fill in your details once - we'll use them to auto-fill application forms
              </p>

              <div className="form-grid">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleProfileChange}
                    placeholder="John"
                  />
                </div>

                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleProfileChange}
                    placeholder="Doe"
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="form-group full-width">
                  <label>LinkedIn Profile</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={profile.linkedin}
                    onChange={handleProfileChange}
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>

                <div className="form-group full-width">
                  <label>GitHub Profile</label>
                  <input
                    type="url"
                    name="github"
                    value={profile.github}
                    onChange={handleProfileChange}
                    placeholder="https://github.com/johndoe"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Portfolio Website</label>
                  <input
                    type="url"
                    name="portfolio"
                    value={profile.portfolio}
                    onChange={handleProfileChange}
                    placeholder="https://johndoe.com"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleProfileChange}
                    placeholder="123 Main St"
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={profile.city}
                    onChange={handleProfileChange}
                    placeholder="New York"
                  />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={profile.state}
                    onChange={handleProfileChange}
                    placeholder="NY"
                  />
                </div>

                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={profile.zipCode}
                    onChange={handleProfileChange}
                    placeholder="10001"
                  />
                </div>
              </div>

              <h2 style={{marginTop: '40px'}}>Documents</h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Resume URL (Google Drive / Dropbox)</label>
                  <input
                    type="url"
                    name="resumeUrl"
                    value={profile.resumeUrl}
                    onChange={handleProfileChange}
                    placeholder="https://drive.google.com/..."
                  />
                  <small>Or upload your resume to get a shareable link</small>
                </div>

                <div className="form-group full-width">
                  <label>Cover Letter Template</label>
                  <textarea
                    name="coverLetterTemplate"
                    value={profile.coverLetterTemplate}
                    onChange={handleProfileChange}
                    rows={6}
                    placeholder="Dear Hiring Manager,

I am writing to express my interest in the [POSITION] role at [COMPANY]..."
                  />
                  <small>Use [POSITION] and [COMPANY] as placeholders</small>
                </div>
              </div>

              <button className="save-btn" onClick={saveProfile}>
                💾 Save Profile
              </button>
            </div>
          </div>
        )}

        {/* Job Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="tab-content">
            <div className="preferences-section">
              <h2>Job Search Preferences</h2>
              <p className="section-description">
                Set your preferences to filter and target the right opportunities
              </p>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Target Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={jobPreferences.jobTitle}
                    onChange={handlePreferencesChange}
                    placeholder="e.g., Software Engineer, Data Analyst"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Preferred Location</label>
                  <input
                    type="text"
                    name="location"
                    value={jobPreferences.location}
                    onChange={handlePreferencesChange}
                    placeholder="e.g., New York, NY or Remote"
                  />
                </div>

                <div className="form-group">
                  <label>Remote Preference</label>
                  <select
                    name="remotePreference"
                    value={jobPreferences.remotePreference}
                    onChange={handlePreferencesChange}
                  >
                    <option value="remote">Remote Only</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                    <option value="any">Any</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Employment Type</label>
                  <select
                    name="employmentType"
                    value={jobPreferences.employmentType}
                    onChange={handlePreferencesChange}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Experience Level</label>
                  <select
                    name="experienceLevel"
                    value={jobPreferences.experienceLevel}
                    onChange={handlePreferencesChange}
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead/Principal</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Minimum Salary (Optional)</label>
                  <input
                    type="number"
                    name="salaryMin"
                    value={jobPreferences.salaryMin}
                    onChange={handlePreferencesChange}
                    placeholder="e.g., 60000"
                  />
                </div>
              </div>

              <button className="save-btn" onClick={() => alert('✓ Preferences saved!')}>
                💾 Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Applications Tracker Tab */}
        {activeTab === 'applications' && (
          <div className="tab-content">
            <div className="applications-section">
              <div className="applications-header">
                <h2>Application Tracker</h2>
                <div className="stats-row">
                  <div className="stat-box">
                    <div className="stat-number">{savedApplications.length}</div>
                    <div className="stat-label">Total Applied</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-number">{savedApplications.filter(a => a.status === 'reviewing').length}</div>
                    <div className="stat-label">Under Review</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-number">
                      {savedApplications.filter(a => a.easyApply).length}
                    </div>
                    <div className="stat-label">Easy Apply</div>
                  </div>
                </div>
              </div>

              <div className="applications-list">
                {savedApplications.map(app => (
                  <div key={app.id} className="application-card">
                    <div className="app-header">
                      <div className="app-company">
                        <div className="company-logo">{app.company.charAt(0)}</div>
                        <div>
                          <h3>{app.position}</h3>
                          <p>{app.company}</p>
                        </div>
                      </div>
                      <div
                        className="app-status"
                        style={{ backgroundColor: getStatusColor(app.status) }}
                      >
                        {getStatusIcon(app.status)} {app.status}
                      </div>
                    </div>
                    <div className="app-meta">
                      <span>📅 {app.appliedDate}</span>
                      <span>🔗 {app.platform}</span>
                      {app.easyApply && <span className="easy-apply-badge">⚡ Easy Apply</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Auto Apply Tab */}
        {activeTab === 'apply' && (
          <div className="tab-content">
            <div className="apply-section">
              <h2>🚀 Start Auto-Applying</h2>
              <p className="section-description">
                Connect your accounts to start automating job applications
              </p>

              <div className="platforms-grid">
                <div className="platform-card">
                  <div className="platform-icon" style={{ background: '#0A66C2' }}>
                    💼
                  </div>
                  <h3>LinkedIn Easy Apply</h3>
                  <p>Auto-apply to LinkedIn jobs with one click</p>
                  <button className="connect-btn">Connect LinkedIn</button>
                  <small className="platform-note">✓ Supports Easy Apply jobs</small>
                </div>

                <div className="platform-card">
                  <div className="platform-icon" style={{ background: '#2164f3' }}>
                    🔍
                  </div>
                  <h3>Indeed</h3>
                  <p>Apply to Indeed listings automatically</p>
                  <button className="connect-btn">Connect Indeed</button>
                  <small className="platform-note">✓ Auto-fill applications</small>
                </div>

                <div className="platform-card coming-soon">
                  <div className="platform-icon" style={{ background: '#666' }}>
                    🚀
                  </div>
                  <h3>Glassdoor</h3>
                  <p>Coming Soon</p>
                  <button className="connect-btn" disabled>Coming Soon</button>
                </div>
              </div>

              <div className="info-box">
                <h3>ℹ️ How Auto-Apply Works</h3>
                <ul>
                  <li>We use your saved profile to auto-fill application forms</li>
                  <li>Review each application before it's submitted (optional)</li>
                  <li>Track all applications in one place</li>
                  <li>Get notifications when companies respond</li>
                  <li>100% compliant with platform terms of service</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AutoApply;
