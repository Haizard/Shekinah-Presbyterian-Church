import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/admin/DataManager.css';

const MemberManager = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Membership status options
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'visitor', label: 'Visitor' },
    { value: 'transferred', label: 'Transferred' }
  ];

  // Placeholder data for initial development
  const dummyMembers = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      membershipStatus: 'active',
      joinDate: '2020-01-15',
      branch: 'Main Branch'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '(555) 987-6543',
      membershipStatus: 'active',
      joinDate: '2021-03-22',
      branch: 'North Campus'
    },
    {
      id: 3,
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.johnson@example.com',
      phone: '(555) 456-7890',
      membershipStatus: 'inactive',
      joinDate: '2019-07-10',
      branch: 'Main Branch'
    }
  ];

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle branch filter change
  const handleBranchFilterChange = (e) => {
    setFilterBranch(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <AdminLayout>
      <div className="data-manager">
        <div className="manager-header">
          <h1>Member Manager</h1>
          <button type="button" className="btn btn-primary">
            <FontAwesomeIcon icon="plus" /> Add New Member
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
              placeholder="Search members..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="branchFilter">Branch:</label>
            <select
              id="branchFilter"
              value={filterBranch}
              onChange={handleBranchFilterChange}
            >
              <option value="">All Branches</option>
              <option value="1">Main Branch</option>
              <option value="2">North Campus</option>
              <option value="3">South Campus</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="statusFilter">Status:</label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={handleStatusFilterChange}
            >
              <option value="">All Statuses</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Members Table */}
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Branch</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyMembers.map(member => (
                <tr key={member.id}>
                  <td>{member.firstName} {member.lastName}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td>
                    <span className={`status-badge ${member.membershipStatus}`}>
                      {member.membershipStatus.charAt(0).toUpperCase() + member.membershipStatus.slice(1)}
                    </span>
                  </td>
                  <td>{formatDate(member.joinDate)}</td>
                  <td>{member.branch}</td>
                  <td className="actions">
                    <button type="button" className="btn btn-sm btn-edit">
                      <FontAwesomeIcon icon="edit" /> Edit
                    </button>
                    <button type="button" className="btn btn-sm btn-view">
                      <FontAwesomeIcon icon="eye" /> View
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

export default MemberManager;
