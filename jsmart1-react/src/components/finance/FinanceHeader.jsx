import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from '../../context/AuthContext';
import '../../styles/finance/FinanceHeader.css';

const FinanceHeader = () => {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
    // Redirect will be handled by the AuthContext
  };

  return (
    <header className="finance-header">
      <div className="header-title">
        <h1>Finance Management</h1>
      </div>
      
      <div className="header-actions">
        <div className="user-dropdown">
          <button className="user-button" onClick={toggleDropdown}>
            <div className="user-avatar">
              <FontAwesomeIcon icon="user" />
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Finance User'}</span>
              <span className="user-role">Finance Role</span>
            </div>
            <FontAwesomeIcon icon={showDropdown ? 'chevron-up' : 'chevron-down'} />
          </button>
          
          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/finance/profile" className="dropdown-item">
                <FontAwesomeIcon icon="user-circle" />
                <span>Profile</span>
              </Link>
              <Link to="/finance/settings" className="dropdown-item">
                <FontAwesomeIcon icon="cog" />
                <span>Settings</span>
              </Link>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout-button" onClick={handleLogout}>
                <FontAwesomeIcon icon="sign-out-alt" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default FinanceHeader;
