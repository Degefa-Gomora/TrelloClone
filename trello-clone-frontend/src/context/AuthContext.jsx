
// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { login, register, getMe } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true); // To check if initial token check is done

  // Function to set token and user, and store in localStorage
  const setAuth = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  // Login function
  const signIn = async (email, password) => {
    try {
      const data = await login(email, password);
      setAuth(data.token, data.user);
      return data; // Return data for navigation/feedback
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const signUp = async (username, email, password) => {
    try {
      const data = await register(username, email, password);
      setAuth(data.token, data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const signOut = () => {
    setAuth(null, null);
  };

  // Effect to load user data if token exists on mount
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await getMe(token);
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user from token, logging out:', error);
          signOut(); // Clear invalid token
        }
      }
      setLoading(false); // Finished checking
    };
    loadUser();
  }, [token]); // Re-run if token changes (e.g. manually cleared token)

  const value = {
    user,
    token,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};