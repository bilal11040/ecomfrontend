import React from 'react'
import newsletterbg from '../Assets/newsletter1.jpg'
import './Newsletter.css'

const Newsletter = () => {
  return (
  
      <div className="newsletter">
  <img src={newsletterbg} alt="Newsletter Banner" />
  <div className="content">
    <div>
    <h1>Get Exclusive Offers On Your Email</h1>
    </div>
    
    <p>Subscribe us and stay updated</p>
    <div className="input">
      <input type="email" placeholder="Your Email ID" />
      <button>Subscribe</button>
    </div>
  </div>
</div>

  )
}

export default Newsletter
