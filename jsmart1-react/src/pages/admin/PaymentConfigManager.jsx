import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import PaymentConfigList from '../../components/admin/PaymentConfigList';
import PaymentConfigDetails from '../../components/admin/PaymentConfigDetails';
import api from '../../services/api';
import '../../styles/admin/DataManager.css';
import '../../styles/admin/PaymentConfigManager.css';
import '../../styles/admin/ViewOnlyMode.css';

const PaymentConfigManager = () => {
  const [paymentConfigs, setPaymentConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentConfig, setCurrentConfig] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch payment configurations
  useEffect(() => {
    const fetchPaymentConfigs = async () => {
      try {
        setLoading(true);

        let response;
        if (activeTab === 'all') {
          response = await api.paymentConfig.getAll();
        } else {
          response = await api.paymentConfig.getByType(activeTab);
        }

        setPaymentConfigs(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching payment configurations:', err);
        setError('Failed to load payment configurations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentConfigs();
  }, [activeTab, refreshTrigger]);

  // Handle view configuration details
  const handleViewDetails = (config) => {
    setCurrentConfig(config);
    setShowDetails(true);
  };

  // Handle details close
  const handleDetailsClose = () => {
    setShowDetails(false);
    setCurrentConfig(null);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <AdminLayout>
      <div className="data-manager payment-config-manager">
        <div className="page-header">
          <div className="title-section">
            <h1>Payment Configuration Viewer</h1>
            <p>View payment gateway configurations for donations</p>
            <div className="view-only-badge">
              <FontAwesomeIcon icon="eye" /> View Only Mode
            </div>
          </div>
        </div>

        <div className="filter-tabs">
          <div className="tabs">
            <button
              className={activeTab === 'all' ? 'active' : ''}
              onClick={() => handleTabChange('all')}
            >
              All Configurations
            </button>
            <button
              className={activeTab === 'mpesa' ? 'active' : ''}
              onClick={() => handleTabChange('mpesa')}
            >
              M-Pesa
            </button>
            <button
              className={activeTab === 'tigopesa' ? 'active' : ''}
              onClick={() => handleTabChange('tigopesa')}
            >
              Tigo Pesa
            </button>
            <button
              className={activeTab === 'airtelmoney' ? 'active' : ''}
              onClick={() => handleTabChange('airtelmoney')}
            >
              Airtel Money
            </button>
            <button
              className={activeTab === 'bank' ? 'active' : ''}
              onClick={() => handleTabChange('bank')}
            >
              Bank Accounts
            </button>
            <button
              className={activeTab === 'card' ? 'active' : ''}
              onClick={() => handleTabChange('card')}
            >
              Card Payments
            </button>
          </div>
        </div>

        {showDetails ? (
          <PaymentConfigDetails
            config={currentConfig}
            onClose={handleDetailsClose}
            viewOnly={true}
          />
        ) : (
          <PaymentConfigList
            paymentConfigs={paymentConfigs}
            loading={loading}
            error={error}
            onView={handleViewDetails}
            viewOnly={true}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default PaymentConfigManager;
