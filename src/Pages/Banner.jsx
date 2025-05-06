import React from 'react'
import banner2 from '../Components/Assets/banner.jpg'
import './Banner.css'

const Banner = () => {
  return (
    <div className='banner'>
      <div className="banner-container">
        <img src={banner2} alt="" className="banner-image" />
        <div className="banner-content flex flex-col items-center text-center p-6 sm:p-10 md:p-16">
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Hi from bottom of my heart</h2>
  <h3 className="text-lg sm:text-xl md:text-2xl mt-2">Hello guys</h3>
  <button className="mt-4 px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all">
    Press Here
  </button>
</div>

      </div>
    </div>
  )
}

export default Banner