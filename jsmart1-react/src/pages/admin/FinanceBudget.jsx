import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import FinanceLayout from '../../components/finance/FinanceLayout';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/admin/DataManager.css';
import '../../styles/admin/FinanceManager.css';
import '../../styles/admin/FinanceBudget.css';

const FinanceBudget = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [budgetYear, setBudgetYear] = useState(new Date().getFullYear());
  const [budgetItems, setBudgetItems] = useState([]);
  const [budgetId, setBudgetId] = useState(null);
  const [budgetStatus, setBudgetStatus] = useState('draft');
  const [budgetNotes, setBudgetNotes] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    type: 'income',
    amount: 0,
    actual: 0
  });
  const [saving, setSaving] = useState(false);

  const { userRole } = useContext(AuthContext);

  // Check if user is a finance user or admin
  const isFinanceUser = userRole === 'finance';
  const isAdminUser = userRole === 'admin';

  // Choose the appropriate layout based on user role
  const Layout = isFinanceUser ? FinanceLayout : AdminLayout;

  // Fetch data on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch budget data when year or branch changes
  useEffect(() => {
    fetchBudget();
  }, [budgetYear, selectedBranch]);

  // Fetch branches from API
  const fetchBranches = async () => {
    try {
      setLoading(true);
      const branchesData = await api.branches.getAll();
      setBranches(branchesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError('Failed to load branch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch budget data from API
  const fetchBudget = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const budgetData = await api.budgets.getByYearAndBranch(budgetYear, selectedBranch);

      if (budgetData._id) {
        // Existing budget found
        setBudgetId(budgetData._id);
        setBudgetItems(budgetData.items || []);
        setBudgetStatus(budgetData.status || 'draft');
        setBudgetNotes(budgetData.notes || '');
      } else {
        // No existing budget, reset to defaults
        setBudgetId(null);
        setBudgetItems([]);
        setBudgetStatus('draft');
        setBudgetNotes('');
      }
    } catch (err) {
      console.error('Error fetching budget:', err);
      setError('Failed to load budget data. Please try again.');
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

  // Calculate budget totals
  const calculateTotals = () => {
    const incomeBudget = budgetItems
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0);

    const incomeActual = budgetItems
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.actual, 0);

    const expenseBudget = budgetItems
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0);

    const expenseActual = budgetItems
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.actual, 0);

    return {
      incomeBudget,
      incomeActual,
      expenseBudget,
      expenseActual,
      balanceBudget: incomeBudget - expenseBudget,
      balanceActual: incomeActual - expenseActual
    };
  };

  // Handle branch selection change
  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };

  // Handle year change
  const handleYearChange = (e) => {
    setBudgetYear(parseInt(e.target.value));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' || name === 'actual' ? Number.parseFloat(value) || 0 : value
    });
  };

  // Handle notes change
  const handleNotesChange = (e) => {
    setBudgetNotes(e.target.value);
  };

  // Handle status change
  const handleStatusChange = (e) => {
    setBudgetStatus(e.target.value);
  };

  // Open form for adding a new item
  const handleOpenAddForm = () => {
    setEditItemIndex(null);
    setFormData({
      category: '',
      type: 'income',
      amount: 0,
      actual: 0
    });
    setShowForm(true);
  };

  // Open form for editing an existing item
  const handleEditItem = (index) => {
    setEditItemIndex(index);
    setFormData({...budgetItems[index]});
    setShowForm(true);
  };

  // Add or update budget item
  const handleSubmitItem = (e) => {
    e.preventDefault();

    if (!formData.category || formData.amount <= 0) {
      alert('Please enter a category and amount');
      return;
    }

    const newItems = [...budgetItems];

    if (editItemIndex !== null) {
      // Update existing item
      newItems[editItemIndex] = { ...formData };
    } else {
      // Add new item
      newItems.push({ ...formData });
    }

    setBudgetItems(newItems);
    setFormData({
      category: '',
      type: 'income',
      amount: 0,
      actual: 0
    });
    setEditItemIndex(null);
    setShowForm(false);
  };

  // Delete budget item
  const handleDeleteItem = (index) => {
    const newItems = [...budgetItems];
    newItems.splice(index, 1);
    setBudgetItems(newItems);
  };

  // Save budget
  const handleSaveBudget = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const budgetData = {
        year: budgetYear,
        branchId: selectedBranch || null,
        items: budgetItems,
        notes: budgetNotes,
        status: budgetStatus
      };

      let result;

      if (budgetId) {
        // Update existing budget
        result = await api.budgets.update(budgetId, budgetData);
        setSuccess('Budget updated successfully!');
      } else {
        // Create new budget
        result = await api.budgets.create(budgetData);
        setBudgetId(result._id);
        setSuccess('Budget created successfully!');
      }

      // Refresh budget data
      fetchBudget();
    } catch (err) {
      console.error('Error saving budget:', err);
      setError('Failed to save budget. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Refresh budget data
  const handleRefresh = () => {
    fetchBudget();
  };

  // Update actuals from transactions
  const handleUpdateActuals = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const result = await api.budgets.updateActuals(budgetYear, selectedBranch);

      if (result.success) {
        setSuccess(`Budget actuals updated successfully! ${result.transactionsProcessed} transactions processed.`);
        // Refresh budget data
        fetchBudget();
      } else {
        setError('Failed to update actuals from transactions.');
      }
    } catch (err) {
      console.error('Error updating actuals:', err);
      setError('Failed to update actuals from transactions. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const totals = calculateTotals();

  return (
    <Layout>
      <div className="data-manager finance-manager">
        <div className="manager-header">
          <h1>
            {isAdminUser ? 'Budget Viewer' : 'Budget Planning'}
            {budgetId && (
              <span className={`budget-status ${budgetStatus}`}>
                {budgetStatus.charAt(0).toUpperCase() + budgetStatus.slice(1)}
              </span>
            )}
          </h1>
          <div className="header-actions">
            {isFinanceUser && (
              <>
                <button type="button" className="btn btn-secondary" onClick={handleOpenAddForm}>
                  <FontAwesomeIcon icon="plus" /> Add Item
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveBudget}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <FontAwesomeIcon icon="spinner" spin /> Saving...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon="save" /> Save Budget
                    </>
                  )}
                </button>
              </>
            )}
            <button type="button" className="btn btn-refresh" onClick={handleRefresh}>
              <FontAwesomeIcon icon="sync" /> Refresh
            </button>
            {isFinanceUser && budgetId && (
              <button
                type="button"
                className="btn btn-success"
                onClick={handleUpdateActuals}
                disabled={saving}
              >
                <FontAwesomeIcon icon="sync-alt" /> Update Actuals from Transactions
              </button>
            )}
            <Link
              to={isFinanceUser ? "/finance/budget/report" : "/admin/finances/budget/report"}
              className="btn btn-info"
            >
              <FontAwesomeIcon icon="chart-pie" /> View Report
            </Link>
            {isAdminUser && (
              <div className="admin-view-badge">
                <FontAwesomeIcon icon="eye" /> View Only Mode
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            <FontAwesomeIcon icon="exclamation-circle" />
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <FontAwesomeIcon icon="check-circle" />
            {success}
          </div>
        )}

        {/* Budget Filters */}
        <div className="budget-filters">
          <div className="filter-group">
            <label htmlFor="branchSelect">Branch:</label>
            <select
              id="branchSelect"
              value={selectedBranch}
              onChange={handleBranchChange}
            >
              <option value="">Main Church</option>
              {branches.map(branch => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="yearSelect">Year:</label>
            <select
              id="yearSelect"
              value={budgetYear}
              onChange={handleYearChange}
            >
              {[...Array(5)].map((_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="budget-summary">
          <div className="summary-card income">
            <div className="card-content">
              <h3>Income</h3>
              <div className="budget-amounts">
                <div>
                  <span>Budget:</span>
                  <span className="amount">{formatCurrency(totals.incomeBudget)}</span>
                </div>
                <div>
                  <span>Actual:</span>
                  <span className="amount">{formatCurrency(totals.incomeActual)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="summary-card expenses">
            <div className="card-content">
              <h3>Expenses</h3>
              <div className="budget-amounts">
                <div>
                  <span>Budget:</span>
                  <span className="amount">{formatCurrency(totals.expenseBudget)}</span>
                </div>
                <div>
                  <span>Actual:</span>
                  <span className="amount">{formatCurrency(totals.expenseActual)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="summary-card balance">
            <div className="card-content">
              <h3>Balance</h3>
              <div className="budget-amounts">
                <div>
                  <span>Budget:</span>
                  <span className={`amount ${totals.balanceBudget >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(totals.balanceBudget)}
                  </span>
                </div>
                <div>
                  <span>Actual:</span>
                  <span className={`amount ${totals.balanceActual >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(totals.balanceActual)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Table */}
        <div className="data-table-container">
          <h2>Budget Details</h2>
          {loading ? (
            <div className="loading-spinner">
              <FontAwesomeIcon icon="spinner" spin />
              <span>Loading data...</span>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Budget Amount</th>
                  <th>Actual Amount</th>
                  <th>Variance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgetItems.map((item, index) => (
                  <tr key={index} className={item.type === 'income' ? 'income-row' : 'expense-row'}>
                    <td>{item.category}</td>
                    <td>
                      <span className={`type-badge ${item.type}`}>
                        {item.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td>{formatCurrency(item.amount)}</td>
                    <td>{formatCurrency(item.actual)}</td>
                    <td className={item.actual >= item.amount ? 'variance-positive' : 'variance-negative'}>
                      {formatCurrency(item.actual - item.amount)}
                    </td>
                    <td className="actions">
                      {isFinanceUser ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm btn-edit edit-item-button"
                            onClick={() => handleEditItem(index)}
                          >
                            <FontAwesomeIcon icon="edit" /> Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-delete"
                            onClick={() => handleDeleteItem(index)}
                          >
                            <FontAwesomeIcon icon="trash-alt" /> Delete
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-sm btn-view"
                        >
                          <FontAwesomeIcon icon="eye" /> View Only
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add/Edit Budget Item Form */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editItemIndex !== null ? 'Edit Budget Item' : 'Add Budget Item'}</h2>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>

              <form onSubmit={handleSubmitItem}>
                <div className="form-group">
                  <label htmlFor="type">Type</label>
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
                  <label htmlFor="category">Category</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="amount">Budget Amount</label>
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

                <div className="form-group">
                  <label htmlFor="actual">Actual Amount (Optional)</label>
                  <input
                    type="number"
                    id="actual"
                    name="actual"
                    value={formData.actual}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editItemIndex !== null ? 'Update Item' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Budget Notes and Status */}
        {isFinanceUser && budgetItems.length > 0 && (
          <div className="budget-manager">
            <div className="budget-notes">
              <h3>Budget Notes</h3>
              <textarea
                value={budgetNotes}
                onChange={handleNotesChange}
                placeholder="Add notes about this budget..."
              />
            </div>

            <div className="budget-status-selector">
              <h3>Budget Status</h3>
              <select
                value={budgetStatus}
                onChange={handleStatusChange}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FinanceBudget;
