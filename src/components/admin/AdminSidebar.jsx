import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/admin/AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={collapsed ? 'chevron-right' : 'chevron-left'} />
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li className={isActive('/admin') ? 'active' : ''}>
            <Link to="/admin">
              <FontAwesomeIcon icon="tachometer-alt" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={isActive('/admin/ministries') ? 'active' : ''}>
            <Link to="/admin/ministries">
              <FontAwesomeIcon icon="church" />
              <span>Ministries</span>
            </Link>
          </li>
          <li className={isActive('/admin/sermons') ? 'active' : ''}>
            <Link to="/admin/sermons">
              <FontAwesomeIcon icon="bible" />
              <span>Sermons</span>
            </Link>
          </li>
          <li className={isActive('/admin/events') ? 'active' : ''}>
            <Link to="/admin/events">
              <FontAwesomeIcon icon="calendar-alt" />
              <span>Events</span>
            </Link>
          </li>
          <li className={isActive('/admin/gallery') ? 'active' : ''}>
            <Link to="/admin/gallery">
              <FontAwesomeIcon icon="images" />
              <span>Gallery</span>
            </Link>
          </li>
          <li className={isActive('/admin/content') ? 'active' : ''}>
            <Link to="/admin/content">
              <FontAwesomeIcon icon="file-alt" />
              <span>Content</span>
            </Link>
          </li>
          <li className={isActive('/admin/contact') ? 'active' : ''}>
            <Link to="/admin/contact">
              <FontAwesomeIcon icon="envelope" />
              <span>Contact Messages</span>
            </Link>
          </li>
          <li className={isActive('/admin/settings') ? 'active' : ''}>
            <Link to="/admin/settings">
              <FontAwesomeIcon icon="cog" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <Link to="/" className="view-site">
          <FontAwesomeIcon icon="external-link-alt" />
          <span>View Website</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
