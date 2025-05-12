import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const TestSidebar = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Test Sidebar</h1>
        <p>This is a test page to verify that the sidebar is rendering correctly.</p>
      </div>
    </div>
  );
};

export default TestSidebar;
