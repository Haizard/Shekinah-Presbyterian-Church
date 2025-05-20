import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PaymentConfigDetails = ({ config, onClose, onEdit, onDelete, viewOnly = false }) => {
  if (!config) {
    return (
      <div className="details-container">
        <div className="details-header">
          <h2>Configuration Details</h2>
          <button className="btn btn-icon" onClick={onClose}>
            <FontAwesomeIcon icon="times" />
          </button>
        </div>
        <div className="details-content">
          <p>No configuration selected.</p>
        </div>
      </div>
    );
  }

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

  // Helper function to mask sensitive data
  const maskSensitiveData = (value) => {
    if (!value) return '';
    if (value.length <= 4) return '*'.repeat(value.length);
    return '*'.repeat(value.length - 4) + value.slice(-4);
  };

  // Render gateway-specific details
  const renderGatewayDetails = () => {
    switch (config.gatewayType) {
      case 'mpesa':
        return (
          <div className="gateway-details">
            <h3>M-Pesa Configuration</h3>
            <div className="detail-group">
              <div className="detail-item">
                <span className="detail-label">Business Name:</span>
                <span className="detail-value">{config.mpesa?.businessName || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Business Number:</span>
                <span className="detail-value">{config.mpesa?.businessNumber || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Short Code:</span>
                <span className="detail-value">{config.mpesa?.shortCode || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Account Number:</span>
                <span className="detail-value">{config.mpesa?.accountNumber || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">API Key:</span>
                <span className="detail-value">{maskSensitiveData(config.mpesa?.apiKey) || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">API Secret:</span>
                <span className="detail-value">{maskSensitiveData(config.mpesa?.apiSecret) || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Pass Key:</span>
                <span className="detail-value">{maskSensitiveData(config.mpesa?.passKey) || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Callback URL:</span>
                <span className="detail-value">{config.mpesa?.callbackUrl || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Environment:</span>
                <span className="detail-value">{config.mpesa?.environment || 'sandbox'}</span>
              </div>
            </div>
          </div>
        );

      case 'tigopesa':
        return (
          <div className="gateway-details">
            <h3>Tigo Pesa Configuration</h3>
            <div className="detail-group">
              <div className="detail-item">
                <span className="detail-label">Business Name:</span>
                <span className="detail-value">{config.tigopesa?.businessName || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Business Number:</span>
                <span className="detail-value">{config.tigopesa?.businessNumber || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Account Number:</span>
                <span className="detail-value">{config.tigopesa?.accountNumber || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">API Key:</span>
                <span className="detail-value">{maskSensitiveData(config.tigopesa?.apiKey) || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">API Secret:</span>
                <span className="detail-value">{maskSensitiveData(config.tigopesa?.apiSecret) || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Callback URL:</span>
                <span className="detail-value">{config.tigopesa?.callbackUrl || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Environment:</span>
                <span className="detail-value">{config.tigopesa?.environment || 'sandbox'}</span>
              </div>
            </div>
          </div>
        );

      case 'airtelmoney':
        return (
          <div className="gateway-details">
            <h3>Airtel Money Configuration</h3>
            <div className="detail-group">
              <div className="detail-item">
                <span className="detail-label">Business Name:</span>
                <span className="detail-value">{config.airtelmoney?.businessName || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Business Number:</span>
                <span className="detail-value">{config.airtelmoney?.businessNumber || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Account Number:</span>
                <span className="detail-value">{config.airtelmoney?.accountNumber || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">API Key:</span>
                <span className="detail-value">{maskSensitiveData(config.airtelmoney?.apiKey) || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">API Secret:</span>
                <span className="detail-value">{maskSensitiveData(config.airtelmoney?.apiSecret) || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Callback URL:</span>
                <span className="detail-value">{config.airtelmoney?.callbackUrl || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Environment:</span>
                <span className="detail-value">{config.airtelmoney?.environment || 'sandbox'}</span>
              </div>
            </div>
          </div>
        );

      case 'bank':
        return (
          <div className="gateway-details">
            <h3>Bank Account Configuration</h3>
            <div className="detail-group">
              <div className="detail-item">
                <span className="detail-label">Bank Name:</span>
                <span className="detail-value">{config.bank?.bankName || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Account Name:</span>
                <span className="detail-value">{config.bank?.accountName || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Account Number:</span>
                <span className="detail-value">{config.bank?.accountNumber || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Branch Name:</span>
                <span className="detail-value">{config.bank?.branchName || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Swift Code:</span>
                <span className="detail-value">{config.bank?.swiftCode || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Routing Number:</span>
                <span className="detail-value">{config.bank?.routingNumber || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Instructions:</span>
                <span className="detail-value">{config.bank?.instructions || 'Not set'}</span>
              </div>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="gateway-details">
            <h3>Card Payment Configuration</h3>
            <div className="detail-group">
              <div className="detail-item">
                <span className="detail-label">Provider:</span>
                <span className="detail-value">{config.card?.provider || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Merchant ID:</span>
                <span className="detail-value">{config.card?.merchantId || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Public Key:</span>
                <span className="detail-value">{maskSensitiveData(config.card?.publicKey) || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Private Key:</span>
                <span className="detail-value">{maskSensitiveData(config.card?.privateKey) || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Environment:</span>
                <span className="detail-value">{config.card?.environment || 'sandbox'}</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="gateway-details">
            <p>No specific details available for this gateway type.</p>
          </div>
        );
    }
  };

  return (
    <div className="details-container">
      <div className="details-header">
        <div className="title-with-icon">
          <FontAwesomeIcon icon={getGatewayIcon(config.gatewayType)} />
          <h2>{config.name}</h2>
        </div>
        <div className="header-actions">
          {!viewOnly && (
            <>
              <button className="btn btn-primary" onClick={onEdit}>
                <FontAwesomeIcon icon="edit" />
                Edit
              </button>
              <button className="btn btn-danger" onClick={onDelete}>
                <FontAwesomeIcon icon="trash-alt" />
                Delete
              </button>
            </>
          )}
          {viewOnly && (
            <div className="view-only-badge">
              <FontAwesomeIcon icon="eye" /> View Only
            </div>
          )}
          <button className="btn btn-icon" onClick={onClose}>
            <FontAwesomeIcon icon="times" />
          </button>
        </div>
      </div>

      <div className="details-content">
        <div className="detail-section">
          <h3>General Information</h3>
          <div className="detail-group">
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{config.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Gateway Type:</span>
              <span className="detail-value">{getGatewayTypeDisplay(config.gatewayType)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Display Name:</span>
              <span className="detail-value">{config.displayName || config.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className={`badge ${config.isActive ? 'badge-success' : 'badge-danger'}`}>
                {config.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Description:</span>
              <span className="detail-value">{config.description || 'No description'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Display Order:</span>
              <span className="detail-value">{config.displayOrder || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Icon Class:</span>
              <span className="detail-value">{config.iconClass || 'Not set'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Created:</span>
              <span className="detail-value">{new Date(config.createdAt).toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Updated:</span>
              <span className="detail-value">{new Date(config.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {renderGatewayDetails()}
      </div>
    </div>
  );
};

export default PaymentConfigDetails;
