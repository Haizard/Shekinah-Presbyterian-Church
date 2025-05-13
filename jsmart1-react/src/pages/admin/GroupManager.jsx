import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import '../../styles/admin/DataManager.css';

const GroupManager = () => {
  const [groups, setGroups] = useState([]);
  const [branches, setBranches] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    leader: '',
    meetingTime: '',
    meetingLocation: '',
    branchId: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [showEditMemberForm, setShowEditMemberForm] = useState(false);
  const [currentGroupMember, setCurrentGroupMember] = useState(null);
  const [memberFormData, setMemberFormData] = useState({
    memberId: '',
    role: 'member',
    joinDate: new Date().toISOString().split('T')[0]
  });
  const [memberFormError, setMemberFormError] = useState(null);
  const [memberFormSuccess, setMemberFormSuccess] = useState(null);
  const [confirmRemoveMember, setConfirmRemoveMember] = useState(null);

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

  // Member role options
  const memberRoleOptions = [
    { value: 'leader', label: 'Leader' },
    { value: 'assistant', label: 'Assistant' },
    { value: 'member', label: 'Member' }
  ];

  // Fetch groups, branches, and members on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [groupsData, branchesData, membersData] = await Promise.all([
        api.groups.getAll(),
        api.branches.getAll(),
        api.members.getAll()
      ]);

      setGroups(groupsData);
      setBranches(branchesData);
      setMembers(membersData);
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

  // Handle category filter change
  const handleCategoryFilterChange = (e) => {
    setFilterCategory(e.target.value);
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
      name: '',
      category: '',
      description: '',
      leader: '',
      meetingTime: '',
      meetingLocation: '',
      branchId: '',
      image: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setEditMode(false);
    setCurrentGroup(null);
    setFormError(null);
    setFormSuccess(null);
  };

  // Open form for adding a new group
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Open form for editing an existing group
  const handleEdit = (group) => {
    setFormData({
      name: group.name,
      category: group.category,
      description: group.description || '',
      leader: group.leader,
      meetingTime: group.meetingTime || '',
      meetingLocation: group.meetingLocation || '',
      branchId: group.branchId || '',
      image: group.image || ''
    });

    if (group.image) {
      setImagePreview(group.image.startsWith('http') ? group.image : `/${group.image}`);
    }

    setEditMode(true);
    setCurrentGroup(group);
    setShowForm(true);
    setFormError(null);
    setFormSuccess(null);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (group) => {
    setConfirmDelete(group);
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // Delete group
  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      await api.groups.delete(confirmDelete._id);
      fetchData();
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting group:', err);
      setError('Failed to delete group. Please try again.');
    }
  };

  // View group members
  const handleViewMembers = async (group) => {
    try {
      setLoading(true);
      const membersData = await api.groups.getMembers(group._id);
      setGroupMembers(membersData);
      setSelectedGroup(group);
      setShowMembers(true);
      setError(null);
    } catch (err) {
      console.error('Error fetching group members:', err);
      setError('Failed to load group members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Close members modal
  const handleCloseMembers = () => {
    setShowMembers(false);
    setSelectedGroup(null);
    setGroupMembers([]);
    setShowAddMemberForm(false);
    setShowEditMemberForm(false);
    setCurrentGroupMember(null);
    resetMemberForm();
  };

  // Reset member form
  const resetMemberForm = () => {
    setMemberFormData({
      memberId: '',
      role: 'member',
      joinDate: new Date().toISOString().split('T')[0]
    });
    setMemberFormError(null);
    setMemberFormSuccess(null);
  };

  // Open form for adding a new member to the group
  const handleAddMember = () => {
    resetMemberForm();
    setShowAddMemberForm(true);
    setShowEditMemberForm(false);
  };

  // Open form for editing a member's role in the group
  const handleEditMember = (groupMember) => {
    setMemberFormData({
      memberId: groupMember.memberId._id,
      role: groupMember.role,
      joinDate: groupMember.joinDate
    });
    setCurrentGroupMember(groupMember);
    setShowEditMemberForm(true);
    setShowAddMemberForm(false);
    setMemberFormError(null);
    setMemberFormSuccess(null);
  };

  // Handle member form input changes
  const handleMemberInputChange = (e) => {
    const { name, value } = e.target;
    setMemberFormData({
      ...memberFormData,
      [name]: value
    });
  };

  // Submit add member form
  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();

    try {
      setMemberFormError(null);
      setMemberFormSuccess(null);

      // Validate form
      if (!memberFormData.memberId || !memberFormData.role || !memberFormData.joinDate) {
        setMemberFormError('Please fill in all required fields.');
        return;
      }

      // Add member to group
      await api.groups.addMember(selectedGroup._id, memberFormData);
      setMemberFormSuccess('Member added to group successfully!');

      // Refresh group members
      const membersData = await api.groups.getMembers(selectedGroup._id);
      setGroupMembers(membersData);

      // Reset form after a short delay
      setTimeout(() => {
        setShowAddMemberForm(false);
        resetMemberForm();
      }, 2000);
    } catch (err) {
      console.error('Error adding member to group:', err);
      setMemberFormError(err.message || 'Failed to add member to group. Please try again.');
    }
  };

  // Submit edit member form
  const handleEditMemberSubmit = async (e) => {
    e.preventDefault();

    try {
      setMemberFormError(null);
      setMemberFormSuccess(null);

      // Validate form
      if (!memberFormData.role || !memberFormData.joinDate) {
        setMemberFormError('Please fill in all required fields.');
        return;
      }

      // Update member in group
      await api.groups.updateMember(currentGroupMember._id, {
        role: memberFormData.role,
        joinDate: memberFormData.joinDate
      });
      setMemberFormSuccess('Member updated successfully!');

      // Refresh group members
      const membersData = await api.groups.getMembers(selectedGroup._id);
      setGroupMembers(membersData);

      // Reset form after a short delay
      setTimeout(() => {
        setShowEditMemberForm(false);
        setCurrentGroupMember(null);
        resetMemberForm();
      }, 2000);
    } catch (err) {
      console.error('Error updating group member:', err);
      setMemberFormError('Failed to update member. Please try again.');
    }
  };

  // Handle remove member confirmation
  const handleRemoveMemberConfirm = (groupMember) => {
    setConfirmRemoveMember(groupMember);
  };

  // Cancel remove member
  const handleCancelRemoveMember = () => {
    setConfirmRemoveMember(null);
  };

  // Remove member from group
  const handleRemoveMember = async () => {
    if (!confirmRemoveMember) return;

    try {
      await api.groups.removeMember(confirmRemoveMember._id);

      // Refresh group members
      const membersData = await api.groups.getMembers(selectedGroup._id);
      setGroupMembers(membersData);

      setConfirmRemoveMember(null);
    } catch (err) {
      console.error('Error removing member from group:', err);
      setError('Failed to remove member from group. Please try again.');
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setFormError(null);
      setFormSuccess(null);

      // Validate form
      if (!formData.name || !formData.category || !formData.leader) {
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

      const groupData = {
        ...formData,
        image: imagePath
      };

      if (editMode && currentGroup) {
        // Update existing group
        await api.groups.update(currentGroup._id, groupData);
        setFormSuccess('Group updated successfully!');
      } else {
        // Create new group
        await api.groups.create(groupData);
        setFormSuccess('Group created successfully!');
      }

      // Refresh data
      fetchData();

      // Reset form after a short delay
      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 2000);
    } catch (err) {
      console.error('Error saving group:', err);
      setFormError('Failed to save group. Please try again.');
    }
  };

  // Filter groups based on search term and filters
  const filteredGroups = groups.filter(group => {
    const matchesSearch = searchTerm === '' ||
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.leader.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch = filterBranch === '' || group.branchId === filterBranch;
    const matchesCategory = filterCategory === '' || group.category === filterCategory;

    return matchesSearch && matchesBranch && matchesCategory;
  });

  // Find branch name by ID
  const getBranchName = (branchId) => {
    if (!branchId) return 'N/A';
    const branch = branches.find(b => b._id === branchId);
    return branch ? branch.name : 'Unknown';
  };

  // Count group members
  const getGroupMemberCount = (groupId) => {
    // This would normally be fetched from the API, but for now we'll return a placeholder
    return Math.floor(Math.random() * 20) + 5; // Random number between 5 and 25
  };

  return (
    <AdminLayout>
      <div className="data-manager">
        <div className="manager-header">
          <h1>Group Manager</h1>
          <button type="button" className="btn btn-primary" onClick={handleAddNew}>
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
            <label htmlFor="categoryFilter">Category:</label>
            <select
              id="categoryFilter"
              value={filterCategory}
              onChange={handleCategoryFilterChange}
            >
              <option value="">All Categories</option>
              {groupCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Groups Table */}
        <div className="data-table-container">
          {loading ? (
            <div className="loading-spinner">
              <FontAwesomeIcon icon="spinner" spin />
              <span>Loading groups...</span>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="empty-state">
              <FontAwesomeIcon icon="users" />
              <p>No groups found. Add your first group to get started.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Leader</th>
                  <th>Meeting Time</th>
                  <th>Branch</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGroups.map(group => (
                  <tr key={group._id}>
                    <td>{group.name}</td>
                    <td>{group.category}</td>
                    <td>{group.leader}</td>
                    <td>{group.meetingTime || 'Not specified'}</td>
                    <td>{getBranchName(group.branchId)}</td>
                    <td className="actions">
                      <button
                        type="button"
                        className="btn btn-sm btn-edit"
                        onClick={() => handleEdit(group)}
                      >
                        <FontAwesomeIcon icon="edit" /> Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-view"
                        onClick={() => handleViewMembers(group)}
                      >
                        <FontAwesomeIcon icon="users" /> Members
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-delete"
                        onClick={() => handleDeleteConfirm(group)}
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

        {/* Group Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editMode ? 'Edit Group' : 'Add New Group'}</h2>
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
                    <label htmlFor="name">Group Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {groupCategories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="leader">Group Leader *</label>
                    <input
                      type="text"
                      id="leader"
                      name="leader"
                      value={formData.leader}
                      onChange={handleInputChange}
                      required
                    />
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

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="meetingTime">Meeting Time</label>
                    <input
                      type="text"
                      id="meetingTime"
                      name="meetingTime"
                      value={formData.meetingTime}
                      onChange={handleInputChange}
                      placeholder="e.g., Sundays, 9:00 AM"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="meetingLocation">Meeting Location</label>
                    <input
                      type="text"
                      id="meetingLocation"
                      name="meetingLocation"
                      value={formData.meetingLocation}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="image">Group Image</label>
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

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? 'Update Group' : 'Add Group'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Group Members Modal */}
        {showMembers && selectedGroup && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{selectedGroup.name} - Members</h2>
                <button
                  type="button"
                  className="close-btn"
                  onClick={handleCloseMembers}
                >
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>

              <div className="group-members-container">
                {loading ? (
                  <div className="loading-spinner">
                    <FontAwesomeIcon icon="spinner" spin />
                    <span>Loading members...</span>
                  </div>
                ) : groupMembers.length === 0 ? (
                  <div className="empty-state">
                    <FontAwesomeIcon icon="users" />
                    <p>No members in this group yet.</p>
                    <button type="button" className="btn btn-primary" onClick={handleAddMember}>
                      <FontAwesomeIcon icon="plus" /> Add Members
                    </button>
                  </div>
                ) : (
                  <div className="members-list">
                    <div className="members-header">
                      <h3>Group Members</h3>
                      <button type="button" className="btn btn-primary" onClick={handleAddMember}>
                        <FontAwesomeIcon icon="plus" /> Add Member
                      </button>
                    </div>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Join Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupMembers.map(member => (
                          <tr key={member._id}>
                            <td>{member.memberId.firstName} {member.memberId.lastName}</td>
                            <td>
                              <span className={`role-badge ${member.role}`}>
                                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                              </span>
                            </td>
                            <td>{new Date(member.joinDate).toLocaleDateString()}</td>
                            <td className="actions">
                              <button
                                type="button"
                                className="btn btn-sm btn-edit"
                                onClick={() => handleEditMember(member)}
                              >
                                <FontAwesomeIcon icon="edit" /> Edit
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-delete"
                                onClick={() => handleRemoveMemberConfirm(member)}
                              >
                                <FontAwesomeIcon icon="trash-alt" /> Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Add Member Form */}
                {showAddMemberForm && (
                  <div className="member-form-container">
                    <h3>Add Member to Group</h3>

                    {memberFormError && (
                      <div className="alert alert-danger">
                        <FontAwesomeIcon icon="exclamation-circle" />
                        {memberFormError}
                      </div>
                    )}

                    {memberFormSuccess && (
                      <div className="alert alert-success">
                        <FontAwesomeIcon icon="check-circle" />
                        {memberFormSuccess}
                      </div>
                    )}

                    <form onSubmit={handleAddMemberSubmit}>
                      <div className="form-group">
                        <label htmlFor="memberId">Select Member *</label>
                        <select
                          id="memberId"
                          name="memberId"
                          value={memberFormData.memberId}
                          onChange={handleMemberInputChange}
                          required
                        >
                          <option value="">Select a Member</option>
                          {members
                            .filter(member => !groupMembers.some(gm => gm.memberId._id === member._id))
                            .map(member => (
                              <option key={member._id} value={member._id}>
                                {member.firstName} {member.lastName}
                              </option>
                            ))
                          }
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="role">Role in Group *</label>
                        <select
                          id="role"
                          name="role"
                          value={memberFormData.role}
                          onChange={handleMemberInputChange}
                          required
                        >
                          {memberRoleOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="joinDate">Join Date *</label>
                        <input
                          type="date"
                          id="joinDate"
                          name="joinDate"
                          value={memberFormData.joinDate}
                          onChange={handleMemberInputChange}
                          required
                        />
                      </div>

                      <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowAddMemberForm(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Add to Group
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Edit Member Form */}
                {showEditMemberForm && currentGroupMember && (
                  <div className="member-form-container">
                    <h3>Edit Member Role</h3>

                    {memberFormError && (
                      <div className="alert alert-danger">
                        <FontAwesomeIcon icon="exclamation-circle" />
                        {memberFormError}
                      </div>
                    )}

                    {memberFormSuccess && (
                      <div className="alert alert-success">
                        <FontAwesomeIcon icon="check-circle" />
                        {memberFormSuccess}
                      </div>
                    )}

                    <form onSubmit={handleEditMemberSubmit}>
                      <div className="form-group">
                        <label>Member</label>
                        <div className="member-display">
                          {currentGroupMember.memberId.firstName} {currentGroupMember.memberId.lastName}
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="role">Role in Group *</label>
                        <select
                          id="role"
                          name="role"
                          value={memberFormData.role}
                          onChange={handleMemberInputChange}
                          required
                        >
                          {memberRoleOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="joinDate">Join Date *</label>
                        <input
                          type="date"
                          id="joinDate"
                          name="joinDate"
                          value={memberFormData.joinDate}
                          onChange={handleMemberInputChange}
                          required
                        />
                      </div>

                      <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowEditMemberForm(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Update Member
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Group Confirmation Modal */}
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
                <p>Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.</p>
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

        {/* Remove Member Confirmation Modal */}
        {confirmRemoveMember && (
          <div className="modal-overlay">
            <div className="modal-content confirm-dialog">
              <div className="modal-header">
                <h2>Confirm Remove Member</h2>
                <button
                  type="button"
                  className="close-btn"
                  onClick={handleCancelRemoveMember}
                >
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>

              <div className="confirm-message">
                <FontAwesomeIcon icon="exclamation-triangle" />
                <p>Are you sure you want to remove <strong>{confirmRemoveMember.memberId.firstName} {confirmRemoveMember.memberId.lastName}</strong> from this group?</p>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCancelRemoveMember}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleRemoveMember}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default GroupManager;
