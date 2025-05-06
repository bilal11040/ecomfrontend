import React, { useState } from 'react';
import './CSS/Support.css';

const SupportForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
    // Here you can send data to backend or API
    alert('Message sent successfully!');
    setFormData({ email: '', name: '', message: '' });
  };

  return (
    <div className="support-container">
      <div className="support-left">
      <h1>
  We're Here to Help – <span className="highlight">Contact Our Support Team</span> Today!
</h1>
<p>Have questions about your order, shipping, or products? Our support team is ready to assist you for a smooth shopping experience!</p>
<ul className="support-points">
  <li>✅ Get personalized help with your orders, returns, and refunds.</li>
  <li>✅ Assistance with shipping, delivery tracking, and payment queries.</li>
  <li>✅ Product recommendations and guidance for your specific needs.</li>
</ul>

      </div>

      <div className="support-right">
        <form onSubmit={handleSubmit} className="support-form">
          <label>Your Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Your Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Message</label>
          <textarea
            name="message"
            placeholder="Enter your message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit">Submit</button>
          <p className="disclaimer">* Your information is secure with us.</p>
        </form>
      </div>
    </div>
  );
};

export default SupportForm;
