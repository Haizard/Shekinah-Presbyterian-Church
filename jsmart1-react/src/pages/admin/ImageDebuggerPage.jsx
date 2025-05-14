import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageDebugger from '../../components/admin/ImageDebugger';

const ImageDebuggerPage = () => {
  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div className="admin-page-header">
          <h1>Image Debugger</h1>
          <p>Diagnose and fix image loading issues across the website</p>
        </div>
        
        <ImageDebugger />
      </div>
    </AdminLayout>
  );
};

export default ImageDebuggerPage;
