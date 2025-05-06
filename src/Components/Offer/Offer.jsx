import React from 'react'
import offerimg from '../Assets/offer.jpg'
import './Offer.css'

const Offer = () => {
  return (
    <div className='offer'>
      <img src={offerimg} alt="" />
      <div className='button'>
      <button>SHOP NOW</button>
      </div>
    </div>

  )
}

export default Offer
