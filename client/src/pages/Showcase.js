import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './Showcase.css';

function Showcase() {
  const [currentURL, setCurrentURL] = useState('');

  useEffect(() => {
    // Get the current URL (will use local IP when accessed on network)
    const url = window.location.origin;
    setCurrentURL(url);
  }, []);

  const demoAccounts = [
    { email: 'demo1@saintpeters.edu', password: 'demo123', number: 1 },
    { email: 'demo2@saintpeters.edu', password: 'demo123', number: 2 },
    { email: 'demo3@saintpeters.edu', password: 'demo123', number: 3 },
    { email: 'demo4@saintpeters.edu', password: 'demo123', number: 4 },
    { email: 'demo5@saintpeters.edu', password: 'demo123', number: 5 },
    { email: 'demo6@saintpeters.edu', password: 'demo123', number: 6 },
    { email: 'demo7@saintpeters.edu', password: 'demo123', number: 7 },
    { email: 'demo8@saintpeters.edu', password: 'demo123', number: 8 },
    { email: 'demo9@saintpeters.edu', password: 'demo123', number: 9 },
    { email: 'demo10@saintpeters.edu', password: 'demo123', number: 10 }
  ];

  return (
    <div className="showcase-page">
      <div className="showcase-container">
        <div className="showcase-header">
          <h1>🎉 Welcome to ONTAP-SPU Showcase!</h1>
          <p className="showcase-subtitle">
            Winner of HackSPU 2025 - Campus Marketplace for Student Services
          </p>
        </div>

        <div className="showcase-content">
          <div className="qr-section">
            <h2>📱 Scan to Access</h2>
            <div className="qr-code-container">
              <QRCodeSVG
                value={currentURL}
                size={280}
                level="H"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#2c3e50"
              />
            </div>
            <p className="qr-instructions">
              Scan this QR code with your phone camera to access ONTAP
            </p>
            <div className="url-display">
              <strong>URL:</strong> {currentURL}
            </div>
          </div>

          <div className="demo-accounts-section">
            <h2>🔐 Demo Login Credentials</h2>
            <p className="demo-info">Choose any account to login and explore:</p>

            <div className="demo-grid">
              {demoAccounts.map((account) => (
                <div key={account.number} className="demo-card">
                  <div className="demo-number">Demo {account.number}</div>
                  <div className="demo-details">
                    <div className="demo-field">
                      <strong>Email:</strong>
                      <span>{account.email}</span>
                    </div>
                    <div className="demo-field">
                      <strong>Password:</strong>
                      <span className="password">{account.password}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="common-password-note">
              <strong>All accounts use the same password:</strong> demo123
            </div>
          </div>

          <div className="features-section">
            <h2>✨ What You Can Explore</h2>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">🛍️</span>
                <div>
                  <strong>Browse Services</strong>
                  <p>Discover 15+ services across rides, tutoring, errands, and campus tasks</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎓</span>
                <div>
                  <strong>College Zone</strong>
                  <p>Connect with 8 student profiles from multiple universities</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📅</span>
                <div>
                  <strong>Book Services</strong>
                  <p>Try booking a service and manage your bookings</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">➕</span>
                <div>
                  <strong>Create Listings</strong>
                  <p>Offer your own services or create a student profile</p>
                </div>
              </div>
            </div>
          </div>

          <div className="instructions-section">
            <h2>📋 Quick Start Guide</h2>
            <ol className="instructions-list">
              <li>
                <strong>Connect to WiFi:</strong> Make sure your phone is on the same WiFi network
              </li>
              <li>
                <strong>Scan QR Code:</strong> Use your phone camera to scan the QR code above
              </li>
              <li>
                <strong>Login:</strong> Choose any demo account from the list above
              </li>
              <li>
                <strong>Explore:</strong> Browse services, check out College Zone, and try the features!
              </li>
            </ol>
          </div>

          <div className="tech-stack-section">
            <h3>🛠️ Technology Stack</h3>
            <div className="tech-tags">
              <span className="tech-tag">React</span>
              <span className="tech-tag">Node.js</span>
              <span className="tech-tag">Express</span>
              <span className="tech-tag">MongoDB</span>
              <span className="tech-tag">JWT Auth</span>
              <span className="tech-tag">REST API</span>
            </div>
          </div>

          <div className="project-info">
            <p><strong>Project:</strong> ONTAP-SPU - Student Services Marketplace</p>
            <p><strong>Event:</strong> Saint Peters University Data Science Showcase</p>
            <p><strong>Developer:</strong> Heyram Srinivasan</p>
            <p><strong>Achievement:</strong> Winner of HackSPU 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Showcase;
