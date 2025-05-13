import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/finance/FinanceSidebar.css';

const FinanceSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Check if the current path matches the given path
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Set sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
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
  }, []);

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
          <li className={isActive('/finance') || isActive('/finance/dashboard') ? 'active' : ''}>
            <Link to="/finance/dashboard">
              <FontAwesomeIcon icon="tachometer-alt" />
              <span>Dashboard</span>
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
              <FontAwesomeIcon icon="file-invoice-dollar" />
              <span>Budget</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <span>Finance User</span>
      </div>
    </aside>
  );
};

export default FinanceSidebar;
