import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './CSS/Signup.css';
import api from '../../src/api';
const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setMessage('Sending OTP...');

    try {
      await api.post('/auth/Signup', formData);
      setMessage('OTP sent! Please verify.');
      navigate('/verify-otp', { state: formData });
    } catch (error) {
      setMessage('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="signup-title">Create an Account</h2>
        {message && <p className="signup-message">{message}</p>}
        <input
          type="text"
          name="username"
          placeholder="First Name"
    
          required
        /> 
         <input
        type="text"
        name="username"
        placeholder="Last Name"

        required
      />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
 <input
          type="password"
          name="password"
          placeholder="Confirm Password"
     
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Sign Up'}
        </button>

        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
