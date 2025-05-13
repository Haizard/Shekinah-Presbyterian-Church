import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import FinanceLayout from '../../components/finance/FinanceLayout';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/admin/DataManager.css';
import '../../styles/admin/FinanceManager.css';

const FinanceManager = () => {
  const [finances, setFinances] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFinance, setCurrentFinance] = useState(null);
  const [formData, setFormData] = useState({
    type: 'income',
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    approvedBy: '',
    branchId: ''
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    incomeByCategory: [],
    expensesByCategory: []
  });
  const [activeTab, setActiveTab] = useState('all');
  const [filterBranch, setFilterBranch] = useState('');

  // Income categories
  const incomeCategories = [
    'Tithes',
    'Offerings',
    'Donations',
    'Fundraising',
    'Missions',
    'Building Fund',
    'Special Events',
    'Other Income'
  ];

  // Expense categories
  const expenseCategories = [
    'Salaries',
    'Utilities',
    'Rent',
    'Maintenance',
    'Ministry Expenses',
    'Missions',
    'Outreach',
    'Office Supplies',
    'Equipment',
    'Travel',
    'Other Expenses'
  ];

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch finances and branches from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [financesData, branchesData, summaryData] = await Promise.all([
        api.finances.getAll(),
        api.branches.getAll(),
        api.finances.getSummary()
      ]);

      setFinances(financesData);
      setBranches(branchesData);
      setSummary(summaryData);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load financial data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch finances by branch
  const fetchFinancesByBranch = async (branchId) => {
    try {
      setLoading(true);
      const data = await api.finances.getByBranch(branchId);
      setFinances(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching finances by branch:', err);
      setError('Failed to load financial data for this branch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? Number.parseFloat(value) || 0 : value
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      type: 'income',
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      approvedBy: '',
      branchId: ''
    });
    setEditMode(false);
    setCurrentFinance(null);
    setFormError(null);
    setFormSuccess(null);
  };

  // Open form for creating a new finance record
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Open form for editing an existing finance record
  const handleEdit = (finance) => {
    setFormData({
      type: finance.type,
      category: finance.category,
      amount: finance.amount,
      date: finance.date,
      description: finance.description || '',
      reference: finance.reference || '',
      approvedBy: finance.approvedBy || '',
      branchId: finance.branchId || ''
    });

    setEditMode(true);
    setCurrentFinance(finance);
    setShowForm(true);
    setFormError(null);
    setFormSuccess(null);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setFormError(null);
      setFormSuccess(null);

      // Validate form
      if (!formData.category || !formData.amount || !formData.date) {
        setFormError('Please fill in all required fields.');
        return;
      }

      const financeData = { ...formData };

      if (editMode && currentFinance) {
        // Update existing finance record
        await api.finances.update(currentFinance._id, financeData);
        setFormSuccess('Finance record updated successfully!');
      } else {
        // Create new finance record
        await api.finances.create(financeData);
        setFormSuccess('Finance record created successfully!');
      }

      // Refresh data
      fetchData();

      // Reset form after a short delay
      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 2000);

    } catch (err) {
      console.error('Error saving finance record:', err);
      setFormError('Failed to save finance record. Please try again.');
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (finance) => {
    setConfirmDelete(finance);
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  // Delete finance record
  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      await api.finances.delete(confirmDelete._id);
      setConfirmDelete(null);
      fetchData();
    } catch (err) {
      console.error('Error deleting finance record:', err);
      setError('Failed to delete finance record. Please try again.');
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilterBranch('');

    if (tab === 'all') {
      fetchData();
    } else {
      // Filter by type (income or expense)
      const filteredFinances = finances.filter(finance => finance.type === tab);
      setFinances(filteredFinances);
    }
  };

  // Handle branch filter change
  const handleBranchFilterChange = (e) => {
    const branchId = e.target.value;
    setFilterBranch(branchId);

    if (branchId) {
      fetchFinancesByBranch(branchId);
    } else {
      fetchData();
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
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get branch name by ID
  const getBranchName = (branchId) => {
    if (!branchId) return 'Main Church';
    const branch = branches.find(b => b._id === branchId);
    return branch ? branch.name : 'Unknown Branch';
  };

  const { userRole } = useContext(AuthContext);

  // Choose the appropriate layout based on user role
  const Layout = userRole === 'finance' ? FinanceLayout : AdminLayout;

  return (
    <Layout>
      <div className="data-manager finance-manager">
        <div className="manager-header">
          <h1>Finance Manager</h1>
          <button type="button" className="btn btn-primary" onClick={handleAddNew}>
            <FontAwesomeIcon icon="plus" /> Add New Transaction
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            <FontAwesomeIcon icon="exclamation-circle" />
            {error}
          </div>
        )}

        {/* Finance Summary */}
        <div className="finance-summary">
          <div className="summary-card income">
            <div className="card-icon">
              <FontAwesomeIcon icon="arrow-up" />
            </div>
            <div className="card-content">
              <h3>Total Income</h3>
              <p className="amount">{formatCurrency(summary.totalIncome)}</p>
            </div>
          </div>

          <div className="summary-card expenses">
            <div className="card-icon">
              <FontAwesomeIcon icon="money-bill-alt" />
            </div>
            <div className="card-content">
              <h3>Total Expenses</h3>
              <p className="amount">{formatCurrency(summary.totalExpenses)}</p>
            </div>
          </div>

          <div className="summary-card balance">
            <div className="card-icon">
              <FontAwesomeIcon icon="dollar-sign" />
            </div>
            <div className="card-content">
              <h3>Balance</h3>
              <p className={`amount ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(summary.balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="finance-filters">
          <div className="tabs">
            <button
              type="button"
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => handleTabChange('all')}
            >
              All Transactions
            </button>
            <button
              type="button"
              className={`tab ${activeTab === 'income' ? 'active' : ''}`}
              onClick={() => handleTabChange('income')}
            >
              Income
            </button>
            <button
              type="button"
              className={`tab ${activeTab === 'expense' ? 'active' : ''}`}
              onClick={() => handleTabChange('expense')}
            >
              Expenses
            </button>
          </div>

          <div className="branch-filter">
            <label htmlFor="branchFilter">Branch:</label>
            <select
              id="branchFilter"
              value={filterBranch}
              onChange={handleBranchFilterChange}
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

        {/* Transactions Table */}
        <div className="data-table-container">
          {loading ? (
            <div className="loading-spinner">
              <FontAwesomeIcon icon="spinner" spin />
              <span>Loading transactions...</span>
            </div>
          ) : finances.length === 0 ? (
            <div className="empty-state">
              <FontAwesomeIcon icon="receipt" />
              <p>No transactions found. Add your first transaction to get started.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Branch</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {finances.map(finance => (
                  <tr key={finance._id} className={finance.type === 'income' ? 'income-row' : 'expense-row'}>
                    <td>{formatDate(finance.date)}</td>
                    <td>
                      <span className={`type-badge ${finance.type}`}>
                        {finance.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td>{finance.category}</td>
                    <td className={`amount ${finance.type}`}>
                      {formatCurrency(finance.amount)}
                    </td>
                    <td>{finance.description || '-'}</td>
                    <td>{getBranchName(finance.branchId)}</td>
                    <td className="actions">
                      <button
                        type="button"
                        className="btn btn-sm btn-edit"
                        onClick={() => handleEdit(finance)}
                      >
                        <FontAwesomeIcon icon="edit" /> Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-delete"
                        onClick={() => handleDeleteConfirm(finance)}
                      >
                        <FontAwesomeIcon icon="trash-alt" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Finance Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editMode ? 'Edit Transaction' : 'Add New Transaction'}</h2>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {formError && (
                  <div className="alert alert-danger">
                    <FontAwesomeIcon icon="exclamation-circle" />
                    {formError}
                  </div>
                )}

                {formSuccess && (
                  <div className="alert alert-success">
                    <FontAwesomeIcon icon="check-circle" />
                    {formSuccess}
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="type">Transaction Type *</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="type"
                          value="income"
                          checked={formData.type === 'income'}
                          onChange={handleInputChange}
                        />
                        Income
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="type"
                          value="expense"
                          checked={formData.type === 'expense'}
                          onChange={handleInputChange}
                        />
                        Expense
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="date">Date *</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {formData.type === 'income' ? (
                        incomeCategories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))
                      ) : (
                        expenseCategories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="amount">Amount *</label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="branchId">Branch</label>
                    <select
                      id="branchId"
                      name="branchId"
                      value={formData.branchId}
                      onChange={handleInputChange}
                    >
                      <option value="">Main Church</option>
                      {branches.map(branch => (
                        <option key={branch._id} value={branch._id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reference">Reference/Receipt #</label>
                    <input
                      type="text"
                      id="reference"
                      name="reference"
                      value={formData.reference}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="approvedBy">Approved By</label>
                  <input
                    type="text"
                    id="approvedBy"
                    name="approvedBy"
                    value={formData.approvedBy}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? 'Update Transaction' : 'Add Transaction'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="modal-overlay">
            <div className="modal-content confirm-dialog">
              <div className="modal-header">
                <h2>Confirm Delete</h2>
                <button
                  type="button"
                  className="close-btn"
                  onClick={handleDeleteCancel}
                >
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>

              <div className="confirm-message">
                <FontAwesomeIcon icon="exclamation-triangle" />
                <p>Are you sure you want to delete this {confirmDelete.type} transaction of {formatCurrency(confirmDelete.amount)}? This action cannot be undone.</p>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleDeleteCancel}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FinanceManager;
