// AboutUs.jsx
import React from 'react';
import './CSS/Aboutus.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>About Us</h1>
        <p>Your Trusted E-commerce Partner</p>
      </header>

      <section className="about-content">
        <div className="about-image"></div>
        <div className="about-text">
          <h2>Who We Are</h2>
          <p>
            We are a forward-thinking e-commerce company committed to delivering top-quality products and exceptional customer service. Our mission is to create a seamless online shopping experience tailored to your needs.
          </p>

          <h2>Our Mission</h2>
          <p>
            To empower consumers by offering a curated selection of the best products with unbeatable convenience and reliability.
          </p>

          <h2>Why Choose Us?</h2>
          <ul>
            <li>Premium Quality Products</li>
            <li>Fast & Secure Shipping</li>
            <li>24/7 Customer Support</li>
            <li>Easy Returns & Refunds</li>
          </ul>
        </div>
      </section>

     
    </div>
  );
};

export default AboutUs;