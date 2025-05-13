import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/finance/BudgetInsights.css';

const BudgetInsights = ({ currentBudget, previousBudget, currentTotals, previousTotals }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Calculate percentage change
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 1 : 0;
    return (current - previous) / Math.abs(previous);
  };

  // Generate insights based on budget data
  const generateInsights = () => {
    const insights = [];
    
    // Only generate insights if we have current budget data
    if (!currentBudget || !currentBudget.items || currentBudget.items.length === 0) {
      return [
        {
          type: 'info',
          title: 'No Budget Data',
          message: 'Create a budget to see automated insights and analysis.',
          icon: 'info-circle'
        }
      ];
    }

    // Check if budget is balanced
    const balanceRatio = currentTotals.balanceBudget / currentTotals.incomeBudget;
    if (balanceRatio < 0) {
      insights.push({
        type: 'warning',
        title: 'Budget Deficit',
        message: `Your budget shows a deficit of ${formatCurrency(Math.abs(currentTotals.balanceBudget))}, which means expenses exceed income.`,
        icon: 'exclamation-triangle'
      });
    } else if (balanceRatio < 0.1) {
      insights.push({
        type: 'info',
        title: 'Low Budget Surplus',
        message: `Your budget has a small surplus of ${formatCurrency(currentTotals.balanceBudget)}, which is ${formatPercentage(balanceRatio)} of your income.`,
        icon: 'info-circle'
      });
    } else if (balanceRatio > 0.3) {
      insights.push({
        type: 'success',
        title: 'Healthy Budget Surplus',
        message: `Your budget has a healthy surplus of ${formatCurrency(currentTotals.balanceBudget)}, which is ${formatPercentage(balanceRatio)} of your income.`,
        icon: 'check-circle'
      });
    }

    // Check actual vs budget performance
    const incomePerformance = currentTotals.incomeActual / currentTotals.incomeBudget;
    const expensePerformance = currentTotals.expenseActual / currentTotals.expenseBudget;

    if (incomePerformance < 0.9) {
      insights.push({
        type: 'warning',
        title: 'Income Below Budget',
        message: `Actual income is ${formatPercentage(incomePerformance)} of budgeted income, which is ${formatCurrency(currentTotals.incomeBudget - currentTotals.incomeActual)} below target.`,
        icon: 'arrow-down'
      });
    } else if (incomePerformance > 1.1) {
      insights.push({
        type: 'success',
        title: 'Income Exceeds Budget',
        message: `Actual income is ${formatPercentage(incomePerformance)} of budgeted income, which is ${formatCurrency(currentTotals.incomeActual - currentTotals.incomeBudget)} above target.`,
        icon: 'arrow-up'
      });
    }

    if (expensePerformance > 1.1) {
      insights.push({
        type: 'warning',
        title: 'Expenses Exceed Budget',
        message: `Actual expenses are ${formatPercentage(expensePerformance)} of budgeted expenses, which is ${formatCurrency(currentTotals.expenseActual - currentTotals.expenseBudget)} over budget.`,
        icon: 'arrow-up'
      });
    } else if (expensePerformance < 0.9) {
      insights.push({
        type: 'success',
        title: 'Expenses Below Budget',
        message: `Actual expenses are ${formatPercentage(expensePerformance)} of budgeted expenses, which is ${formatCurrency(currentTotals.expenseBudget - currentTotals.expenseActual)} under budget.`,
        icon: 'arrow-down'
      });
    }

    // Identify categories with significant variances
    if (currentBudget && currentBudget.items) {
      const significantVariances = currentBudget.items
        .filter(item => {
          const variance = Math.abs(item.actual - item.amount);
          const varianceRatio = variance / item.amount;
          return varianceRatio > 0.2 && variance > 1000; // 20% variance and at least $1000
        })
        .sort((a, b) => Math.abs(b.actual - b.amount) - Math.abs(a.actual - a.amount))
        .slice(0, 3); // Top 3 variances

      significantVariances.forEach(item => {
        const variance = item.actual - item.amount;
        const varianceRatio = variance / item.amount;
        const isIncome = item.type === 'income';
        const isPositive = (isIncome && variance > 0) || (!isIncome && variance < 0);
        
        insights.push({
          type: isPositive ? 'success' : 'warning',
          title: `Significant ${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Variance: ${item.category}`,
          message: `${isPositive ? 'Positive' : 'Negative'} variance of ${formatCurrency(Math.abs(variance))} (${formatPercentage(Math.abs(varianceRatio))}) for ${item.category}.`,
          icon: isPositive ? 'thumbs-up' : 'thumbs-down'
        });
      });
    }

    // Year-over-year insights
    if (previousBudget && previousTotals) {
      const incomeChange = calculatePercentageChange(currentTotals.incomeActual, previousTotals.incomeActual);
      const expenseChange = calculatePercentageChange(currentTotals.expenseActual, previousTotals.expenseActual);
      const balanceChange = currentTotals.balanceActual - previousTotals.balanceActual;
      
      if (Math.abs(incomeChange) > 0.1) { // 10% change
        insights.push({
          type: incomeChange > 0 ? 'success' : 'warning',
          title: `Income ${incomeChange > 0 ? 'Growth' : 'Decline'} Year-over-Year`,
          message: `Income has ${incomeChange > 0 ? 'increased' : 'decreased'} by ${formatPercentage(Math.abs(incomeChange))} compared to the previous year.`,
          icon: incomeChange > 0 ? 'chart-line' : 'chart-line-down'
        });
      }
      
      if (Math.abs(expenseChange) > 0.1) { // 10% change
        insights.push({
          type: expenseChange < 0 ? 'success' : 'warning',
          title: `Expense ${expenseChange > 0 ? 'Increase' : 'Reduction'} Year-over-Year`,
          message: `Expenses have ${expenseChange > 0 ? 'increased' : 'decreased'} by ${formatPercentage(Math.abs(expenseChange))} compared to the previous year.`,
          icon: expenseChange > 0 ? 'chart-line' : 'chart-line-down'
        });
      }
      
      if (Math.abs(balanceChange) > 5000) { // $5000 change
        insights.push({
          type: balanceChange > 0 ? 'success' : 'warning',
          title: `Balance ${balanceChange > 0 ? 'Improvement' : 'Deterioration'} Year-over-Year`,
          message: `The net balance has ${balanceChange > 0 ? 'improved' : 'deteriorated'} by ${formatCurrency(Math.abs(balanceChange))} compared to the previous year.`,
          icon: balanceChange > 0 ? 'trending-up' : 'trending-down'
        });
      }
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="budget-insights">
      <h2>
        <FontAwesomeIcon icon="lightbulb" className="insight-icon" />
        Automated Insights
      </h2>
      
      <div className="insights-container">
        {insights.map((insight, index) => (
          <div key={index} className={`insight-card ${insight.type}`}>
            <div className="insight-icon">
              <FontAwesomeIcon icon={insight.icon} />
            </div>
            <div className="insight-content">
              <h3>{insight.title}</h3>
              <p>{insight.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetInsights;
