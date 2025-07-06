// eslint-disable-next-line no-unused-vars
import React from 'react'
import './Header.css'
import headerImg from '../../assets/header_img.png'

const Header = () => {
  return (
    <div className='header' style={{ background: `url(${headerImg}) no-repeat`, backgroundSize: 'contain' }}>
        <div className='header-contents'>
            <h2>Order Your Favourite Food Here</h2>
            <p>Choose from a divers menu featuring a delectable array of dishes crafted with the finest ingredients and culinary experst. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
            <button>View Menu</button>
        </div>
    </div>
  )
}

export default Header