import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
// Import our modern design system
import '../../styles/main.css';

const AdminLayout = ({ children }) => {
  const { isAuthenticated, isAdmin, isFinance, userRole, loading } = useContext(AuthContext);

  // TEMPORARY: For development, bypass authentication check
  const bypassAuth = process.env.NODE_ENV === 'development';

  // Show loading state
  if (loading && !bypassAuth) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p className="mt-4">Loading admin panel...</p>
      </div>
    );
  }

  // Redirect if not authenticated (unless bypassed)
  if (!bypassAuth && !isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Redirect finance users trying to access non-finance pages
  if (!bypassAuth && userRole === 'finance' && !window.location.pathname.includes('/finances') && window.location.pathname !== '/admin' && window.location.pathname !== '/admin/dashboard') {
    return <Navigate to="/admin/finances" replace />;
  }

  // Redirect non-admin users trying to access admin-only pages
  if (!bypassAuth && !isAdmin && !isFinance) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
