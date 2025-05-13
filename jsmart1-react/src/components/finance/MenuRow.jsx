import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './MenuRow.css';

const MenuRow = () => {
  return (
    <div className="finance-menu-row">
      <Link to="/finance/transactions" className="finance-menu-item">
        <FontAwesomeIcon icon="plus-circle" />
        <span>New Transaction</span>
      </Link>
      <Link to="/finance/reports" className="finance-menu-item">
        <FontAwesomeIcon icon="chart-bar" />
        <span>View Reports</span>
      </Link>
      <Link to="/finance/budget" className="finance-menu-item">
        <span style={{ fontWeight: 'bold', marginRight: '0.75rem' }}>Tsh</span>
        <span>Manage Budget</span>
      </Link>
    </div>
  );
};

export default MenuRow;
