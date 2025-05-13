import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Line } from 'react-chartjs-2';
import '../../styles/finance/BudgetForecast.css';

const BudgetForecast = ({ currentBudget, previousBudget, currentYear }) => {
  const [forecastData, setForecastData] = useState(null);
  const [forecastYear, setForecastYear] = useState(currentYear + 1);
  const [growthRate, setGrowthRate] = useState(5);
  const [expenseGrowthRate, setExpenseGrowthRate] = useState(3);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [categoryGrowthRates, setCategoryGrowthRates] = useState({});

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Generate forecast data
  useEffect(() => {
    if (!currentBudget || !currentBudget.items || currentBudget.items.length === 0) {
      setForecastData(null);
      return;
    }

    // Calculate current totals
    const incomeBudget = currentBudget.items
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0);

    const incomeActual = currentBudget.items
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.actual, 0);

    const expenseBudget = currentBudget.items
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0);

    const expenseActual = currentBudget.items
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.actual, 0);

    // Generate forecast items
    const forecastItems = currentBudget.items.map(item => {
      const categoryRate = categoryGrowthRates[item.category] !== undefined
        ? categoryGrowthRates[item.category]
        : item.type === 'income' ? growthRate : expenseGrowthRate;
      
      const growthFactor = 1 + (categoryRate / 100);
      
      return {
        ...item,
        amount: Math.round(item.amount * growthFactor),
        actual: 0, // No actuals for forecast
        forecast: true
      };
    });

    // Calculate forecast totals
    const forecastIncome = forecastItems
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0);

    const forecastExpense = forecastItems
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0);

    const forecastBalance = forecastIncome - forecastExpense;

    // Set forecast data
    setForecastData({
      items: forecastItems,
      totals: {
        income: forecastIncome,
        expense: forecastExpense,
        balance: forecastBalance
      },
      currentTotals: {
        incomeBudget,
        incomeActual,
        expenseBudget,
        expenseActual,
        balanceBudget: incomeBudget - expenseBudget,
        balanceActual: incomeActual - expenseActual
      }
    });
  }, [currentBudget, growthRate, expenseGrowthRate, categoryGrowthRates]);

  // Handle category growth rate change
  const handleCategoryRateChange = (category, rate) => {
    setCategoryGrowthRates({
      ...categoryGrowthRates,
      [category]: parseFloat(rate)
    });
  };

  // Reset category growth rates
  const handleResetCategoryRates = () => {
    setCategoryGrowthRates({});
  };

  // Get unique categories from budget items
  const getUniqueCategories = () => {
    if (!currentBudget || !currentBudget.items || currentBudget.items.length === 0) return [];
    
    return [...new Set(currentBudget.items.map(item => item.category))].sort();
  };

  // Generate trend data for chart
  const generateTrendData = () => {
    if (!currentBudget || !previousBudget || !forecastData) return null;

    // Previous year data
    const prevIncome = previousBudget.items
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.actual, 0);

    const prevExpense = previousBudget.items
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.actual, 0);

    const prevBalance = prevIncome - prevExpense;

    // Current year data
    const currIncome = forecastData.currentTotals.incomeActual;
    const currExpense = forecastData.currentTotals.expenseActual;
    const currBalance = currIncome - currExpense;

    // Forecast data
    const forecastIncome = forecastData.totals.income;
    const forecastExpense = forecastData.totals.expense;
    const forecastBalance = forecastIncome - forecastExpense;

    return {
      labels: [currentYear - 1, currentYear, forecastYear],
      datasets: [
        {
          label: 'Income',
          data: [prevIncome, currIncome, forecastIncome],
          borderColor: '#27ae60',
          backgroundColor: 'rgba(39, 174, 96, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Expenses',
          data: [prevExpense, currExpense, forecastExpense],
          borderColor: '#e74c3c',
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Balance',
          data: [prevBalance, currBalance, forecastBalance],
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  const trendData = generateTrendData();
  const uniqueCategories = getUniqueCategories();

  return (
    <div className="budget-forecast">
      <h2>
        <FontAwesomeIcon icon="chart-line" className="forecast-icon" />
        Budget Forecast
      </h2>

      {!currentBudget || !currentBudget.items || currentBudget.items.length === 0 ? (
        <div className="empty-forecast">
          <FontAwesomeIcon icon="chart-line" size="3x" />
          <p>Create a budget to see forecasts and projections.</p>
        </div>
      ) : !previousBudget ? (
        <div className="empty-forecast">
          <FontAwesomeIcon icon="chart-line" size="3x" />
          <p>Previous year data is needed for accurate forecasting. Enable comparison mode to see forecasts.</p>
        </div>
      ) : (
        <>
          <div className="forecast-controls">
            <div className="control-group">
              <label htmlFor="forecastYear">Forecast Year</label>
              <input
                type="number"
                id="forecastYear"
                value={forecastYear}
                onChange={(e) => setForecastYear(parseInt(e.target.value))}
                min={currentYear + 1}
                max={currentYear + 5}
              />
            </div>
            
            <div className="control-group">
              <label htmlFor="growthRate">Income Growth Rate (%)</label>
              <input
                type="number"
                id="growthRate"
                value={growthRate}
                onChange={(e) => setGrowthRate(parseFloat(e.target.value))}
                min={-20}
                max={50}
                step={0.5}
              />
            </div>
            
            <div className="control-group">
              <label htmlFor="expenseGrowthRate">Expense Growth Rate (%)</label>
              <input
                type="number"
                id="expenseGrowthRate"
                value={expenseGrowthRate}
                onChange={(e) => setExpenseGrowthRate(parseFloat(e.target.value))}
                min={-20}
                max={50}
                step={0.5}
              />
            </div>
            
            <button
              type="button"
              className="btn-advanced"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <FontAwesomeIcon icon={showAdvanced ? 'chevron-up' : 'chevron-down'} />
              {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
            </button>
          </div>
          
          {showAdvanced && (
            <div className="advanced-forecast-options">
              <h3>Category-Specific Growth Rates</h3>
              <p className="help-text">
                Set custom growth rates for specific categories. If not set, the default growth rate for the category type will be used.
              </p>
              
              <div className="category-rates">
                {uniqueCategories.map(category => {
                  const categoryItem = currentBudget.items.find(item => item.category === category);
                  const isIncome = categoryItem && categoryItem.type === 'income';
                  
                  return (
                    <div key={category} className="category-rate-item">
                      <label>
                        <span className={`category-type ${isIncome ? 'income' : 'expense'}`}>
                          {isIncome ? 'Income' : 'Expense'}
                        </span>
                        {category}
                      </label>
                      <div className="rate-input">
                        <input
                          type="number"
                          value={categoryGrowthRates[category] !== undefined ? categoryGrowthRates[category] : (isIncome ? growthRate : expenseGrowthRate)}
                          onChange={(e) => handleCategoryRateChange(category, e.target.value)}
                          min={-50}
                          max={100}
                          step={0.5}
                        />
                        <span>%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button
                type="button"
                className="btn-reset-rates"
                onClick={handleResetCategoryRates}
              >
                <FontAwesomeIcon icon="undo" />
                Reset to Default Rates
              </button>
            </div>
          )}
          
          {forecastData && (
            <>
              <div className="forecast-summary">
                <div className="summary-card income">
                  <h3>Forecast Income</h3>
                  <div className="amount">{formatCurrency(forecastData.totals.income)}</div>
                  <div className="change">
                    {growthRate >= 0 ? '+' : ''}{growthRate}% from {formatCurrency(forecastData.currentTotals.incomeBudget)}
                  </div>
                </div>
                
                <div className="summary-card expenses">
                  <h3>Forecast Expenses</h3>
                  <div className="amount">{formatCurrency(forecastData.totals.expense)}</div>
                  <div className="change">
                    {expenseGrowthRate >= 0 ? '+' : ''}{expenseGrowthRate}% from {formatCurrency(forecastData.currentTotals.expenseBudget)}
                  </div>
                </div>
                
                <div className="summary-card balance">
                  <h3>Forecast Balance</h3>
                  <div className={`amount ${forecastData.totals.balance >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(forecastData.totals.balance)}
                  </div>
                  <div className="change">
                    {formatCurrency(forecastData.totals.balance - forecastData.currentTotals.balanceBudget)} change from current
                  </div>
                </div>
              </div>
              
              {trendData && (
                <div className="trend-chart">
                  <h3>3-Year Financial Trend</h3>
                  <Line
                    data={trendData}
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
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BudgetForecast;
