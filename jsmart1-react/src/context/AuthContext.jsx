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
      // Trim email and password to prevent whitespace issues
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      console.log('Attempting login with:', { email: trimmedEmail, password: trimmedPassword });

      const data = await api.auth.login({
        email: trimmedEmail,
        password: trimmedPassword
      });

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
    // Get the current user role before removing from localStorage
    const currentRole = user?.role;

    // Remove user from localStorage
    localStorage.removeItem('user');
    setUser(null);

    // Redirect based on role
    if (currentRole === 'finance') {
      window.location.href = '/finance/login';
    } else {
      window.location.href = '/';
    }
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
        isFinance: user?.role === 'finance' || user?.isAdmin,
        userRole: user?.role || 'user',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
