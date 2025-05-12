import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import '../../styles/admin/modern-admin.css';
import '../../styles/admin/AdminLayout.css';

const AdminLayout = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);

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

  // Redirect if not authenticated or not an admin (unless bypassed)
  if (!bypassAuth && (!isAuthenticated || !isAdmin)) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AdminSidebar />
      <div className="admin-main" style={{ flex: 1, overflow: 'auto' }}>
        <AdminHeader />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
