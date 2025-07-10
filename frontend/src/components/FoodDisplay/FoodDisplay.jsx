// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import { UserContext } from '../../context/UserContext'

const FoodDisplay = ({category}) => {

    const {food_list} = useContext(StoreContext)
    const { user } = useContext(UserContext);

    return (
        <div className='food-display' id='food-display'>
            <h2>Top Dishes near you</h2>
            <div className="food-display-list">
                {food_list.map((item,index)=>{
                  if (category==="All" || category===item.category) {
                     return <FoodItem key={index} id={item.id} name={item.name} description={item.description} price={item.price} image={item.image}/>
                  }  
                })}
            </div>
        </div>
    )
}

export default FoodDisplay