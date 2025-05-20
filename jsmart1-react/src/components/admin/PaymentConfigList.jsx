import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PaymentConfigList = ({ paymentConfigs, loading, error, onView, onEdit, onDelete }) => {
  // Helper function to get gateway type display name
  const getGatewayTypeDisplay = (type) => {
    const types = {
      mpesa: 'M-Pesa',
      tigopesa: 'Tigo Pesa',
      airtelmoney: 'Airtel Money',
      bank: 'Bank Account',
      card: 'Card Payment'
    };
    
    return types[type] || type;
  };
  
  // Helper function to get gateway icon
  const getGatewayIcon = (type) => {
    const icons = {
      mpesa: 'mobile-alt',
      tigopesa: 'mobile-alt',
      airtelmoney: 'mobile-alt',
      bank: 'university',
      card: 'credit-card'
    };
    
    return icons[type] || 'question-circle';
  };
  
  // Helper function to get status badge class
  const getStatusBadgeClass = (isActive) => {
    return isActive ? 'badge-success' : 'badge-danger';
  };
  
  // Helper function to get status text
  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon="spinner" spin size="2x" />
        <p>Loading payment configurations...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <FontAwesomeIcon icon="exclamation-triangle" size="2x" />
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }
  
  if (paymentConfigs.length === 0) {
    return (
      <div className="empty-state">
        <FontAwesomeIcon icon="credit-card" size="3x" />
        <h3>No Payment Configurations Found</h3>
        <p>Add a new payment configuration to get started.</p>
      </div>
    );
  }
  
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Gateway Type</th>
            <th>Display Name</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paymentConfigs.map((config) => (
            <tr key={config._id}>
              <td className="name-cell">
                <div className="name-with-icon">
                  <FontAwesomeIcon icon={getGatewayIcon(config.gatewayType)} />
                  <span>{config.name}</span>
                </div>
              </td>
              <td>
                <span className="gateway-type">
                  {getGatewayTypeDisplay(config.gatewayType)}
                </span>
              </td>
              <td>{config.displayName || config.name}</td>
              <td>
                <span className={`badge ${getStatusBadgeClass(config.isActive)}`}>
                  {getStatusText(config.isActive)}
                </span>
              </td>
              <td>
                {new Date(config.updatedAt).toLocaleDateString()}
              </td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="btn btn-icon btn-view" 
                    onClick={() => onView(config)}
                    title="View Details"
                  >
                    <FontAwesomeIcon icon="eye" />
                  </button>
                  <button 
                    className="btn btn-icon btn-edit" 
                    onClick={() => onEdit(config)}
                    title="Edit Configuration"
                  >
                    <FontAwesomeIcon icon="edit" />
                  </button>
                  <button 
                    className="btn btn-icon btn-delete" 
                    onClick={() => onDelete(config._id)}
                    title="Delete Configuration"
                  >
                    <FontAwesomeIcon icon="trash-alt" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentConfigList;
