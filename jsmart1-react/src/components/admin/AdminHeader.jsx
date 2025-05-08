import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from '../../context/AuthContext';
import '../../styles/admin/AdminHeader.css';

const AdminHeader = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="admin-header">
      <div className="header-search">
        <FontAwesomeIcon icon="search" />
        <input type="text" placeholder="Search..." />
      </div>
      
      <div className="header-actions">
        <div className="notifications">
          <button className="icon-button">
            <FontAwesomeIcon icon="bell" />
            <span className="badge">3</span>
          </button>
        </div>
        
        <div className="user-dropdown">
          <button className="dropdown-toggle">
            <div className="user-avatar">
              <FontAwesomeIcon icon="user-circle" />
            </div>
            <span className="user-name">{user?.name || 'Admin'}</span>
            <FontAwesomeIcon icon="chevron-down" />
          </button>
          
          <div className="dropdown-menu">
            <Link to="/admin/profile">
              <FontAwesomeIcon icon="user" />
              Profile
            </Link>
            <Link to="/admin/settings">
              <FontAwesomeIcon icon="cog" />
              Settings
            </Link>
            <button onClick={handleLogout}>
              <FontAwesomeIcon icon="sign-out-alt" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
