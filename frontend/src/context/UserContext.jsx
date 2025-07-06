import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, check for token in localStorage and fetch user info
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token && !user) {
      fetch('http://localhost:4000/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.role) {
            setUser({ ...data, token });
          }
        });
    }
  }, []);

  // When user logs in, persist token
  const setUserWithToken = (userObj) => {
    if (userObj?.token) {
      localStorage.setItem('jwt_token', userObj.token);
    }
    setUser(userObj);
  };

  // When user logs out, clear token
  const logout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser: setUserWithToken, logout }}>
      {children}
    </UserContext.Provider>
  );
}; 