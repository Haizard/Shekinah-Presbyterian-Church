import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import FinanceLayout from '../../components/finance/FinanceLayout';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/admin/DataManager.css';
import '../../styles/admin/FinanceManager.css';

// Chart.js and PDF imports
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const FinanceReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    incomeByCategory: [],
    expensesByCategory: []
  });
  const [branches, setBranches] = useState([]);
  const [filterBranch, setFilterBranch] = useState('');
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Jan 1 of current year
    endDate: new Date().toISOString().split('T')[0] // Today
  });
  const [filteredData, setFilteredData] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const reportRef = useRef(null);
  const refreshTimerRef = useRef(null);

  const { userRole } = useContext(AuthContext);

  // Check if user is a finance user or admin
  const isFinanceUser = userRole === 'finance';
  const isAdminUser = userRole === 'admin';

  // Choose the appropriate layout based on user role
  const Layout = isFinanceUser ? FinanceLayout : AdminLayout;

  // Fetch data on component mount
  useEffect(() => {
    fetchData();

    // Cleanup function to clear any timers when component unmounts
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, []);

  // Set up auto-refresh timer
  useEffect(() => {
    if (autoRefresh) {
      // Clear any existing timer
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }

      // Set new timer
      refreshTimerRef.current = setInterval(() => {
        fetchData();
        setLastRefreshed(new Date());
      }, refreshInterval * 1000);
    } else {
      // Clear timer if auto-refresh is turned off
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [autoRefresh, refreshInterval]);

  // Fetch finance summary and branches from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryData, branchesData, financesData] = await Promise.all([
        api.finances.getSummary(),
        api.branches.getAll(),
        api.finances.getAll()
      ]);

      setSummary(summaryData);
      setBranches(branchesData);

      // Apply filters to the data
      filterFinanceData(financesData);

      setError(null);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load financial data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter finance data based on selected filters
  const filterFinanceData = useCallback((data) => {
    if (!data || data.length === 0) {
      setFilteredData(null);
      return;
    }

    let filtered = [...data];

    // Filter by branch if selected
    if (filterBranch) {
      filtered = filtered.filter(item => item.branchId === filterBranch);
    }

    // Filter by date range
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);

      // Set time to beginning/end of day for accurate comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      return itemDate >= startDate && itemDate <= endDate;
    });

    // Filter by type if not showing summary
    if (reportType !== 'summary') {
      filtered = filtered.filter(item => item.type === reportType);
    }

    // Calculate summary for filtered data
    const filteredIncome = filtered.filter(item => item.type === 'income');
    const filteredExpenses = filtered.filter(item => item.type === 'expense');

    const totalFilteredIncome = filteredIncome.reduce((sum, item) => sum + item.amount, 0);
    const totalFilteredExpenses = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);

    // Group by category
    const incomeByCategory = {};
    filteredIncome.forEach(item => {
      if (!incomeByCategory[item.category]) {
        incomeByCategory[item.category] = 0;
      }
      incomeByCategory[item.category] += item.amount;
    });

    const expensesByCategory = {};
    filteredExpenses.forEach(item => {
      if (!expensesByCategory[item.category]) {
        expensesByCategory[item.category] = 0;
      }
      expensesByCategory[item.category] += item.amount;
    });

    // Convert to array format for charts
    const incomeByCategoryArray = Object.entries(incomeByCategory).map(([category, amount]) => ({
      category,
      amount
    }));

    const expensesByCategoryArray = Object.entries(expensesByCategory).map(([category, amount]) => ({
      category,
      amount
    }));

    // Set filtered data
    setFilteredData({
      transactions: filtered,
      totalIncome: totalFilteredIncome,
      totalExpenses: totalFilteredExpenses,
      balance: totalFilteredIncome - totalFilteredExpenses,
      incomeByCategory: incomeByCategoryArray,
      expensesByCategory: expensesByCategoryArray
    });
  }, [filterBranch, dateRange, reportType]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Handle branch filter change
  const handleBranchFilterChange = (e) => {
    setFilterBranch(e.target.value);
    // Refetch data with new filter
    fetchData();
  };

  // Handle date range change
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
    // Don't refetch immediately to avoid multiple fetches when changing both start and end dates
  };

  // Apply date range filter
  const applyDateFilter = () => {
    fetchData();
  };

  // Handle report type change
  const handleReportTypeChange = (type) => {
    setReportType(type);
    // Refetch data with new filter
    fetchData();
  };

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  // Handle refresh interval change
  const handleRefreshIntervalChange = (e) => {
    setRefreshInterval(parseInt(e.target.value));
  };

  // Manual refresh
  const handleManualRefresh = () => {
    fetchData();
  };

  // Generate and export PDF report
  const generatePDFReport = () => {
    if (!filteredData) return;

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Finance Report', 14, 22);

    // Add subtitle with report type, branch, and date range
    doc.setFontSize(12);
    const branchName = filterBranch
      ? branches.find(b => b._id === filterBranch)?.name || 'Selected Branch'
      : 'All Branches';

    const reportTypeText = reportType === 'summary'
      ? 'Summary'
      : reportType === 'income'
        ? 'Income'
        : 'Expenses';

    doc.text(`Type: ${reportTypeText} | Branch: ${branchName}`, 14, 32);
    doc.text(`Period: ${dateRange.startDate} to ${dateRange.endDate}`, 14, 42);

    // Add summary section
    doc.text('Financial Summary', 14, 52);
    doc.text(`Total Income: ${formatCurrency(filteredData.totalIncome)}`, 14, 62);
    doc.text(`Total Expenses: ${formatCurrency(filteredData.totalExpenses)}`, 14, 72);
    doc.text(`Balance: ${formatCurrency(filteredData.balance)}`, 14, 82);

    // Add transactions table
    const tableColumn = ["Date", "Type", "Category", "Amount", "Description"];
    const tableRows = [];

    if (filteredData.transactions && filteredData.transactions.length > 0) {
      filteredData.transactions.forEach(item => {
        tableRows.push([
          new Date(item.date).toLocaleDateString(),
          item.type === 'income' ? 'Income' : 'Expense',
          item.category,
          formatCurrency(item.amount),
          item.description || '-'
        ]);
      });
    }

    // Add table with transactions
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 92,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 66, 66] }
    });

    // Save the PDF
    doc.save(`Finance_Report_${reportTypeText}_${branchName.replace(/\s+/g, '_')}_${dateRange.startDate}_to_${dateRange.endDate}.pdf`);
  };

  return (
    <Layout>
      <div className="data-manager finance-manager" ref={reportRef}>
        <div className="manager-header">
          <h1>{isAdminUser ? 'Finance Reports Viewer' : 'Finance Reports'}</h1>
          <div className="header-actions">
            <div className="refresh-controls">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleManualRefresh}
                title="Refresh data"
              >
                <FontAwesomeIcon icon="sync" /> Refresh
              </button>

              <div className="auto-refresh-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={toggleAutoRefresh}
                  />
                  Auto-refresh
                </label>
                {autoRefresh && (
                  <select
                    value={refreshInterval}
                    onChange={handleRefreshIntervalChange}
                    className="refresh-interval"
                  >
                    <option value="10">10s</option>
                    <option value="30">30s</option>
                    <option value="60">1m</option>
                    <option value="300">5m</option>
                  </select>
                )}
              </div>

              {lastRefreshed && (
                <div className="last-refreshed">
                  Last updated: {lastRefreshed.toLocaleTimeString()}
                </div>
              )}
            </div>

            {isFinanceUser ? (
              <button type="button" className="btn btn-primary" onClick={generatePDFReport}>
                <FontAwesomeIcon icon="file-export" /> Export PDF
              </button>
            ) : (
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

        {/* Report Filters */}
        <div className="report-filters">
          <div className="filter-group">
            <label htmlFor="reportType">Report Type:</label>
            <div className="btn-group">
              <button
                className={`btn ${reportType === 'summary' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleReportTypeChange('summary')}
              >
                Summary
              </button>
              <button
                className={`btn ${reportType === 'income' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleReportTypeChange('income')}
              >
                Income
              </button>
              <button
                className={`btn ${reportType === 'expense' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleReportTypeChange('expense')}
              >
                Expenses
              </button>
            </div>
          </div>

          <div className="filter-group">
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

          <div className="filter-group">
            <label>Date Range:</label>
            <div className="date-range">
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateRangeChange}
              />
              <span>to</span>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateRangeChange}
              />
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={applyDateFilter}
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Report Preview */}
        <div className="report-preview">
          <h2>Report Preview</h2>

          {loading ? (
            <div className="loading-spinner">
              <FontAwesomeIcon icon="spinner" spin />
              <span>Loading data...</span>
            </div>
          ) : (
            <div className="report-content">
              <div className="summary-cards">
                <div className="summary-card income">
                  <div className="card-icon">
                    <FontAwesomeIcon icon="arrow-up" />
                  </div>
                  <div className="card-content">
                    <h3>Total Income</h3>
                    <p className="amount">
                      {formatCurrency(filteredData ? filteredData.totalIncome : summary.totalIncome)}
                    </p>
                  </div>
                </div>

                <div className="summary-card expenses">
                  <div className="card-icon">
                    <FontAwesomeIcon icon="arrow-down" />
                  </div>
                  <div className="card-content">
                    <h3>Total Expenses</h3>
                    <p className="amount">
                      {formatCurrency(filteredData ? filteredData.totalExpenses : summary.totalExpenses)}
                    </p>
                  </div>
                </div>

                <div className="summary-card balance">
                  <div className="card-icon">
                    <FontAwesomeIcon icon="balance-scale" />
                  </div>
                  <div className="card-content">
                    <h3>Balance</h3>
                    <p className={`amount ${(filteredData ? filteredData.balance : summary.balance) >= 0 ? 'positive' : 'negative'}`}>
                      {formatCurrency(filteredData ? filteredData.balance : summary.balance)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="report-charts">
                <div className="chart-container">
                  <h3>Income by Category</h3>
                  {filteredData && filteredData.incomeByCategory.length > 0 ? (
                    <Pie
                      data={{
                        labels: filteredData.incomeByCategory.map(item => item.category),
                        datasets: [
                          {
                            data: filteredData.incomeByCategory.map(item => item.amount),
                            backgroundColor: [
                              'rgba(39, 174, 96, 0.6)',
                              'rgba(46, 204, 113, 0.6)',
                              'rgba(52, 152, 219, 0.6)',
                              'rgba(155, 89, 182, 0.6)',
                              'rgba(52, 73, 94, 0.6)',
                              'rgba(22, 160, 133, 0.6)',
                              'rgba(41, 128, 185, 0.6)',
                              'rgba(142, 68, 173, 0.6)',
                            ],
                            borderColor: [
                              '#27ae60',
                              '#2ecc71',
                              '#3498db',
                              '#9b59b6',
                              '#34495e',
                              '#16a085',
                              '#2980b9',
                              '#8e44ad',
                            ],
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                  label += ': ';
                                }
                                label += formatCurrency(context.raw);
                                return label;
                              }
                            }
                          }
                        },
                      }}
                    />
                  ) : (
                    <div className="placeholder-chart">
                      <FontAwesomeIcon icon="chart-pie" size="3x" />
                      <p>No income data available for the selected filters</p>
                    </div>
                  )}
                </div>

                <div className="chart-container">
                  <h3>Expenses by Category</h3>
                  {filteredData && filteredData.expensesByCategory.length > 0 ? (
                    <Pie
                      data={{
                        labels: filteredData.expensesByCategory.map(item => item.category),
                        datasets: [
                          {
                            data: filteredData.expensesByCategory.map(item => item.amount),
                            backgroundColor: [
                              'rgba(231, 76, 60, 0.6)',
                              'rgba(255, 99, 71, 0.6)',
                              'rgba(230, 126, 34, 0.6)',
                              'rgba(241, 196, 15, 0.6)',
                              'rgba(243, 156, 18, 0.6)',
                              'rgba(211, 84, 0, 0.6)',
                              'rgba(192, 57, 43, 0.6)',
                              'rgba(189, 195, 199, 0.6)',
                            ],
                            borderColor: [
                              '#e74c3c',
                              '#ff6347',
                              '#e67e22',
                              '#f1c40f',
                              '#f39c12',
                              '#d35400',
                              '#c0392b',
                              '#bdc3c7',
                            ],
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                  label += ': ';
                                }
                                label += formatCurrency(context.raw);
                                return label;
                              }
                            }
                          }
                        },
                      }}
                    />
                  ) : (
                    <div className="placeholder-chart">
                      <FontAwesomeIcon icon="chart-pie" size="3x" />
                      <p>No expense data available for the selected filters</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Transactions Table */}
              {filteredData && filteredData.transactions && filteredData.transactions.length > 0 && (
                <div className="transactions-section">
                  <h3>Transactions</h3>
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Category</th>
                          <th>Amount</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.transactions.map((transaction) => (
                          <tr key={transaction._id}>
                            <td>{new Date(transaction.date).toLocaleDateString()}</td>
                            <td>
                              <span className={`type-badge ${transaction.type}`}>
                                {transaction.type === 'income' ? 'Income' : 'Expense'}
                              </span>
                            </td>
                            <td>{transaction.category}</td>
                            <td>{formatCurrency(transaction.amount)}</td>
                            <td>{transaction.description || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FinanceReports;
