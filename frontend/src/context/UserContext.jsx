import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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

  const setUserWithToken = (userObj) => {
    if (userObj?.token) {
      localStorage.setItem('jwt_token', userObj.token);
    }
    setUser(userObj);
  };

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