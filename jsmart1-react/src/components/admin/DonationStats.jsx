import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import api from '../../services/api';
import '../../styles/admin/DonationStats.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const DonationStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch donation statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const statsData = await api.donations.getStats();
        setStats(statsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching donation stats:', err);
        setError('Failed to load donation statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // Format currency
  const formatCurrency = (amount, currency = 'Tsh') => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  // Prepare data for category chart
  const getCategoryChartData = () => {
    if (!stats || !stats.donationsByCategory) return null;
    
    const labels = stats.donationsByCategory.map(item => item._id);
    const amounts = stats.donationsByCategory.map(item => item.amount);
    
    return {
      labels,
      datasets: [
        {
          label: 'Amount (Tsh)',
          data: amounts,
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare data for payment method chart
  const getPaymentMethodChartData = () => {
    if (!stats || !stats.donationsByPaymentMethod) return null;
    
    const labels = stats.donationsByPaymentMethod.map(item => {
      switch (item._id) {
        case 'mpesa': return 'M-Pesa';
        case 'tigopesa': return 'Tigo Pesa';
        case 'airtelmoney': return 'Airtel Money';
        case 'bank': return 'Bank Transfer';
        case 'card': return 'Credit Card';
        case 'cash': return 'Cash';
        default: return item._id;
      }
    });
    
    const counts = stats.donationsByPaymentMethod.map(item => item.count);
    
    return {
      labels,
      datasets: [
        {
          label: 'Number of Donations',
          data: counts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare data for recent donations chart
  const getRecentDonationsChartData = () => {
    if (!stats || !stats.recentDonations) return null;
    
    const labels = stats.recentDonations.map(item => format(new Date(item._id), 'MMM d'));
    const amounts = stats.recentDonations.map(item => item.amount);
    const counts = stats.recentDonations.map(item => item.count);
    
    return {
      labels,
      datasets: [
        {
          label: 'Amount (Tsh)',
          data: amounts,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          yAxisID: 'y',
          tension: 0.4,
        },
        {
          label: 'Number of Donations',
          data: counts,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          yAxisID: 'y1',
          tension: 0.4,
        },
      ],
    };
  };

  // Chart options
  const recentDonationsOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Amount (Tsh)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Number of Donations',
        },
      },
    },
  };

  return (
    <div className="donation-stats">
      {loading ? (
        <div className="loading">
          <FontAwesomeIcon icon="spinner" spin />
          <span>Loading statistics...</span>
        </div>
      ) : error ? (
        <div className="error-message">
          <FontAwesomeIcon icon="exclamation-circle" />
          <span>{error}</span>
        </div>
      ) : stats ? (
        <>
          <div className="stats-tabs">
            <button 
              className={activeTab === 'overview' ? 'active' : ''} 
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={activeTab === 'categories' ? 'active' : ''} 
              onClick={() => setActiveTab('categories')}
            >
              Categories
            </button>
            <button 
              className={activeTab === 'payment-methods' ? 'active' : ''} 
              onClick={() => setActiveTab('payment-methods')}
            >
              Payment Methods
            </button>
            <button 
              className={activeTab === 'trends' ? 'active' : ''} 
              onClick={() => setActiveTab('trends')}
            >
              Recent Trends
            </button>
          </div>
          
          {activeTab === 'overview' && (
            <div className="stats-overview">
              <div className="stats-cards">
                <div className="stats-card">
                  <div className="stats-icon">
                    <FontAwesomeIcon icon="donate" />
                  </div>
                  <div className="stats-info">
                    <h3>Total Donations</h3>
                    <p className="stats-value">{stats.totalDonations}</p>
                  </div>
                </div>
                
                <div className="stats-card">
                  <div className="stats-icon">
                    <FontAwesomeIcon icon="money-bill-wave" />
                  </div>
                  <div className="stats-info">
                    <h3>Total Amount</h3>
                    <p className="stats-value">{formatCurrency(stats.totalAmount)}</p>
                  </div>
                </div>
                
                <div className="stats-card">
                  <div className="stats-icon">
                    <FontAwesomeIcon icon="chart-line" />
                  </div>
                  <div className="stats-info">
                    <h3>Average Donation</h3>
                    <p className="stats-value">
                      {formatCurrency(stats.totalDonations > 0 
                        ? stats.totalAmount / stats.totalDonations 
                        : 0
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="stats-card">
                  <div className="stats-icon">
                    <FontAwesomeIcon icon="calendar-alt" />
                  </div>
                  <div className="stats-info">
                    <h3>Recent Donations</h3>
                    <p className="stats-value">
                      {stats.recentDonations?.reduce((sum, item) => sum + item.count, 0) || 0}
                      <span className="stats-subtitle">Last 30 days</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="stats-charts">
                <div className="chart-container">
                  <h3>Donations by Category</h3>
                  {getCategoryChartData() && (
                    <Pie data={getCategoryChartData()} />
                  )}
                </div>
                
                <div className="chart-container">
                  <h3>Recent Donation Trends</h3>
                  {getRecentDonationsChartData() && (
                    <Line 
                      data={getRecentDonationsChartData()} 
                      options={recentDonationsOptions} 
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'categories' && (
            <div className="stats-categories">
              <div className="chart-container large">
                <h3>Donations by Category</h3>
                {getCategoryChartData() && (
                  <Bar 
                    data={getCategoryChartData()} 
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: 'Donation Amount by Category',
                        },
                      },
                    }} 
                  />
                )}
              </div>
              
              <div className="category-details">
                <h3>Category Details</h3>
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Count</th>
                      <th>Total Amount</th>
                      <th>Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.donationsByCategory?.map(category => (
                      <tr key={category._id}>
                        <td>{category._id}</td>
                        <td>{category.count}</td>
                        <td>{formatCurrency(category.amount)}</td>
                        <td>
                          {formatCurrency(category.count > 0 
                            ? category.amount / category.count 
                            : 0
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'payment-methods' && (
            <div className="stats-payment-methods">
              <div className="chart-container">
                <h3>Donations by Payment Method</h3>
                {getPaymentMethodChartData() && (
                  <Pie data={getPaymentMethodChartData()} />
                )}
              </div>
              
              <div className="payment-method-details">
                <h3>Payment Method Details</h3>
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th>Payment Method</th>
                      <th>Count</th>
                      <th>Total Amount</th>
                      <th>Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.donationsByPaymentMethod?.map(method => (
                      <tr key={method._id}>
                        <td>
                          {method._id === 'mpesa' && 'M-Pesa'}
                          {method._id === 'tigopesa' && 'Tigo Pesa'}
                          {method._id === 'airtelmoney' && 'Airtel Money'}
                          {method._id === 'bank' && 'Bank Transfer'}
                          {method._id === 'card' && 'Credit Card'}
                          {method._id === 'cash' && 'Cash'}
                          {!['mpesa', 'tigopesa', 'airtelmoney', 'bank', 'card', 'cash'].includes(method._id) && method._id}
                        </td>
                        <td>{method.count}</td>
                        <td>{formatCurrency(method.amount)}</td>
                        <td>
                          {formatCurrency(method.count > 0 
                            ? method.amount / method.count 
                            : 0
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'trends' && (
            <div className="stats-trends">
              <div className="chart-container large">
                <h3>Recent Donation Trends (Last 30 Days)</h3>
                {getRecentDonationsChartData() && (
                  <Line 
                    data={getRecentDonationsChartData()} 
                    options={recentDonationsOptions} 
                  />
                )}
              </div>
              
              <div className="trends-details">
                <h3>Daily Donation Details</h3>
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Count</th>
                      <th>Total Amount</th>
                      <th>Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentDonations?.map(day => (
                      <tr key={day._id}>
                        <td>{format(new Date(day._id), 'MMM d, yyyy')}</td>
                        <td>{day.count}</td>
                        <td>{formatCurrency(day.amount)}</td>
                        <td>
                          {formatCurrency(day.count > 0 
                            ? day.amount / day.count 
                            : 0
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <FontAwesomeIcon icon="chart-bar" size="3x" />
          <h3>No statistics available</h3>
          <p>There are no donation statistics to display.</p>
        </div>
      )}
    </div>
  );
};

export default DonationStats;
