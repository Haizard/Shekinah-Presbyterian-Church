import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import '../../styles/admin/DataManager.css';

const MemberManager = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    joinDate: new Date().toISOString().split('T')[0],
    baptismDate: '',
    membershipStatus: 'active',
    branchId: '',
    image: '',
    notes: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Membership status options
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'visitor', label: 'Visitor' },
    { value: 'transferred', label: 'Transferred' }
  ];

  // Fetch members and branches on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Check if we need to open the edit form (coming from MemberDetail page)
  useEffect(() => {
    if (location.state?.editMemberId && members.length > 0) {
      const memberToEdit = members.find(m => m._id === location.state.editMemberId);
      if (memberToEdit) {
        handleEdit(memberToEdit);
      }
    }
  }, [location.state, members]);

  // Fetch members and branches from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [membersData, branchesData] = await Promise.all([
        api.members.getAll(),
        api.branches.getAll()
      ]);

      setMembers(membersData);
      setBranches(branchesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to server
  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await api.upload.uploadFile(formData);
      return response.filePath;
    } catch (err) {
      console.error('Error uploading image:', err);
      return null;
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      joinDate: new Date().toISOString().split('T')[0],
      baptismDate: '',
      membershipStatus: 'active',
      branchId: '',
      image: '',
      notes: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setEditMode(false);
    setCurrentMember(null);
    setFormError(null);
    setFormSuccess(null);
  };

  // Open form for adding a new member
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Open form for editing an existing member
  const handleEdit = (member) => {
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email || '',
      phone: member.phone,
      address: member.address || '',
      dateOfBirth: member.dateOfBirth || '',
      joinDate: member.joinDate,
      baptismDate: member.baptismDate || '',
      membershipStatus: member.membershipStatus,
      branchId: member.branchId || '',
      image: member.image || '',
      notes: member.notes || ''
    });

    if (member.image) {
      setImagePreview(member.image.startsWith('http') ? member.image : `/${member.image}`);
    }

    setEditMode(true);
    setCurrentMember(member);
    setShowForm(true);
    setFormError(null);
    setFormSuccess(null);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (member) => {
    setConfirmDelete(member);
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // Delete member
  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      await api.members.delete(confirmDelete._id);
      fetchData();
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting member:', err);
      setError('Failed to delete member. Please try again.');
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setFormError(null);
      setFormSuccess(null);

      // Validate form
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.joinDate || !formData.membershipStatus) {
        setFormError('Please fill in all required fields.');
        return;
      }

      // Upload image if selected
      let imagePath = formData.image;
      if (imageFile) {
        imagePath = await uploadImage();
        if (!imagePath) {
          setFormError('Failed to upload image. Please try again.');
          return;
        }
      }

      const memberData = {
        ...formData,
        image: imagePath
      };

      if (editMode && currentMember) {
        // Update existing member
        await api.members.update(currentMember._id, memberData);
        setFormSuccess('Member updated successfully!');
      } else {
        // Create new member
        await api.members.create(memberData);
        setFormSuccess('Member created successfully!');
      }

      // Refresh data
      fetchData();

      // Reset form after a short delay
      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 2000);
    } catch (err) {
      console.error('Error saving member:', err);
      setFormError('Failed to save member. Please try again.');
    }
  };

  // Filter members based on search term and filters
  const filteredMembers = members.filter(member => {
    const matchesSearch = searchTerm === '' ||
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.phone && member.phone.includes(searchTerm));

    const matchesBranch = filterBranch === '' || member.branchId === filterBranch;
    const matchesStatus = filterStatus === '' || member.membershipStatus === filterStatus;

    return matchesSearch && matchesBranch && matchesStatus;
  });

  // Find branch name by ID
  const getBranchName = (branchId) => {
    if (!branchId) return 'N/A';
    const branch = branches.find(b => b._id === branchId);
    return branch ? branch.name : 'Unknown';
  };

  return (
    <AdminLayout>
      <div className="data-manager">
        <div className="manager-header">
          <h1>Member Manager</h1>
          <button type="button" className="btn btn-primary" onClick={handleAddNew}>
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
              {branches.map(branch => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
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
          {loading ? (
            <div className="loading-spinner">
              <FontAwesomeIcon icon="spinner" spin />
              <span>Loading members...</span>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="empty-state">
              <FontAwesomeIcon icon="users" />
              <p>No members found. Add your first member to get started.</p>
            </div>
          ) : (
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
                {filteredMembers.map(member => (
                  <tr key={member._id}>
                    <td>{member.firstName} {member.lastName}</td>
                    <td>{member.email || '-'}</td>
                    <td>{member.phone}</td>
                    <td>
                      <span className={`status-badge ${member.membershipStatus}`}>
                        {member.membershipStatus.charAt(0).toUpperCase() + member.membershipStatus.slice(1)}
                      </span>
                    </td>
                    <td>{formatDate(member.joinDate)}</td>
                    <td>{getBranchName(member.branchId)}</td>
                    <td className="actions">
                      <button
                        type="button"
                        className="btn btn-sm btn-edit"
                        onClick={() => handleEdit(member)}
                      >
                        <FontAwesomeIcon icon="edit" /> Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-view"
                        onClick={() => navigate(`/admin/members/${member._id}`)}
                      >
                        <FontAwesomeIcon icon="eye" /> View
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-delete"
                        onClick={() => handleDeleteConfirm(member)}
                      >
                        <FontAwesomeIcon icon="trash-alt" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Member Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editMode ? 'Edit Member' : 'Add New Member'}</h2>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {formError && (
                  <div className="alert alert-danger">
                    <FontAwesomeIcon icon="exclamation-circle" />
                    {formError}
                  </div>
                )}

                {formSuccess && (
                  <div className="alert alert-success">
                    <FontAwesomeIcon icon="check-circle" />
                    {formSuccess}
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="joinDate">Join Date *</label>
                    <input
                      type="date"
                      id="joinDate"
                      name="joinDate"
                      value={formData.joinDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="baptismDate">Baptism Date</label>
                    <input
                      type="date"
                      id="baptismDate"
                      name="baptismDate"
                      value={formData.baptismDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="membershipStatus">Membership Status *</label>
                    <select
                      id="membershipStatus"
                      name="membershipStatus"
                      value={formData.membershipStatus}
                      onChange={handleInputChange}
                      required
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="branchId">Branch</label>
                    <select
                      id="branchId"
                      name="branchId"
                      value={formData.branchId}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Branch</option>
                      {branches.map(branch => (
                        <option key={branch._id} value={branch._id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="image">Member Photo</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? 'Update Member' : 'Add Member'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="modal-overlay">
            <div className="modal-content confirm-dialog">
              <div className="modal-header">
                <h2>Confirm Delete</h2>
                <button
                  type="button"
                  className="close-btn"
                  onClick={handleCancelDelete}
                >
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>

              <div className="confirm-message">
                <FontAwesomeIcon icon="exclamation-triangle" />
                <p>Are you sure you want to delete <strong>{confirmDelete.firstName} {confirmDelete.lastName}</strong>? This action cannot be undone.</p>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MemberManager;
