import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = await AsyncStorage.getItem('session');
      if (session) {
        setUser(JSON.parse(session));
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const login = async ({ email, password }) => {
    if (email === 'admin@test.com' && password === 'admin123') {
      const userData = {
        email,
        role: 'admin',
        token: 'abc123'
      };
      await AsyncStorage.setItem('session', JSON.stringify(userData));
      setUser(userData);
      return true;
    }

    if (email === 'user@test.com' && password === 'user123') {
      const userData = {
        email,
        role: 'user',
        token: 'xyz789'
      };
      await AsyncStorage.setItem('session', JSON.stringify(userData));
      setUser(userData);
      return true;
    }

    return false;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('session');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  if (loading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
