import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('diamond_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      const adminData = { username: 'admin', role: 'admin', name: 'Super Admin', balance: 0 };
      setUser(adminData);
      localStorage.setItem('diamond_user', JSON.stringify(adminData));
      return { success: true, role: 'admin' };
    } else if (username === 'user' && password === 'user123') {
      const userData = { username: 'user', role: 'user', name: 'Regular User', balance: 1000 };
      setUser(userData);
      localStorage.setItem('diamond_user', JSON.stringify(userData));
      return { success: true, role: 'user' };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const updateBalance = (amount) => {
    if (!user) return;
    const updatedUser = { ...user, balance: (user.balance || 0) + amount };
    setUser(updatedUser);
    localStorage.setItem('diamond_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('diamond_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
};
