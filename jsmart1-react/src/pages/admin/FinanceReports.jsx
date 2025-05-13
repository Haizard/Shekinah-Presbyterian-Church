import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import FinanceLayout from '../../components/finance/FinanceLayout';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/admin/DataManager.css';
import '../../styles/admin/FinanceManager.css';

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

  const { userRole } = useContext(AuthContext);
  
  // Choose the appropriate layout based on user role
  const Layout = userRole === 'finance' ? FinanceLayout : AdminLayout;

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch finance summary and branches from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryData, branchesData] = await Promise.all([
        api.finances.getSummary(),
        api.branches.getAll()
      ]);

      setSummary(summaryData);
      setBranches(branchesData);
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
      currency: 'USD'
    }).format(amount);
  };

  // Handle branch filter change
  const handleBranchFilterChange = (e) => {
    setFilterBranch(e.target.value);
  };

  // Handle date range change
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle report type change
  const handleReportTypeChange = (type) => {
    setReportType(type);
  };

  // Generate report
  const generateReport = () => {
    // In a real implementation, this would fetch filtered data based on the selected criteria
    alert(`Generating ${reportType} report for ${filterBranch ? 'branch ' + filterBranch : 'all branches'} from ${dateRange.startDate} to ${dateRange.endDate}`);
  };

  return (
    <Layout>
      <div className="data-manager finance-manager">
        <div className="manager-header">
          <h1>Finance Reports</h1>
          <button type="button" className="btn btn-primary" onClick={generateReport}>
            <FontAwesomeIcon icon="file-export" /> Generate Report
          </button>
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

              <div className="report-charts">
                <div className="chart-container">
                  <h3>Income by Category</h3>
                  <div className="placeholder-chart">
                    <FontAwesomeIcon icon="chart-pie" size="3x" />
                    <p>Chart will be displayed here</p>
                  </div>
                </div>

                <div className="chart-container">
                  <h3>Expenses by Category</h3>
                  <div className="placeholder-chart">
                    <FontAwesomeIcon icon="chart-pie" size="3x" />
                    <p>Chart will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FinanceReports;
