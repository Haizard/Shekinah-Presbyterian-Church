import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import FinanceSidebar from './FinanceSidebar';
import AdminHeader from '../admin/AdminHeader';
import '../../styles/admin/AdminLayout.css';

const FinanceLayout = ({ children }) => {
  const { isAuthenticated, isFinance, loading } = useContext(AuthContext);

  // TEMPORARY: For development, bypass authentication check
  const bypassAuth = process.env.NODE_ENV === 'development';

  // Show loading state
  if (loading && !bypassAuth) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p className="text-secondary">Loading...</p>
      </div>
    );
  }

  // Redirect if not authenticated or not a finance user
  if (!bypassAuth && (!isAuthenticated || !isFinance)) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      <FinanceSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default FinanceLayout;
