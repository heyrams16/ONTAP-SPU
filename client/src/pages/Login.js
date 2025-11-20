import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import api from '../services/api';
import './Auth.css';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkUrl, setMagicLinkUrl] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (useMagicLink) {
        // Send magic link
        const response = await api.post('/magic-link/request', { email: formData.email });
        setMagicLinkSent(true);
        setMagicLinkUrl(response.data.magicLink);
        setSuccess(`Magic link sent to ${formData.email}! Check your email or click the link below.`);
      } else {
        // Regular login
        const response = await authAPI.login(formData);
        onLogin(response.data.user, response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkClick = () => {
    if (magicLinkUrl) {
      window.location.href = magicLinkUrl;
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Login to ONTAP-SPU</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {magicLinkSent && magicLinkUrl ? (
          <div className="magic-link-sent">
            <div className="magic-link-icon">✨</div>
            <h3>Magic Link Sent!</h3>
            <p>We've sent a magic link to <strong>{formData.email}</strong></p>
            <p className="magic-link-instructions">
              In production, you would check your email. For development, click below:
            </p>
            <button onClick={handleMagicLinkClick} className="btn btn-primary btn-block">
              Open Magic Link
            </button>
            <button
              onClick={() => {
                setMagicLinkSent(false);
                setMagicLinkUrl('');
                setSuccess('');
              }}
              className="btn btn-secondary btn-block"
              style={{ marginTop: '10px' }}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <div className="auth-method-toggle">
              <button
                type="button"
                className={`method-btn ${!useMagicLink ? 'active' : ''}`}
                onClick={() => setUseMagicLink(false)}
              >
                Password Login
              </button>
              <button
                type="button"
                className={`method-btn ${useMagicLink ? 'active' : ''}`}
                onClick={() => setUseMagicLink(true)}
              >
                ✨ Magic Link
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>University Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@university.edu"
                />
              </div>

              {!useMagicLink && (
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!useMagicLink}
                    placeholder="Enter your password"
                  />
                </div>
              )}

              {useMagicLink && (
                <div className="magic-link-info">
                  <p>We'll send you a magic link to log in without a password!</p>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? (useMagicLink ? 'Sending Magic Link...' : 'Logging in...') : (useMagicLink ? 'Send Magic Link' : 'Login')}
              </button>
            </form>

            <p className="auth-footer">
              Don't have an account? <Link to="/register">Sign up here</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
