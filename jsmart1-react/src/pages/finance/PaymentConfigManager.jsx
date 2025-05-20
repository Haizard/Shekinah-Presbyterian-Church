import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FinanceLayout from '../../components/finance/FinanceLayout';
import PaymentConfigList from '../../components/admin/PaymentConfigList';
import PaymentConfigForm from '../../components/admin/PaymentConfigForm';
import PaymentConfigDetails from '../../components/admin/PaymentConfigDetails';
import api from '../../services/api';
import '../../styles/admin/DataManager.css';
import '../../styles/admin/PaymentConfigManager.css';
import '../../styles/finance/FinanceManager.css';

const PaymentConfigManager = () => {
  const [paymentConfigs, setPaymentConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentConfig, setCurrentConfig] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
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

  // Handle add new configuration
  const handleAddConfig = () => {
    setCurrentConfig(null);
    setFormMode('add');
    setShowForm(true);
    setShowDetails(false);
  };

  // Handle edit configuration
  const handleEditConfig = (config) => {
    setCurrentConfig(config);
    setFormMode('edit');
    setShowForm(true);
    setShowDetails(false);
  };

  // Handle view configuration details
  const handleViewDetails = (config) => {
    setCurrentConfig(config);
    setShowDetails(true);
    setShowForm(false);
  };

  // Handle delete configuration
  const handleDeleteConfig = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment configuration? This action cannot be undone.')) {
      try {
        await api.paymentConfig.delete(id);
        
        // Remove the deleted configuration from the state
        setPaymentConfigs(paymentConfigs.filter(config => config._id !== id));
        
        // Close details or form if the deleted configuration was being viewed/edited
        if ((showDetails || showForm) && currentConfig?._id === id) {
          setShowDetails(false);
          setShowForm(false);
          setCurrentConfig(null);
        }
      } catch (err) {
        console.error('Error deleting payment configuration:', err);
        alert('Failed to delete payment configuration. Please try again.');
      }
    }
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      if (formMode === 'add') {
        await api.paymentConfig.create(formData);
      } else {
        await api.paymentConfig.update(currentConfig._id, formData);
      }
      
      // Refresh the list of configurations
      setRefreshTrigger(prev => prev + 1);
      
      // Close the form
      setShowForm(false);
      setCurrentConfig(null);
    } catch (err) {
      console.error('Error saving payment configuration:', err);
      alert('Failed to save payment configuration. Please try again.');
    }
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentConfig(null);
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
    <FinanceLayout>
      <div className="data-manager payment-config-manager finance-manager">
        <div className="page-header">
          <div className="title-section">
            <h1>Payment Configuration Manager</h1>
            <p>Manage payment gateway configurations for donations</p>
          </div>
          
          <div className="action-buttons">
            <button 
              className="btn btn-primary" 
              onClick={handleAddConfig}
            >
              <FontAwesomeIcon icon="plus" />
              Add New Configuration
            </button>
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
        
        {showForm ? (
          <PaymentConfigForm 
            config={currentConfig}
            mode={formMode}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        ) : showDetails ? (
          <PaymentConfigDetails 
            config={currentConfig}
            onClose={handleDetailsClose}
            onEdit={() => handleEditConfig(currentConfig)}
            onDelete={() => handleDeleteConfig(currentConfig._id)}
          />
        ) : (
          <PaymentConfigList 
            paymentConfigs={paymentConfigs}
            loading={loading}
            error={error}
            onView={handleViewDetails}
            onEdit={handleEditConfig}
            onDelete={handleDeleteConfig}
          />
        )}
      </div>
    </FinanceLayout>
  );
};

export default PaymentConfigManager;
