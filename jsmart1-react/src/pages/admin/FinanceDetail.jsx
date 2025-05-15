import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import FinanceLayout from '../../components/finance/FinanceLayout';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/admin/FinanceDetail.css';

const FinanceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [finance, setFinance] = useState(null);
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userRole } = useContext(AuthContext);

  // Check if user is a finance user or admin
  const isFinanceUser = userRole === 'finance';
  const isAdminUser = userRole === 'admin';

  // Choose the appropriate layout based on user role
  const Layout = isFinanceUser ? FinanceLayout : AdminLayout;

  // Fetch finance data on component mount
  useEffect(() => {
    fetchFinanceData();
  }, [id]);

  // Fetch finance data from API
  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const financeData = await api.finances.getById(id);
      setFinance(financeData);

      // If finance has a branch, fetch branch details
      if (financeData.branchId) {
        const branchData = await api.branches.getById(financeData.branchId);
        setBranch(branchData);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching finance data:', err);
      setError('Failed to load transaction data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle back button click
  const handleBack = () => {
    navigate('/admin/finances');
  };

  // Handle edit button click
  const handleEdit = () => {
    navigate('/admin/finances', { state: { editFinanceId: id } });
  };

  return (
    <Layout>
      <div className="finance-detail-container">
        <div className="detail-header">
          <button type="button" className="btn btn-back" onClick={handleBack}>
            <FontAwesomeIcon icon="arrow-left" /> Back to Finances
          </button>
          <h1>Transaction Details</h1>
          <div className="refresh-button">
            <button type="button" className="btn btn-refresh" onClick={fetchFinanceData}>
              <FontAwesomeIcon icon="sync" /> Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            <FontAwesomeIcon icon="exclamation-circle" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">
            <FontAwesomeIcon icon="spinner" spin />
            <span>Loading transaction details...</span>
          </div>
        ) : finance ? (
          <div className="finance-detail-content">
            <div className="finance-detail-header">
              <div className="transaction-type">
                <span className={`type-badge ${finance.type}`}>
                  {finance.type === 'income' ? 'Income' : 'Expense'}
                </span>
              </div>
              <div className="transaction-amount">
                <h2 className={finance.type}>
                  {formatCurrency(finance.amount)}
                </h2>
              </div>
              {isFinanceUser && (
                <div className="transaction-actions">
                  <button type="button" className="btn btn-primary" onClick={handleEdit}>
                    <FontAwesomeIcon icon="edit" /> Edit Transaction
                  </button>
                </div>
              )}
            </div>

            <div className="finance-detail-body">
              <div className="detail-section">
                <h3>Transaction Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value">{finance.category}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{formatDate(finance.date)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Branch:</span>
                    <span className="detail-value">{branch ? branch.name : 'Main Church'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Reference/Receipt #:</span>
                    <span className="detail-value">{finance.reference || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Approved By:</span>
                    <span className="detail-value">{finance.approvedBy || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {finance.description && (
                <div className="detail-section">
                  <h3>Description</h3>
                  <div className="description-content">
                    <p>{finance.description}</p>
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h3>Record Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">{formatDate(finance.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Updated:</span>
                    <span className="detail-value">{formatDate(finance.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <FontAwesomeIcon icon="receipt" />
            <p>Transaction not found. The transaction may have been deleted or you don't have permission to view it.</p>
            <button type="button" className="btn btn-primary" onClick={handleBack}>
              Return to Finance List
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FinanceDetail;
