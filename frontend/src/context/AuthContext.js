import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const API_URL = 'http://localhost:5000'; // backend URL

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Axios default
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(userStr));
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });

    const { token, ...userData } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    setUser(userData);
    navigate('/dashboard');
  };

  const register = async (name, email, password, role = 'cashier') => {
    const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password, role });

    const { token, ...userData } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    setUser(userData);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    login,
    register,
    logout,
    API_URL,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
