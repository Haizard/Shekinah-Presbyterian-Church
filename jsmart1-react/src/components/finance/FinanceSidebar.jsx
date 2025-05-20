import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from '../../context/AuthContext';
import '../../styles/finance/FinanceSidebar.css';
import '../../styles/main.css';

const FinanceSidebar = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { userRole } = useContext(AuthContext);

  // Check if the current path matches the path
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);

    // Notify parent component about the sidebar state change
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  // Set sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      const shouldCollapse = window.innerWidth < 768;
      setCollapsed(shouldCollapse);

      // Notify parent component about the sidebar state change
      if (onToggle) {
        onToggle(shouldCollapse);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [onToggle]);

  return (
    <aside className={`finance-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2>Finance Panel</h2>
        <button type="button" className="toggle-btn" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={collapsed ? 'chevron-right' : 'chevron-left'} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className={isActive('/finance') || isActive('/finance/dashboard') || isActive('/finance/unified') ? 'active' : ''}>
            <Link to="/finance/dashboard">
              <FontAwesomeIcon icon="tachometer-alt" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={isActive('/finance/classic-dashboard') ? 'active' : ''}>
            <Link to="/finance/classic-dashboard">
              <FontAwesomeIcon icon="columns" />
              <span>Classic Dashboard</span>
            </Link>
          </li>

          {/* Finance Management */}
          <li className="nav-section-title">
            <span>Finance Management</span>
          </li>
          <li className={isActive('/finance/transactions') ? 'active' : ''}>
            <Link to="/finance/transactions">
              <FontAwesomeIcon icon="money-bill-alt" />
              <span>Transactions</span>
            </Link>
          </li>
          <li className={isActive('/finance/reports') ? 'active' : ''}>
            <Link to="/finance/reports">
              <FontAwesomeIcon icon="chart-bar" />
              <span>Reports</span>
            </Link>
          </li>
          <li className={isActive('/finance/budget') ? 'active' : ''}>
            <Link to="/finance/budget">
              <span style={{ fontWeight: 'bold', marginRight: '0.75rem' }}>Tsh</span>
              <span>Budget</span>
            </Link>
          </li>
          <li className={isActive('/finance/budget/report') ? 'active' : ''}>
            <Link to="/finance/budget/report">
              <FontAwesomeIcon icon="chart-pie" />
              <span>Budget Report</span>
            </Link>
          </li>

          {/* Donation Management */}
          <li className="nav-section-title">
            <span>Donation Management</span>
          </li>
          <li className={isActive('/finance/donations') ? 'active' : ''}>
            <Link to="/finance/donations">
              <FontAwesomeIcon icon="hand-holding-usd" />
              <span>Donations</span>
            </Link>
          </li>
          <li className={isActive('/finance/payment-config') ? 'active' : ''}>
            <Link to="/finance/payment-config">
              <FontAwesomeIcon icon="credit-card" />
              <span>Payment Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="view-site">
          <FontAwesomeIcon icon="external-link-alt" />
          <span>View Website</span>
        </Link>
        <div className="user-role">
          <FontAwesomeIcon icon="user-tag" />
          <span>Finance User</span>
        </div>
      </div>
    </aside>
  );
};

export default FinanceSidebar;
