import React, { useState, useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from '../../context/AuthContext';
import '../../styles/admin/Login.css';

const FinanceLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated, userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to appropriate dashboard
    if (isAuthenticated) {
      if (userRole === 'finance') {
        navigate('/finance/dashboard');
      } else if (userRole === 'admin') {
        navigate('/admin/dashboard');
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await login(email, password);
      
      if (!result.success) {
        setError(result.message || 'Invalid credentials');
      } else {
        // Check if the user is a finance user
        if (result.role !== 'finance') {
          setError('You do not have permission to access the finance panel');
        }
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated and is finance user, redirect to finance dashboard
  if (isAuthenticated && userRole === 'finance') {
    return <Navigate to="/finance/dashboard" replace />;
  }

  // If already authenticated and is admin, redirect to admin dashboard
  if (isAuthenticated && userRole === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="admin-login-container finance-login">
      <div className="admin-login-card">
        <div className="login-header">
          <h2>Finance Panel Login</h2>
          <p>Shekinah Presbyterian Church Tanzania</p>
        </div>
        
        {error && (
          <div className="alert alert-danger">
            <FontAwesomeIcon icon="exclamation-circle" />
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <FontAwesomeIcon icon="envelope" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <FontAwesomeIcon icon="lock" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner-border spinner-border-sm"></div>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon="sign-in-alt" />
                <span>Login</span>
              </>
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <a href="/">Back to Website</a>
        </div>
      </div>
    </div>
  );
};

export default FinanceLogin;
