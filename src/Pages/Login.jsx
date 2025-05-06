import React, { useState, useContext } from 'react';

import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import './CSS/login.css';
import api from '../../src/api';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", formData);
  
      setMessage("Login successful!");
      console.log("response", response.data);
  
      // ✅ Store username, email, and token in AuthContext
      login(response.data.username, response.data.email, response.data.token);
  
      navigate("/"); // Redirect after login
    } catch (error) {
      setMessage("Login failed. Please check your credentials.");
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-box transparent-box">
        <h2>Login</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="login-link">Don't have an account? <Link to="/Signup">Sign up here</Link></p>
      </div>
    </div>
  );
};

export default Login;
