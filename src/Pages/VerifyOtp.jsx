import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './CSS/VerifyOtp.css';
import api from '../../src/api';
const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [feedback, setFeedback] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { email, username, password } = location.state || {};

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ text: '', type: '' });

    try {
      await api.post('/auth/verify-otp', {
        email,
        otp,
        username,
        password
      });
      setFeedback({ text: 'Account verified successfully!', type: 'success' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setFeedback({ text: 'Invalid OTP. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <form className="verify-form" onSubmit={handleVerifyOtp}>
        <h2 className="verify-title">Verify OTP</h2>
        {feedback.text && (
          <p className={`verify-message ${feedback.type}`}>{feedback.text}</p>
        )}
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
