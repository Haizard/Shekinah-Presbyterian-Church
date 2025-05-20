import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import FinanceSidebar from './FinanceSidebar';
import FinanceHeader from './FinanceHeader';
import '../../styles/finance/FinanceLayout.css';
import '../../styles/main.css';

const FinanceLayout = ({ children }) => {
  const { isAuthenticated, userRole, loading } = useContext(AuthContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Function to handle sidebar toggle
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  // TEMPORARY: For development, bypass authentication check
  const bypassAuth = process.env.NODE_ENV === 'development';

  // Show loading state
  if (loading && !bypassAuth) {
    return (
      <div className="finance-loading">
        <div className="finance-spinner" />
        <p className="text-secondary">Loading...</p>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!bypassAuth && !isAuthenticated) {
    return <Navigate to="/finance/login" replace />;
  }

  // Redirect if not a finance user (and not an admin)
  if (!bypassAuth && isAuthenticated && userRole !== 'finance' && userRole !== 'admin') {
    return <Navigate to="/finance/login" replace />;
  }

  return (
    <div className="finance-layout">
      <FinanceSidebar onToggle={handleSidebarToggle} />
      <div className={`finance-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <FinanceHeader />
        <main className="finance-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default FinanceLayout;
