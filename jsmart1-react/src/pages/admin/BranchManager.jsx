import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import '../../styles/admin/DataManager.css';

const BranchManager = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    pastor: '',
    contactInfo: '',
    establishedDate: '',
    memberCount: 0,
    description: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch branches from API
  const fetchBranches = async () => {
    try {
      setLoading(true);
      const data = await api.branches.getAll();
      setBranches(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError('Failed to load branches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'memberCount' ? parseInt(value, 10) || 0 : value
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

  // Get image URL helper
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return path;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      pastor: '',
      contactInfo: '',
      establishedDate: '',
      memberCount: 0,
      description: '',
      image: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setEditMode(false);
    setCurrentBranch(null);
    setFormError(null);
    setFormSuccess(null);
  };

  // Open form for creating a new branch
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Open form for editing an existing branch
  const handleEdit = (branch) => {
    setFormData({
      name: branch.name,
      location: branch.location,
      pastor: branch.pastor,
      contactInfo: branch.contactInfo,
      establishedDate: branch.establishedDate || '',
      memberCount: branch.memberCount || 0,
      description: branch.description || '',
      image: branch.image || ''
    });

    // Use the correct image URL for preview
    if (branch.image) {
      setImagePreview(getImageUrl(branch.image));
    } else {
      setImagePreview(null);
    }

    setEditMode(true);
    setCurrentBranch(branch);
    setShowForm(true);
    setFormError(null);
    setFormSuccess(null);
  };

  // Upload image file
  const uploadImage = async () => {
    if (!imageFile) return formData.image;

    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await api.upload.uploadFile(formData);
      return response.filePath;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new Error('Failed to upload image. Please try again.');
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setFormError(null);
      setFormSuccess(null);

      // Validate form
      if (!formData.name || !formData.location || !formData.pastor || !formData.contactInfo) {
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

      const branchData = {
        ...formData,
        image: imagePath
      };

      if (editMode && currentBranch) {
        // Update existing branch
        await api.branches.update(currentBranch._id, branchData);
        setFormSuccess('Branch updated successfully!');
      } else {
        // Create new branch
        await api.branches.create(branchData);
        setFormSuccess('Branch created successfully!');
      }

      // Refresh branches list
      fetchBranches();

      // Reset form after a short delay
      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 2000);

    } catch (err) {
      console.error('Error saving branch:', err);
      setFormError('Failed to save branch. Please try again.');
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (branch) => {
    setConfirmDelete(branch);
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  // Delete branch
  const handleDelete = async (id) => {
    try {
      await api.branches.delete(id);
      setConfirmDelete(null);
      fetchBranches();
    } catch (err) {
      console.error('Error deleting branch:', err);
      setError('Failed to delete branch. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <div className="data-manager">
        <div className="manager-header">
          <h1>Branch Manager</h1>
          <button className="btn btn-primary" onClick={handleAddNew}>
            <FontAwesomeIcon icon="plus" /> Add New Branch
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            <FontAwesomeIcon icon="exclamation-circle" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="spinner-large"></div>
            <p>Loading branches...</p>
          </div>
        ) : (
          <>
            {branches.length === 0 ? (
              <div className="no-data">
                <p>No branches found. Click "Add New Branch" to create one.</p>
              </div>
            ) : (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Location</th>
                      <th>Pastor</th>
                      <th>Contact Info</th>
                      <th>Members</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.map(branch => (
                      <tr key={branch._id}>
                        <td>{branch.name}</td>
                        <td>{branch.location}</td>
                        <td>{branch.pastor}</td>
                        <td>{branch.contactInfo}</td>
                        <td>{branch.memberCount || 0}</td>
                        <td className="actions">
                          <button
                            className="btn btn-sm btn-edit"
                            onClick={() => handleEdit(branch)}
                          >
                            <FontAwesomeIcon icon="edit" /> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-delete"
                            onClick={() => handleDeleteConfirm(branch)}
                          >
                            <FontAwesomeIcon icon="trash-alt" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Branch Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editMode ? 'Edit Branch' : 'Add New Branch'}</h2>
                <button className="close-btn" onClick={() => setShowForm(false)}>
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

                <div className="form-group">
                  <label htmlFor="name">Branch Name*</label>
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
                  <label htmlFor="location">Location*</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pastor">Pastor*</label>
                  <input
                    type="text"
                    id="pastor"
                    name="pastor"
                    value={formData.pastor}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contactInfo">Contact Information*</label>
                  <input
                    type="text"
                    id="contactInfo"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="establishedDate">Established Date</label>
                  <input
                    type="date"
                    id="establishedDate"
                    name="establishedDate"
                    value={formData.establishedDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="memberCount">Member Count</label>
                  <input
                    type="number"
                    id="memberCount"
                    name="memberCount"
                    value={formData.memberCount}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="image">Branch Image</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
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
                    {editMode ? 'Update Branch' : 'Create Branch'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="modal-overlay">
            <div className="modal-content confirm-modal">
              <div className="modal-header">
                <h2>Confirm Delete</h2>
                <button className="close-btn" onClick={handleDeleteCancel}>
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>
              <div className="confirm-message">
                <p>Are you sure you want to delete the branch "{confirmDelete.name}"?</p>
                <p className="warning">This action cannot be undone.</p>
              </div>
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={handleDeleteCancel}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete._id)}>
                  Delete Branch
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BranchManager;
