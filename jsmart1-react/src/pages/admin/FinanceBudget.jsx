import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import FinanceLayout from '../../components/finance/FinanceLayout';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/admin/DataManager.css';
import '../../styles/admin/FinanceManager.css';

const FinanceBudget = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [budgetYear, setBudgetYear] = useState(new Date().getFullYear());
  const [budgetItems, setBudgetItems] = useState([
    { category: 'Tithes', type: 'income', amount: 50000, actual: 45000 },
    { category: 'Offerings', type: 'income', amount: 25000, actual: 22000 },
    { category: 'Donations', type: 'income', amount: 15000, actual: 18000 },
    { category: 'Salaries', type: 'expense', amount: 35000, actual: 35000 },
    { category: 'Utilities', type: 'expense', amount: 12000, actual: 13500 },
    { category: 'Maintenance', type: 'expense', amount: 8000, actual: 7200 },
    { category: 'Missions', type: 'expense', amount: 15000, actual: 12000 },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    type: 'income',
    amount: 0,
    actual: 0
  });

  const { userRole } = useContext(AuthContext);
  
  // Choose the appropriate layout based on user role
  const Layout = userRole === 'finance' ? FinanceLayout : AdminLayout;

  // Fetch data on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

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

  // Add new budget item
  const handleAddItem = (e) => {
    e.preventDefault();
    
    if (!formData.category || formData.amount <= 0) {
      alert('Please enter a category and amount');
      return;
    }
    
    setBudgetItems([...budgetItems, { ...formData }]);
    setFormData({
      category: '',
      type: 'income',
      amount: 0,
      actual: 0
    });
    setShowForm(false);
  };

  // Delete budget item
  const handleDeleteItem = (index) => {
    const newItems = [...budgetItems];
    newItems.splice(index, 1);
    setBudgetItems(newItems);
  };

  // Save budget
  const handleSaveBudget = () => {
    // In a real implementation, this would save the budget to the database
    alert('Budget saved successfully!');
  };

  const totals = calculateTotals();

  return (
    <Layout>
      <div className="data-manager finance-manager">
        <div className="manager-header">
          <h1>Budget Planning</h1>
          <div className="header-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(true)}>
              <FontAwesomeIcon icon="plus" /> Add Item
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSaveBudget}>
              <FontAwesomeIcon icon="save" /> Save Budget
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            <FontAwesomeIcon icon="exclamation-circle" />
            {error}
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
                    <td className={item.actual >= item.amount ? 'positive' : 'negative'}>
                      {formatCurrency(item.actual - item.amount)}
                    </td>
                    <td className="actions">
                      <button
                        type="button"
                        className="btn btn-sm btn-delete"
                        onClick={() => handleDeleteItem(index)}
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

        {/* Add Budget Item Form */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Add Budget Item</h2>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>

              <form onSubmit={handleAddItem}>
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
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FinanceBudget;
