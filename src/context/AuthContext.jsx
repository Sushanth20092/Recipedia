import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile().then(({ user, error }) => {
        if (!error) {
          setUser(user);
        } else {
          localStorage.removeItem('token');
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await api.login(email, password);
    if (response.token) {
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const register = async (username, email, password) => {
    const response = await api.register(username, email, password);
    if (response.token) {
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
