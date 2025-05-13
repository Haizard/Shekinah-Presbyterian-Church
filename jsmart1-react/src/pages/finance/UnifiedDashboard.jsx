import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Bar, Pie } from 'react-chartjs-2';
import FinanceLayout from '../../components/finance/FinanceLayout';
import MenuRow from '../../components/finance/MenuRow';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/admin/Dashboard.css';
import '../../styles/finance/Dashboard.css';
import '../../styles/finance/UnifiedDashboard.css';

const UnifiedDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    recentTransactions: []
  });
  const [budgetData, setBudgetData] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [budgetVsActual, setBudgetVsActual] = useState({
    income: { categories: [], budget: [], actual: [] },
    expense: { categories: [], budget: [], actual: [] }
  });

  const { userRole } = useContext(AuthContext);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [currentYear, selectedBranch]);

  // Fetch all finance data
  const fetchData = async () => {
    try {
      setLoading(true);

      // Get branches
      const branchesData = await api.branches.getAll();
      setBranches(branchesData);

      // Get finance summary
      const summaryData = await api.finances.getSummary();

      // Get recent transactions
      const transactions = await api.finances.getAll();
      const recentTransactions = transactions.slice(0, 5);

      setSummary({
        ...summaryData,
        recentTransactions
      });

      // Get budget for current year
      const budget = await api.budgets.getByYearAndBranch(currentYear, selectedBranch);
      if (budget._id) {
        setBudgetData(budget);

        // Process budget vs actual data for charts
        processBudgetVsActualData(budget);
      } else {
        setBudgetData(null);
        setBudgetVsActual({
          income: { categories: [], budget: [], actual: [] },
          expense: { categories: [], budget: [], actual: [] }
        });
      }

      setError(null);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load financial data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Process budget vs actual data for charts
  const processBudgetVsActualData = (budget) => {
    if (!budget || !budget.items) return;

    // Group budget items by category
    const incomeCategories = [];
    const incomeBudget = [];
    const incomeActual = [];
    const expenseCategories = [];
    const expenseBudget = [];
    const expenseActual = [];

    budget.items.forEach(item => {
      if (item.type === 'income') {
        incomeCategories.push(item.category);
        incomeBudget.push(item.amount);
        incomeActual.push(item.actual);
      } else {
        expenseCategories.push(item.category);
        expenseBudget.push(item.amount);
        expenseActual.push(item.actual);
      }
    });

    setBudgetVsActual({
      income: {
        categories: incomeCategories,
        budget: incomeBudget,
        actual: incomeActual
      },
      expense: {
        categories: expenseCategories,
        budget: expenseBudget,
        actual: expenseActual
      }
    });
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
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle branch selection change
  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };

  // Handle year change
  const handleYearChange = (e) => {
    setCurrentYear(parseInt(e.target.value));
  };

  // Manual refresh
  const handleManualRefresh = () => {
    fetchData();
  };

  return (
    <FinanceLayout>
      <div className="unified-dashboard">
        <div className="dashboard-header">
          <h1>Finance Dashboard</h1>
          <div className="dashboard-controls">
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
                value={currentYear}
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

            <button type="button" className="btn btn-refresh" onClick={handleManualRefresh}>
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

        <div className="last-refreshed">
          Last updated: {lastRefreshed.toLocaleTimeString()}
        </div>

        {loading ? (
          <div className="loading-spinner">
            <FontAwesomeIcon icon="spinner" spin />
            <span>Loading data...</span>
          </div>
        ) : (
          <>
            {/* Financial Summary Cards */}
            <div className="summary-cards">
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
                  <FontAwesomeIcon icon="arrow-down" />
                </div>
                <div className="card-content">
                  <h3>Total Expenses</h3>
                  <p className="amount">{formatCurrency(summary.totalExpenses)}</p>
                </div>
              </div>

              <div className="summary-card balance">
                <div className="card-icon">
                  <FontAwesomeIcon icon="balance-scale" />
                </div>
                <div className="card-content">
                  <h3>Balance</h3>
                  <p className={`amount ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(summary.balance)}
                  </p>
                </div>
              </div>
            </div>

            {/* Budget vs Actual Section */}
            <div className="budget-vs-actual-section">
              <h2>Budget vs Actual</h2>
              {budgetData ? (
                <div className="chart-container">
                  <div className="chart-item">
                    <h3>Income by Category</h3>
                    {budgetVsActual.income.categories.length > 0 ? (
                      <Bar
                        data={{
                          labels: budgetVsActual.income.categories,
                          datasets: [
                            {
                              label: 'Budget',
                              data: budgetVsActual.income.budget,
                              backgroundColor: 'rgba(39, 174, 96, 0.6)',
                              borderColor: '#27ae60',
                              borderWidth: 1,
                            },
                            {
                              label: 'Actual',
                              data: budgetVsActual.income.actual,
                              backgroundColor: 'rgba(46, 204, 113, 0.6)',
                              borderColor: '#2ecc71',
                              borderWidth: 1,
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: function(value) {
                                  return formatCurrency(value);
                                }
                              }
                            }
                          }
                        }}
                      />
                    ) : (
                      <div className="no-data">
                        <FontAwesomeIcon icon="info-circle" />
                        <p>No income budget data available</p>
                      </div>
                    )}
                  </div>

                  <div className="chart-item">
                    <h3>Expenses by Category</h3>
                    {budgetVsActual.expense.categories.length > 0 ? (
                      <Bar
                        data={{
                          labels: budgetVsActual.expense.categories,
                          datasets: [
                            {
                              label: 'Budget',
                              data: budgetVsActual.expense.budget,
                              backgroundColor: 'rgba(231, 76, 60, 0.6)',
                              borderColor: '#e74c3c',
                              borderWidth: 1,
                            },
                            {
                              label: 'Actual',
                              data: budgetVsActual.expense.actual,
                              backgroundColor: 'rgba(255, 99, 71, 0.6)',
                              borderColor: '#ff6347',
                              borderWidth: 1,
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: function(value) {
                                  return formatCurrency(value);
                                }
                              }
                            }
                          }
                        }}
                      />
                    ) : (
                      <div className="no-data">
                        <FontAwesomeIcon icon="info-circle" />
                        <p>No expense budget data available</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="no-data">
                  <FontAwesomeIcon icon="info-circle" />
                  <p>No budget data available for {currentYear}</p>
                  <Link to="/finance/budget" className="btn btn-primary">
                    <FontAwesomeIcon icon="plus" /> Create Budget
                  </Link>
                </div>
              )}
            </div>
            {/* Recent Transactions */}
            <div className="recent-data">
              <div className="section-header">
                <h2>Recent Transactions</h2>
                <Link to="/finance/transactions" className="view-all">
                  View All <FontAwesomeIcon icon="arrow-right" />
                </Link>
              </div>

              {summary.recentTransactions.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.recentTransactions.map((transaction) => (
                      <tr key={transaction._id}>
                        <td>{formatDate(transaction.date)}</td>
                        <td>{transaction.description}</td>
                        <td>{transaction.category}</td>
                        <td>{formatCurrency(transaction.amount)}</td>
                        <td>
                          <span className={`type-badge ${transaction.type}`}>
                            {transaction.type === 'income' ? 'Income' : 'Expense'}
                          </span>
                        </td>
                        <td>
                          <Link to={`/finance/transactions/${transaction._id}`} className="btn btn-sm btn-view">
                            <FontAwesomeIcon icon="eye" /> View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">
                  <FontAwesomeIcon icon="info-circle" />
                  <p>No recent transactions found.</p>
                </div>
              )}
            </div>

            {/* Main Menu Items in Row */}
            <MenuRow />
          </>
        )}
      </div>
    </FinanceLayout>
  );
};

export default UnifiedDashboard;
