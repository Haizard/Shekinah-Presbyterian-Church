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

          {/* Church Management */}
          <li className="nav-section-title">
            <span>Church Management</span>
          </li>
          <li className={isActive('/admin/branches') ? 'active' : ''}>
            <Link to="/admin/branches">
              <FontAwesomeIcon icon="building" />
              <span>Branches</span>
            </Link>
          </li>
          <li className={isActive('/admin/members') ? 'active' : ''}>
            <Link to="/admin/members">
              <FontAwesomeIcon icon="users" />
              <span>Members</span>
            </Link>
          </li>
          <li className={isActive('/admin/groups') ? 'active' : ''}>
            <Link to="/admin/groups">
              <FontAwesomeIcon icon="user-friends" />
              <span>Groups</span>
            </Link>
          </li>

          {/* Finance */}
          <li className="nav-section-title">
            <span>Finance</span>
          </li>
          <li className={isActive('/admin/finances') ? 'active' : ''}>
            <Link to="/admin/finances">
              <FontAwesomeIcon icon="money-bill-alt" />
              <span>Income & Expenses</span>
            </Link>
          </li>

          {/* Content Management */}
          <li className="nav-section-title">
            <span>Content Management</span>
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

          {/* Communication */}
          <li className="nav-section-title">
            <span>Communication</span>
          </li>
          <li className={isActive('/admin/contact') ? 'active' : ''}>
            <Link to="/admin/contact">
              <FontAwesomeIcon icon="envelope" />
              <span>Contact Messages</span>
            </Link>
          </li>

          {/* System */}
          <li className="nav-section-title">
            <span>System</span>
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
