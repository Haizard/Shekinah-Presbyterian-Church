import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import AdminLayout from '../../components/admin/AdminLayout';
import DonationStats from '../../components/admin/DonationStats';
import api from '../../services/api';
import '../../styles/admin/DataManager.css';
import '../../styles/admin/DonationManager.css';
import '../../styles/admin/ViewOnlyMode.css';

const DonationManager = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDonation, setCurrentDonation] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [activeTab, setActiveTab] = useState('all');
  const [filterBranch, setFilterBranch] = useState('');
  const [branches, setBranches] = useState([]);
  const [showStats, setShowStats] = useState(false);

  // Fetch donations and branches
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all donations
        let donationsData;
        if (activeTab === 'all') {
          donationsData = await api.donations.getAll();
        } else {
          donationsData = await api.donations.getByStatus(activeTab);
        }

        // Filter by branch if selected
        if (filterBranch) {
          donationsData = donationsData.filter(donation =>
            donation.branchId === filterBranch
          );
        }

        setDonations(donationsData);

        // Fetch branches for filter
        const branchesData = await api.branches.getAll();
        setBranches(branchesData);

        setError(null);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to load donations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, filterBranch]);

  // Handle view donation details
  const handleViewDetails = (donation) => {
    setCurrentDonation(donation);
    setShowDetails(true);
  };

  // Handle close details modal
  const handleCloseDetails = () => {
    setShowDetails(false);
    setCurrentDonation(null);
  };



  // Format currency
  const formatCurrency = (amount, currency = 'Tsh') => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'processing':
        return 'badge-info';
      case 'completed':
        return 'badge-success';
      case 'failed':
        return 'badge-danger';
      case 'refunded':
        return 'badge-secondary';
      default:
        return 'badge-primary';
    }
  };

  // Toggle stats view
  const toggleStats = () => {
    setShowStats(!showStats);
  };

  return (
    <AdminLayout>
      <div className="data-manager donation-manager">
        <div className="page-header">
          <div className="title-section">
            <h1>Donation Viewer</h1>
            <p>View and track all donations</p>
            <div className="view-only-badge">
              <FontAwesomeIcon icon="eye" /> View Only Mode
            </div>
          </div>

          <div className="action-buttons">
            <button
              className="btn btn-primary"
              onClick={toggleStats}
            >
              <FontAwesomeIcon icon={showStats ? 'chart-bar' : 'chart-bar'} />
              {showStats ? 'Hide Statistics' : 'Show Statistics'}
            </button>
          </div>
        </div>

        {showStats && <DonationStats />}

        <div className="filter-tabs">
          <div className="tabs">
            <button
              className={activeTab === 'all' ? 'active' : ''}
              onClick={() => setActiveTab('all')}
            >
              All Donations
            </button>
            <button
              className={activeTab === 'pending' ? 'active' : ''}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </button>
            <button
              className={activeTab === 'processing' ? 'active' : ''}
              onClick={() => setActiveTab('processing')}
            >
              Processing
            </button>
            <button
              className={activeTab === 'completed' ? 'active' : ''}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
            <button
              className={activeTab === 'failed' ? 'active' : ''}
              onClick={() => setActiveTab('failed')}
            >
              Failed
            </button>
          </div>

          <div className="filter-controls">
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="form-control"
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <FontAwesomeIcon icon="spinner" spin />
            <span>Loading donations...</span>
          </div>
        ) : error ? (
          <div className="error-message">
            <FontAwesomeIcon icon="exclamation-circle" />
            <span>{error}</span>
          </div>
        ) : donations.length === 0 ? (
          <div className="empty-state">
            <FontAwesomeIcon icon="donate" size="3x" />
            <h3>No donations found</h3>
            <p>There are no donations matching your current filters.</p>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(donation => (
                  <tr key={donation._id}>
                    <td>{format(new Date(donation.createdAt), 'MMM d, yyyy')}</td>
                    <td>
                      {donation.isAnonymous
                        ? 'Anonymous'
                        : `${donation.firstName} ${donation.lastName}`
                      }
                    </td>
                    <td>{formatCurrency(donation.amount, donation.currency)}</td>
                    <td>
                      <span className="payment-method">
                        {donation.paymentMethod === 'mpesa' && 'M-Pesa'}
                        {donation.paymentMethod === 'tigopesa' && 'Tigo Pesa'}
                        {donation.paymentMethod === 'airtelmoney' && 'Airtel Money'}
                        {donation.paymentMethod === 'bank' && 'Bank Transfer'}
                        {donation.paymentMethod === 'card' && 'Credit Card'}
                        {donation.paymentMethod === 'cash' && 'Cash'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(donation.paymentStatus)}`}>
                        {donation.paymentStatus}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleViewDetails(donation)}
                        title="View Details"
                      >
                        <FontAwesomeIcon icon="eye" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Donation Details Modal */}
        {showDetails && currentDonation && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Donation Details</h2>
                <button className="close-btn" onClick={handleCloseDetails}>
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>
              <div className="modal-body">
                <div className="donation-details">
                  <div className="detail-section">
                    <h3>Donor Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="label">Name:</span>
                        <span className="value">
                          {currentDonation.isAnonymous
                            ? 'Anonymous'
                            : `${currentDonation.firstName} ${currentDonation.lastName}`
                          }
                        </span>
                      </div>
                      {!currentDonation.isAnonymous && (
                        <>
                          <div className="detail-item">
                            <span className="label">Email:</span>
                            <span className="value">{currentDonation.email}</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Phone:</span>
                            <span className="value">{currentDonation.phone || 'N/A'}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Donation Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="label">Amount:</span>
                        <span className="value">{formatCurrency(currentDonation.amount, currentDonation.currency)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Date:</span>
                        <span className="value">{format(new Date(currentDonation.createdAt), 'MMMM d, yyyy h:mm a')}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Type:</span>
                        <span className="value">{currentDonation.donationType}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Category:</span>
                        <span className="value">{currentDonation.category}</span>
                      </div>
                      {currentDonation.designation && (
                        <div className="detail-item">
                          <span className="label">Designation:</span>
                          <span className="value">{currentDonation.designation}</span>
                        </div>
                      )}
                      <div className="detail-item">
                        <span className="label">Branch:</span>
                        <span className="value">
                          {currentDonation.branchId
                            ? branches.find(b => b._id === currentDonation.branchId)?.name || 'Unknown Branch'
                            : 'General (No specific branch)'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Payment Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="label">Payment Method:</span>
                        <span className="value">
                          {currentDonation.paymentMethod === 'mpesa' && 'M-Pesa'}
                          {currentDonation.paymentMethod === 'tigopesa' && 'Tigo Pesa'}
                          {currentDonation.paymentMethod === 'airtelmoney' && 'Airtel Money'}
                          {currentDonation.paymentMethod === 'bank' && 'Bank Transfer'}
                          {currentDonation.paymentMethod === 'card' && 'Credit Card'}
                          {currentDonation.paymentMethod === 'cash' && 'Cash'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Status:</span>
                        <span className={`value status-badge ${getStatusBadgeClass(currentDonation.paymentStatus)}`}>
                          {currentDonation.paymentStatus}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Transaction ID:</span>
                        <span className="value">{currentDonation.transactionId || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Payment Reference:</span>
                        <span className="value">{currentDonation.paymentReference || 'N/A'}</span>
                      </div>
                      {currentDonation.receiptSent && (
                        <div className="detail-item">
                          <span className="label">Receipt ID:</span>
                          <span className="value">{currentDonation.receiptId || 'N/A'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {currentDonation.notes && (
                    <div className="detail-section">
                      <h3>Notes</h3>
                      <p>{currentDonation.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCloseDetails}>
                  Close
                </button>
                <div className="view-only-note">
                  <FontAwesomeIcon icon="info-circle" /> Status updates are managed in the Finance Panel
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </AdminLayout>
  );
};

export default DonationManager;
