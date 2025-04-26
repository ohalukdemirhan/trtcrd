import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored token and validate it
    const token = localStorage.getItem('token');
    if (token) {
      // Set the token in the API instance
      api.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Validate token with backend
      api.api.get('/auth/me')
        .then(response => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Auth validation error:', error);
          localStorage.removeItem('token');
          delete api.api.defaults.headers.common['Authorization'];
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      // Attempt login
      const { access_token } = await api.login(email, password);
      localStorage.setItem('token', access_token);
      
      // Get user data
      try {
        const response = await api.api.get('/auth/me');
        setUser(response.data);
      } catch (userError) {
        console.error('Failed to fetch user data:', userError);
        throw new Error('Failed to fetch user data after login');
      }
    } catch (err) {
      console.error('Login process error:', err);
      setError('Login failed. Please check your credentials and try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      localStorage.removeItem('token');
      delete api.api.defaults.headers.common['Authorization'];
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Logout failed. Please try again.');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 