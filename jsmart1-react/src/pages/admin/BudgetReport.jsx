import React, { useState, useEffect, useContext, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import FinanceLayout from '../../components/finance/FinanceLayout';
import AuthContext from '../../context/AuthContext';
import BudgetInsights from '../../components/finance/BudgetInsights';
import AdvancedFilters from '../../components/finance/AdvancedFilters';
import BudgetForecast from '../../components/finance/BudgetForecast';
import api from '../../services/api';
import '../../styles/admin/DataManager.css';
import '../../styles/admin/FinanceManager.css';
import '../../styles/admin/BudgetReport.css';

// Chart.js and PDF imports
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const BudgetReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [previousYear, setPreviousYear] = useState(new Date().getFullYear() - 1);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [previousBudget, setPreviousBudget] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showInsights, setShowInsights] = useState(true);
  const [showForecast, setShowForecast] = useState(false);
  const [filters, setFilters] = useState({
    categoryTypes: [],
    categories: [],
    minAmount: '',
    maxAmount: '',
    varianceThreshold: 0,
    sortBy: 'category',
    sortDirection: 'asc'
  });
  const [filteredItems, setFilteredItems] = useState([]);
  const reportRef = useRef(null);

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
    fetchCurrentBudget();
    if (showComparison) {
      fetchPreviousBudget();
    }
  }, [currentYear, previousYear, selectedBranch, showComparison]);

  // Apply filters to budget items
  useEffect(() => {
    if (!currentBudget || !currentBudget.items) {
      setFilteredItems([]);
      return;
    }

    let filtered = [...currentBudget.items];

    // Filter by category type
    if (filters.categoryTypes.length > 0) {
      filtered = filtered.filter(item => filters.categoryTypes.includes(item.type));
    }

    // Filter by category
    if (filters.categories.length > 0) {
      filtered = filtered.filter(item => filters.categories.includes(item.category));
    }

    // Filter by amount
    if (filters.minAmount !== '') {
      filtered = filtered.filter(item => item.amount >= parseFloat(filters.minAmount));
    }

    if (filters.maxAmount !== '') {
      filtered = filtered.filter(item => item.amount <= parseFloat(filters.maxAmount));
    }

    // Filter by variance threshold
    if (filters.varianceThreshold > 0) {
      filtered = filtered.filter(item => {
        const variance = Math.abs(item.actual - item.amount);
        const variancePercentage = item.amount > 0 ? (variance / item.amount) * 100 : 0;
        return variancePercentage >= filters.varianceThreshold;
      });
    }

    // Sort items
    filtered.sort((a, b) => {
      let valueA, valueB;

      switch (filters.sortBy) {
        case 'category':
          valueA = a.category.toLowerCase();
          valueB = b.category.toLowerCase();
          break;
        case 'amount':
          valueA = a.amount;
          valueB = b.amount;
          break;
        case 'actual':
          valueA = a.actual;
          valueB = b.actual;
          break;
        case 'variance':
          valueA = Math.abs(a.actual - a.amount);
          valueB = Math.abs(b.actual - b.amount);
          break;
        case 'variancePercentage':
          valueA = a.amount > 0 ? Math.abs(a.actual - a.amount) / a.amount : 0;
          valueB = b.amount > 0 ? Math.abs(b.actual - b.amount) / b.amount : 0;
          break;
        default:
          valueA = a.category.toLowerCase();
          valueB = b.category.toLowerCase();
      }

      if (filters.sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setFilteredItems(filtered);
  }, [currentBudget, filters]);

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

  // Fetch current budget data from API
  const fetchCurrentBudget = async () => {
    try {
      setLoading(true);
      setError(null);

      const budgetData = await api.budgets.getByYearAndBranch(currentYear, selectedBranch);

      if (budgetData._id) {
        setCurrentBudget(budgetData);
      } else {
        setCurrentBudget(null);
      }
    } catch (err) {
      console.error('Error fetching current budget:', err);
      setError('Failed to load current budget data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch previous budget data from API
  const fetchPreviousBudget = async () => {
    try {
      setLoading(true);
      setError(null);

      const budgetData = await api.budgets.getByYearAndBranch(previousYear, selectedBranch);

      if (budgetData._id) {
        setPreviousBudget(budgetData);
      } else {
        setPreviousBudget(null);
      }
    } catch (err) {
      console.error('Error fetching previous budget:', err);
      setError('Failed to load previous budget data. Please try again.');
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

  // Calculate budget totals
  const calculateTotals = (budget) => {
    if (!budget || !budget.items || budget.items.length === 0) {
      return {
        incomeBudget: 0,
        incomeActual: 0,
        expenseBudget: 0,
        expenseActual: 0,
        balanceBudget: 0,
        balanceActual: 0
      };
    }

    const incomeBudget = budget.items
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0);

    const incomeActual = budget.items
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.actual, 0);

    const expenseBudget = budget.items
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0);

    const expenseActual = budget.items
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

  // Handle current year change
  const handleCurrentYearChange = (e) => {
    setCurrentYear(parseInt(e.target.value));
  };

  // Handle previous year change
  const handlePreviousYearChange = (e) => {
    setPreviousYear(parseInt(e.target.value));
  };

  // Toggle comparison view
  const handleToggleComparison = () => {
    setShowComparison(!showComparison);
  };

  // Toggle insights view
  const handleToggleInsights = () => {
    setShowInsights(!showInsights);
  };

  // Toggle forecast view
  const handleToggleForecast = () => {
    setShowForecast(!showForecast);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Budget Report', 14, 22);

    // Add subtitle with year and branch info
    doc.setFontSize(12);
    const branchName = selectedBranch
      ? branches.find(b => b._id === selectedBranch)?.name || 'Selected Branch'
      : 'Main Church';
    doc.text(`Year: ${currentYear} | Branch: ${branchName}`, 14, 32);

    // Add budget summary
    const currentTotals = calculateTotals(currentBudget);

    // Generate table data
    const tableColumn = ["Category", "Type", "Budget Amount", "Actual Amount", "Variance"];
    const tableRows = [];

    if (currentBudget && currentBudget.items) {
      currentBudget.items.forEach(item => {
        const variance = item.actual - item.amount;
        tableRows.push([
          item.category,
          item.type === 'income' ? 'Income' : 'Expense',
          formatCurrency(item.amount),
          formatCurrency(item.actual),
          formatCurrency(variance)
        ]);
      });
    }

    // Add summary section
    doc.text('Budget Summary', 14, 42);
    doc.text(`Total Income (Budget): ${formatCurrency(currentTotals.incomeBudget)}`, 14, 52);
    doc.text(`Total Income (Actual): ${formatCurrency(currentTotals.incomeActual)}`, 14, 62);
    doc.text(`Total Expenses (Budget): ${formatCurrency(currentTotals.expenseBudget)}`, 14, 72);
    doc.text(`Total Expenses (Actual): ${formatCurrency(currentTotals.expenseActual)}`, 14, 82);
    doc.text(`Balance (Budget): ${formatCurrency(currentTotals.balanceBudget)}`, 14, 92);
    doc.text(`Balance (Actual): ${formatCurrency(currentTotals.balanceActual)}`, 14, 102);

    // Add table with budget items
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 112,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 66, 66] }
    });

    // If comparison is shown, add comparison data
    if (showComparison && previousBudget) {
      const previousTotals = calculateTotals(previousBudget);

      // Add a new page for comparison
      doc.addPage();

      // Add title
      doc.setFontSize(18);
      doc.text('Budget Comparison', 14, 22);

      // Add subtitle
      doc.setFontSize(12);
      doc.text(`Comparing ${previousYear} vs ${currentYear} | Branch: ${branchName}`, 14, 32);

      // Add comparison summary
      doc.text('Comparison Summary', 14, 42);
      doc.text(`Income Change: ${formatCurrency(currentTotals.incomeBudget - previousTotals.incomeBudget)} (Budget)`, 14, 52);
      doc.text(`Income Change: ${formatCurrency(currentTotals.incomeActual - previousTotals.incomeActual)} (Actual)`, 14, 62);
      doc.text(`Expenses Change: ${formatCurrency(currentTotals.expenseBudget - previousTotals.expenseBudget)} (Budget)`, 14, 72);
      doc.text(`Expenses Change: ${formatCurrency(currentTotals.expenseActual - previousTotals.expenseActual)} (Actual)`, 14, 82);
      doc.text(`Balance Change: ${formatCurrency(currentTotals.balanceBudget - previousTotals.balanceBudget)} (Budget)`, 14, 92);
      doc.text(`Balance Change: ${formatCurrency(currentTotals.balanceActual - previousTotals.balanceActual)} (Actual)`, 14, 102);
    }

    // Save the PDF
    doc.save(`Budget_Report_${currentYear}_${branchName.replace(/\s+/g, '_')}.pdf`);
  };

  const currentTotals = calculateTotals(currentBudget);
  const previousTotals = calculateTotals(previousBudget);

  return (
    <Layout>
      <div className="data-manager finance-manager" ref={reportRef}>
        <div className="manager-header">
          <h1>Budget Report</h1>
          <div className="header-actions">
            <button type="button" className="btn btn-secondary" onClick={handleToggleComparison}>
              <FontAwesomeIcon icon={showComparison ? "chart-line" : "chart-bar"} />
              {showComparison ? ' Hide Comparison' : ' Show Comparison'}
            </button>
            <button type="button" className="btn btn-info" onClick={handleToggleInsights}>
              <FontAwesomeIcon icon={showInsights ? "lightbulb" : "lightbulb"} />
              {showInsights ? ' Hide Insights' : ' Show Insights'}
            </button>
            <button type="button" className="btn btn-warning" onClick={handleToggleForecast}>
              <FontAwesomeIcon icon={showForecast ? "chart-line" : "chart-line"} />
              {showForecast ? ' Hide Forecast' : ' Show Forecast'}
            </button>
            <button type="button" className="btn btn-primary" onClick={generatePDF}>
              <FontAwesomeIcon icon="file-pdf" /> Export PDF
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            <FontAwesomeIcon icon="exclamation-circle" />
            {error}
          </div>
        )}

        {/* Report Filters */}
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
            <label htmlFor="currentYearSelect">Current Year:</label>
            <select
              id="currentYearSelect"
              value={currentYear}
              onChange={handleCurrentYearChange}
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

          {showComparison && (
            <div className="filter-group">
              <label htmlFor="previousYearSelect">Compare with:</label>
              <select
                id="previousYearSelect"
                value={previousYear}
                onChange={handlePreviousYearChange}
              >
                {[...Array(5)].map((_, i) => {
                  const year = new Date().getFullYear() - 4 + i;
                  return (
                    <option key={year} value={year} disabled={year === currentYear}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>

        {/* Report Content */}
        <div className="report-content">
          {loading ? (
            <div className="loading-spinner">
              <FontAwesomeIcon icon="spinner" spin />
              <span>Loading data...</span>
            </div>
          ) : !currentBudget ? (
            <div className="empty-state">
              <FontAwesomeIcon icon="chart-pie" size="3x" />
              <h3>No Budget Data Available</h3>
              <p>There is no budget data available for the selected year and branch. Please create a budget first.</p>
            </div>
          ) : (
            <>
              {/* Advanced Filters */}
              <AdvancedFilters
                budget={currentBudget}
                onFilterChange={handleFilterChange}
                initialFilters={filters}
              />

              {/* Budget Summary */}
              <div className="budget-summary-report">
                <h2>Budget Summary for {currentYear}</h2>
                <div className="summary-cards">
                  <div className="summary-card income">
                    <div className="card-content">
                      <h3>Income</h3>
                      <div className="budget-amounts">
                        <div>
                          <span>Budget:</span>
                          <span className="amount">{formatCurrency(currentTotals.incomeBudget)}</span>
                        </div>
                        <div>
                          <span>Actual:</span>
                          <span className="amount">{formatCurrency(currentTotals.incomeActual)}</span>
                        </div>
                        <div>
                          <span>Variance:</span>
                          <span className={`amount ${currentTotals.incomeActual >= currentTotals.incomeBudget ? 'positive' : 'negative'}`}>
                            {formatCurrency(currentTotals.incomeActual - currentTotals.incomeBudget)}
                          </span>
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
                          <span className="amount">{formatCurrency(currentTotals.expenseBudget)}</span>
                        </div>
                        <div>
                          <span>Actual:</span>
                          <span className="amount">{formatCurrency(currentTotals.expenseActual)}</span>
                        </div>
                        <div>
                          <span>Variance:</span>
                          <span className={`amount ${currentTotals.expenseActual <= currentTotals.expenseBudget ? 'positive' : 'negative'}`}>
                            {formatCurrency(currentTotals.expenseBudget - currentTotals.expenseActual)}
                          </span>
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
                          <span className={`amount ${currentTotals.balanceBudget >= 0 ? 'positive' : 'negative'}`}>
                            {formatCurrency(currentTotals.balanceBudget)}
                          </span>
                        </div>
                        <div>
                          <span>Actual:</span>
                          <span className={`amount ${currentTotals.balanceActual >= 0 ? 'positive' : 'negative'}`}>
                            {formatCurrency(currentTotals.balanceActual)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Automated Insights */}
              {showInsights && (
                <BudgetInsights
                  currentBudget={currentBudget}
                  previousBudget={previousBudget}
                  currentTotals={currentTotals}
                  previousTotals={previousTotals}
                />
              )}

              {/* Chart visualizations */}
              <div className="chart-section">
                <h2>Budget Visualization</h2>
                <div className="chart-container">
                  <div className="chart-item">
                    <h3>Income vs Expenses (Budget)</h3>
                    <Pie
                      data={{
                        labels: ['Income', 'Expenses'],
                        datasets: [
                          {
                            data: [currentTotals.incomeBudget, currentTotals.expenseBudget],
                            backgroundColor: ['rgba(39, 174, 96, 0.6)', 'rgba(231, 76, 60, 0.6)'],
                            borderColor: ['#27ae60', '#e74c3c'],
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
                  </div>

                  <div className="chart-item">
                    <h3>Income vs Expenses (Actual)</h3>
                    <Pie
                      data={{
                        labels: ['Income', 'Expenses'],
                        datasets: [
                          {
                            data: [currentTotals.incomeActual, currentTotals.expenseActual],
                            backgroundColor: ['rgba(39, 174, 96, 0.6)', 'rgba(231, 76, 60, 0.6)'],
                            borderColor: ['#27ae60', '#e74c3c'],
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
                  </div>
                </div>

                {currentBudget && currentBudget.items && currentBudget.items.length > 0 && (
                  <div className="chart-container">
                    <div className="chart-item full-width">
                      <h3>Budget vs Actual by Category</h3>
                      <Bar
                        data={{
                          labels: currentBudget.items.map(item => item.category),
                          datasets: [
                            {
                              label: 'Budget',
                              data: currentBudget.items.map(item => item.amount),
                              backgroundColor: item =>
                                item.dataIndex !== undefined && currentBudget.items[item.dataIndex].type === 'income'
                                  ? 'rgba(39, 174, 96, 0.6)'
                                  : 'rgba(231, 76, 60, 0.6)',
                              borderColor: item =>
                                item.dataIndex !== undefined && currentBudget.items[item.dataIndex].type === 'income'
                                  ? '#27ae60'
                                  : '#e74c3c',
                              borderWidth: 1,
                            },
                            {
                              label: 'Actual',
                              data: currentBudget.items.map(item => item.actual),
                              backgroundColor: item =>
                                item.dataIndex !== undefined && currentBudget.items[item.dataIndex].type === 'income'
                                  ? 'rgba(46, 204, 113, 0.6)'
                                  : 'rgba(255, 99, 71, 0.6)',
                              borderColor: item =>
                                item.dataIndex !== undefined && currentBudget.items[item.dataIndex].type === 'income'
                                  ? '#2ecc71'
                                  : '#ff6347',
                              borderWidth: 1,
                            },
                          ],
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
                          },
                          plugins: {
                            legend: {
                              position: 'bottom',
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  let label = context.dataset.label || '';
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
                    </div>
                  </div>
                )}
              </div>

              {/* Budget Forecast */}
              {showForecast && (
                <BudgetForecast
                  currentBudget={currentBudget}
                  previousBudget={previousBudget}
                  currentYear={currentYear}
                />
              )}

              {/* Comparison section */}
              {showComparison && previousBudget && (
                <div className="comparison-section">
                  <h2>Year-over-Year Comparison</h2>

                  {/* Comparison Chart */}
                  <div className="chart-container">
                    <div className="chart-item full-width">
                      <h3>Budget Comparison: {previousYear} vs {currentYear}</h3>
                      <Bar
                        data={{
                          labels: ['Income Budget', 'Income Actual', 'Expense Budget', 'Expense Actual', 'Balance Budget', 'Balance Actual'],
                          datasets: [
                            {
                              label: previousYear.toString(),
                              data: [
                                previousTotals.incomeBudget,
                                previousTotals.incomeActual,
                                previousTotals.expenseBudget,
                                previousTotals.expenseActual,
                                previousTotals.balanceBudget,
                                previousTotals.balanceActual
                              ],
                              backgroundColor: 'rgba(52, 152, 219, 0.6)',
                              borderColor: '#3498db',
                              borderWidth: 1,
                            },
                            {
                              label: currentYear.toString(),
                              data: [
                                currentTotals.incomeBudget,
                                currentTotals.incomeActual,
                                currentTotals.expenseBudget,
                                currentTotals.expenseActual,
                                currentTotals.balanceBudget,
                                currentTotals.balanceActual
                              ],
                              backgroundColor: 'rgba(46, 204, 113, 0.6)',
                              borderColor: '#2ecc71',
                              borderWidth: 1,
                            },
                          ],
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
                          },
                          plugins: {
                            legend: {
                              position: 'bottom',
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  let label = context.dataset.label || '';
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
                    </div>
                  </div>

                  <div className="comparison-table-container">
                    <table className="comparison-table">
                      <thead>
                        <tr>
                          <th>Category</th>
                          <th>{previousYear} Budget</th>
                          <th>{previousYear} Actual</th>
                          <th>{currentYear} Budget</th>
                          <th>{currentYear} Actual</th>
                          <th>Budget Change</th>
                          <th>Actual Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Total Income</td>
                          <td>{formatCurrency(previousTotals.incomeBudget)}</td>
                          <td>{formatCurrency(previousTotals.incomeActual)}</td>
                          <td>{formatCurrency(currentTotals.incomeBudget)}</td>
                          <td>{formatCurrency(currentTotals.incomeActual)}</td>
                          <td className={currentTotals.incomeBudget >= previousTotals.incomeBudget ? 'positive' : 'negative'}>
                            {formatCurrency(currentTotals.incomeBudget - previousTotals.incomeBudget)}
                          </td>
                          <td className={currentTotals.incomeActual >= previousTotals.incomeActual ? 'positive' : 'negative'}>
                            {formatCurrency(currentTotals.incomeActual - previousTotals.incomeActual)}
                          </td>
                        </tr>
                        <tr>
                          <td>Total Expenses</td>
                          <td>{formatCurrency(previousTotals.expenseBudget)}</td>
                          <td>{formatCurrency(previousTotals.expenseActual)}</td>
                          <td>{formatCurrency(currentTotals.expenseBudget)}</td>
                          <td>{formatCurrency(currentTotals.expenseActual)}</td>
                          <td className={currentTotals.expenseBudget <= previousTotals.expenseBudget ? 'positive' : 'negative'}>
                            {formatCurrency(currentTotals.expenseBudget - previousTotals.expenseBudget)}
                          </td>
                          <td className={currentTotals.expenseActual <= previousTotals.expenseActual ? 'positive' : 'negative'}>
                            {formatCurrency(currentTotals.expenseActual - previousTotals.expenseActual)}
                          </td>
                        </tr>
                        <tr>
                          <td>Net Balance</td>
                          <td>{formatCurrency(previousTotals.balanceBudget)}</td>
                          <td>{formatCurrency(previousTotals.balanceActual)}</td>
                          <td>{formatCurrency(currentTotals.balanceBudget)}</td>
                          <td>{formatCurrency(currentTotals.balanceActual)}</td>
                          <td className={currentTotals.balanceBudget >= previousTotals.balanceBudget ? 'positive' : 'negative'}>
                            {formatCurrency(currentTotals.balanceBudget - previousTotals.balanceBudget)}
                          </td>
                          <td className={currentTotals.balanceActual >= previousTotals.balanceActual ? 'positive' : 'negative'}>
                            {formatCurrency(currentTotals.balanceActual - previousTotals.balanceActual)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BudgetReport;
