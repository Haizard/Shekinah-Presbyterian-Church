import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from '../../context/AuthContext';
// Import our modern design system
import '../../styles/main.css';

const AdminHeader = () => {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="admin-header">
      <div className="header-search">
        <input type="text" placeholder="Search..." className="form-control" />
        <FontAwesomeIcon icon="search" />
      </div>

      <div className="header-actions">
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
            <span className="user-name">{user?.name || 'Admin'}</span>
            <span className="user-role">{user?.role || 'Administrator'}</span>
          </div>
          <FontAwesomeIcon icon="chevron-down" className="ml-2" />

          {showDropdown && (
            <div className="dropdown-menu animate-fade-in">
              <Link to="/admin/profile" className="dropdown-item">
                <FontAwesomeIcon icon="user" className="mr-2" />
                <span>Profile</span>
              </Link>
              <Link to="/admin/settings" className="dropdown-item">
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

export default AdminHeader;
