import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FinanceLayout from '../../components/finance/FinanceLayout';
import api from '../../services/api';
import '../../styles/admin/Dashboard.css';
import '../../styles/finance/Dashboard.css';

const FinanceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    recentTransactions: []
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch finance summary from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const summaryData = await api.finances.getSummary();

      // Get recent transactions
      const transactions = await api.finances.getAll();
      const recentTransactions = transactions.slice(0, 5);

      setSummary({
        ...summaryData,
        recentTransactions
      });

      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load financial data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <FinanceLayout>
      <div className="admin-dashboard finance-dashboard">
        <h1>Finance Dashboard</h1>

        {error && (
          <div className="alert alert-danger">
            <FontAwesomeIcon icon="exclamation-circle" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">
            <FontAwesomeIcon icon="spinner" spin />
            <span>Loading data...</span>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
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
                  <span style={{ fontWeight: 'bold' }}>Tsh</span>
                </div>
                <div className="card-content">
                  <h3>Balance</h3>
                  <p className={`amount ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(summary.balance)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <a href="/finance/transactions/new" className="action-button">
                  <FontAwesomeIcon icon="plus-circle" />
                  <span>New Transaction</span>
                </a>
                <a href="/finance/reports" className="action-button">
                  <FontAwesomeIcon icon="chart-bar" />
                  <span>View Reports</span>
                </a>
                <a href="/finance/budget" className="action-button">
                  <span style={{ fontWeight: 'bold', marginRight: '0.75rem' }}>Tsh</span>
                  <span>Manage Budget</span>
                </a>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="recent-data">
              <div className="section-header">
                <h2>Recent Transactions</h2>
                <a href="/finance/transactions" className="view-all">
                  View All <FontAwesomeIcon icon="arrow-right" />
                </a>
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
          </>
        )}
      </div>
    </FinanceLayout>
  );
};

export default FinanceDashboard;
