import React from 'react'
import Banner from '../Pages/Banner' 
import Latest from '../Components/Latest/Latest'
import Classic from '../Components/Classic/Classic'
import Offer from '../Components/Offer/Offer'
import Newsletter from '../Components/Newsletter/Newsletter'
const Home = () => {
  return (
    <div>
       <Banner/>
       <Latest/>
       <Offer/>
       <Classic/>
       <Newsletter/>
       
    </div>
  )
}

export default Home