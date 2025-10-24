import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from '../../context/AuthContext';
// Import our modern design system
import '../../styles/main.css';

const AdminSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { userRole } = useContext(AuthContext);

  // Check if user is a finance user
  const isFinanceUser = userRole === 'finance';

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2>{isFinanceUser ? 'Finance Panel' : 'Admin Panel - TEST'}</h2>
        <button type="button" className="toggle-btn" onClick={toggleSidebar}>
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

          {/* Finance Section - Always visible */}
          <li className="nav-section-title">
            <span>Finance Management</span>
          </li>
          <li className={isActive('/admin/finances') ? 'active' : ''}>
            <Link to="/admin/finances">
              <FontAwesomeIcon icon="money-bill-alt" />
              <span>Transactions</span>
            </Link>
          </li>
          <li className={isActive('/admin/finances/reports') ? 'active' : ''}>
            <Link to="/admin/finances/reports">
              <FontAwesomeIcon icon="chart-bar" />
              <span>Reports</span>
            </Link>
          </li>
          <li className={isActive('/admin/finances/budget') ? 'active' : ''}>
            <Link to="/admin/finances/budget">
              <span style={{ fontWeight: 'bold', marginRight: '0.75rem' }}>Tsh</span>
              <span>Budget</span>
            </Link>
          </li>
          <li className={isActive('/admin/finances/budget/report') ? 'active' : ''}>
            <Link to="/admin/finances/budget/report">
              <FontAwesomeIcon icon="chart-pie" />
              <span>Budget Report</span>
            </Link>
          </li>
          <li className={isActive('/admin/donations') ? 'active' : ''}>
            <Link to="/admin/donations">
              <FontAwesomeIcon icon="donate" />
              <span>Donations</span>
            </Link>
          </li>
          <li className={isActive('/admin/payment-config') ? 'active' : ''}>
            <Link to="/admin/payment-config">
              <FontAwesomeIcon icon="credit-card" />
              <span>Payment Settings</span>
            </Link>
          </li>

          {/* Admin-only sections */}
          {!isFinanceUser && (
            <>
              {/* Church Management */}
              <li className="nav-section-title">
                <span>Church Management</span>
              </li>
              <li className={isActive('/admin/church-settings') ? 'active' : ''}>
                <Link to="/admin/church-settings">
                  <FontAwesomeIcon icon="church" />
                  <span>Church Settings</span>
                </Link>
              </li>
              <li className={isActive('/admin/branches') ? 'active' : ''}>
                <Link to="/admin/branches">
                  <FontAwesomeIcon icon="building" />
                  <span>Church Branches</span>
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
              <li className={isActive('/admin/image-debugger') ? 'active' : ''}>
                <Link to="/admin/image-debugger">
                  <FontAwesomeIcon icon="tools" />
                  <span>Image Debugger</span>
                </Link>
              </li>
              <li className={isActive('/admin/content-migration') ? 'active' : ''}>
                <Link to="/admin/content-migration">
                  <FontAwesomeIcon icon="sync" />
                  <span>Content Migration</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="view-site">
          <FontAwesomeIcon icon="external-link-alt" />
          <span>View Website</span>
        </Link>
        {isFinanceUser && (
          <div className="user-role">
            <FontAwesomeIcon icon="user-tag" />
            <span>Finance User</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
