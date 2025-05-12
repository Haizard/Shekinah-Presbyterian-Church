import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
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
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
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
  const handleDelete = async (id) => {
    try {
      await api.finances.delete(id);
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

  return (
    <AdminLayout>
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
      </div>
    </AdminLayout>
  );
};

export default FinanceManager;
