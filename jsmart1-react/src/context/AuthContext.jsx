import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      const data = await api.auth.login({ email, password });

      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'An error occurred during login' };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Register user
  const register = async (name, email, password) => {
    try {
      const data = await api.auth.register({ name, email, password });

      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'An error occurred during registration' };
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const data = await api.auth.updateProfile(userData);

      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: error.message || 'An error occurred during profile update' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
