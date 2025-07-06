/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { UserContext } from '../../context/UserContext';

// eslint-disable-next-line react/prop-types
const Navbar = ({setShowLogin}) => {

    const [menu,setMenu] = useState("menu");
    const {getTotalCartAmount} = useContext(StoreContext);
    const { user, logout } = useContext(UserContext);
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState({ name: '', description: '', price: '', image: '', category: '' });
    const [error, setError] = useState('');

    const handleAddItemClick = () => setShowAddModal(true);
    const handleFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const handleFormSubmit = async e => {
      e.preventDefault();
      setError('');
      const res = await fetch('http://localhost:4000/api/food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user?.token ? `Bearer ${user.token}` : ''
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setShowAddModal(false);
        window.location.reload();
      } else {
        setError('Failed to add item');
      }
    };

  return (
    <div className='navbar'>
        <Link to ='/'><img src={assets.logo} alt="" className="logo"/></Link>
        <ul className="navbar-menu">
          <Link to='/' onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>home</Link>
          <a href='#explore-menu' onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>menu</a>
          <a href='#app-download' onClick={()=>setMenu("mobile-app")} className={menu==="mobile-app"?"active":""}>mobile-app</a>
          <a href='#footer' onClick={()=>setMenu("contact-us")} className={menu==="contact-us"?"active":""}>contact us</a>
        </ul>
        <div className="navbar-right">
          <div className="navbar-search-icon">
            <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
            <div className={getTotalCartAmount()===0?"":"dot"}></div>
            <div>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>Welcome, {user.name || user.email || user.role}</span>
                  {user?.role?.toLowerCase() === 'admin' && (
                    <button onClick={handleAddItemClick}>Add Item</button>
                  )}
                  <button onClick={logout}>Logout</button>
                </div>
              ) : (
                <button onClick={()=>setShowLogin(true)}>sign in</button>
              )}
            </div>
          </div>
        </div>
        {showAddModal && (
          <div className="modal" style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
            <form onSubmit={handleFormSubmit} style={{background:'#fff',padding:24,borderRadius:8,minWidth:300}}>
              <h2>Add Food Item</h2>
              <input name="name" placeholder="Name" value={form.name} onChange={handleFormChange} required style={{display:'block',marginBottom:8}} />
              <input name="description" placeholder="Description" value={form.description} onChange={handleFormChange} required style={{display:'block',marginBottom:8}} />
              <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleFormChange} required style={{display:'block',marginBottom:8}} />
              <input name="image" placeholder="Image path (e.g. food_images/food_33.png)" value={form.image} onChange={handleFormChange} required style={{display:'block',marginBottom:8}} />
              <input name="category" placeholder="Category" value={form.category} onChange={handleFormChange} required style={{display:'block',marginBottom:8}} />
              <button type="submit">Add</button>
              <button type="button" onClick={()=>setShowAddModal(false)} style={{marginLeft:8}}>Cancel</button>
              {error && <div style={{color:'red',marginTop:8}}>{error}</div>}
            </form>
          </div>
        )}
    </div>
  )
}

export default Navbar
