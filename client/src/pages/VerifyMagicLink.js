import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

function VerifyMagicLink({ onLogin }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your magic link...');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token found');
        return;
      }

      try {
        // Verify the magic link
        const response = await api.post('/magic-link/verify', { token });

        setStatus('success');
        setMessage('Login successful! Redirecting to dashboard...');

        // Log the user in
        onLogin(response.data.user, response.data.token);

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);

      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.error ||
          'Invalid or expired magic link. Please try logging in again.'
        );
      }
    };

    verifyToken();
  }, [token, navigate, onLogin]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="magic-link-verify">
          {status === 'verifying' && (
            <>
              <div className="verify-spinner"></div>
              <h2>Verifying Magic Link</h2>
              <p>{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="verify-success-icon">✓</div>
              <h2>Success!</h2>
              <p>{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="verify-error-icon">✕</div>
              <h2>Verification Failed</h2>
              <p>{message}</p>
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary btn-block"
                style={{ marginTop: '20px' }}
              >
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyMagicLink;
