import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './NetworkAccess.css';

function NetworkAccess() {
  const [shouldShow, setShouldShow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [networkUrl, setNetworkUrl] = useState('');

  useEffect(() => {
    // Get the current host
    const hostname = window.location.hostname;

    // If it's localhost, show the network access helper
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      setShouldShow(true);
      // Use the detected IP address
      const port = window.location.port || '3000';
      setNetworkUrl(`http://192.168.0.119:${port}`);
    }
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(networkUrl);
    alert('URL copied to clipboard!');
  };

  if (!shouldShow) return null;

  return (
    <div className="network-access-panel">
      <button
        className="network-toggle-btn"
        onClick={() => setIsModalOpen(true)}
      >
        📱 Mobile Access
      </button>

      {isModalOpen && (
        <div className="network-access-modal">
          <div className="network-access-content">
            <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>✕</button>

            <h2>📱 Access from Your Phone</h2>

            <div className="qr-code-container">
              <QRCodeCanvas
                value={networkUrl}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="network-url-section">
              <p className="instruction-text">Scan this QR code with your phone's camera</p>
              <p className="or-text">OR</p>
              <div className="url-copy-section">
                <input
                  type="text"
                  value={networkUrl}
                  readOnly
                  className="network-url-input"
                  onClick={(e) => e.target.select()}
                />
                <button className="copy-btn" onClick={copyToClipboard}>
                  Copy
                </button>
              </div>
              <p className="help-text">
                📍 Make sure your phone is on the same WiFi network
              </p>
            </div>

            <div className="network-info">
              <h3>Steps to Access:</h3>
              <ol>
                <li>Connect your phone to the same WiFi as your computer</li>
                <li>Scan the QR code with your camera app</li>
                <li>Or manually type the URL in your phone's browser</li>
                <li>The app will load on your phone!</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NetworkAccess;
