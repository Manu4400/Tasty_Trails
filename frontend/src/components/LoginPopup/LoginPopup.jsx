// eslint-disable-next-line no-unused-vars
import React, { useState, useContext } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { UserContext } from '../../context/UserContext'

// eslint-disable-next-line react/prop-types
const LoginPopup = ({ setShowLogin }) => {  // Destructure setShowLogin
    const [currState, setCurrState] = useState("Login")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const { setUser } = useContext(UserContext);
    const [error, setError] = useState("");
    const [token, setToken] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            let url, body;
            if (currState === "Sign Up") {
                url = 'http://localhost:4000/api/signup';
                body = JSON.stringify({ name, email, password });
            } else {
                url = 'http://localhost:4000/api/login';
                body = JSON.stringify({ email, password });
            }
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body
            });
            const data = await res.json();
            if (res.ok) {
                if (currState === "Sign Up") {
                    setCurrState("Login");
                    setError("Account created! Please log in.");
                } else {
                    setToken(data.token);
                    const userRes = await fetch('http://localhost:4000/api/me', {
                        headers: { 'Authorization': `Bearer ${data.token}` }
                    });
                    const userInfo = await userRes.json();
                    if (userRes.ok) {
                        setUser({ ...userInfo, token: data.token });
                        setShowLogin(false);
                    } else {
                        setError(userInfo.error || 'Failed to fetch user info');
                    }
                }
            } else {
                setError(data.error || (currState === "Sign Up" ? "Signup failed" : "Login failed"));
            }
        } catch (err) {
            setError('Network error');
        }
    }

    return (
        <div className='login-popup'>
            <form className="login-popup-container" onSubmit={handleSubmit}>
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Login" ? null : <input type='text' placeholder='Your name' value={name} onChange={e => setName(e.target.value)} required />}
                    <input type="email" placeholder='Your email' value={email} onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit">{currState === "Sign Up" ? "Create account" : "Login"}</button>
                {error && <div style={{color:'red',marginTop:'10px'}}>{error}</div>}
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup
