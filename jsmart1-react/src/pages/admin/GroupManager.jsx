import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/admin/DataManager.css';

const GroupManager = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Group categories for reference
  const groupCategories = [
    'Bible Study',
    'Prayer',
    'Worship',
    'Youth',
    'Children',
    'Men',
    'Women',
    'Seniors',
    'Outreach',
    'Missions',
    'Discipleship',
    'Leadership',
    'Other'
  ];

  // Placeholder data for initial development
  const dummyGroups = [
    {
      id: 1,
      name: 'Men\'s Fellowship',
      category: 'Men',
      leader: 'John Smith',
      meetingTime: 'Saturdays, 8:00 AM',
      memberCount: 15
    },
    {
      id: 2,
      name: 'Women\'s Bible Study',
      category: 'Women',
      leader: 'Mary Johnson',
      meetingTime: 'Wednesdays, 7:00 PM',
      memberCount: 20
    },
    {
      id: 3,
      name: 'Youth Group',
      category: 'Youth',
      leader: 'David Williams',
      meetingTime: 'Fridays, 6:30 PM',
      memberCount: 25
    }
  ];

  return (
    <AdminLayout>
      <div className="data-manager">
        <div className="manager-header">
          <h1>Group Manager</h1>
          <button type="button" className="btn btn-primary">
            <FontAwesomeIcon icon="plus" /> Add New Group
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            <FontAwesomeIcon icon="exclamation-circle" />
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="filters-container">
          <div className="search-box">
            <FontAwesomeIcon icon="search" />
            <input
              type="text"
              placeholder="Search groups..."
            />
          </div>

          <div className="filter-group">
            <label htmlFor="branchFilter">Branch:</label>
            <select id="branchFilter">
              <option value="">All Branches</option>
              <option value="1">Main Branch</option>
              <option value="2">North Campus</option>
              <option value="3">South Campus</option>
            </select>
          </div>
        </div>

        {/* Groups Table */}
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Leader</th>
                <th>Meeting Time</th>
                <th>Members</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyGroups.map(group => (
                <tr key={group.id}>
                  <td>{group.name}</td>
                  <td>{group.category}</td>
                  <td>{group.leader}</td>
                  <td>{group.meetingTime}</td>
                  <td>{group.memberCount}</td>
                  <td className="actions">
                    <button type="button" className="btn btn-sm btn-edit">
                      <FontAwesomeIcon icon="edit" /> Edit
                    </button>
                    <button type="button" className="btn btn-sm btn-view">
                      <FontAwesomeIcon icon="users" /> Members
                    </button>
                    <button type="button" className="btn btn-sm btn-delete">
                      <FontAwesomeIcon icon="trash-alt" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="info-message">
          <FontAwesomeIcon icon="info-circle" />
          <p>This is a placeholder view. The full functionality will be implemented in the next phase.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GroupManager;
