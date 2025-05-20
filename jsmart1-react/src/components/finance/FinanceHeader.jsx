import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from '../../context/AuthContext';
import '../../styles/finance/FinanceHeader.css';
import '../../styles/main.css';

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
        <h1>Finance Dashboard</h1>
      </div>

      <div className="header-actions">
        <div className="header-search">
          <FontAwesomeIcon icon="search" />
          <input type="text" placeholder="Search..." className="form-control" />
        </div>

        <div className="notifications">
          <button className="header-icon-btn">
            <FontAwesomeIcon icon="bell" />
            <span className="notification-badge"></span>
          </button>
        </div>

        <div className="user-profile" onClick={toggleDropdown}>
          <div className="user-avatar">
            <FontAwesomeIcon icon="user-circle" size="2x" />
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Finance User'}</span>
            <span className="user-role">Finance Role</span>
          </div>
          <FontAwesomeIcon icon="chevron-down" className="ml-2" />

          {showDropdown && (
            <div className="dropdown-menu animate-fade-in">
              <Link to="/finance/profile" className="dropdown-item">
                <FontAwesomeIcon icon="user" className="mr-2" />
                <span>Profile</span>
              </Link>
              <Link to="/finance/settings" className="dropdown-item">
                <FontAwesomeIcon icon="cog" className="mr-2" />
                <span>Settings</span>
              </Link>
              <button onClick={handleLogout} className="dropdown-item text-error">
                <FontAwesomeIcon icon="sign-out-alt" className="mr-2" />
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
