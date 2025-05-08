import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import '../../styles/admin/DataManager.css';

const MinistryManager = () => {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMinistry, setCurrentMinistry] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image: '',
    leader: '',
    meetingTime: ''
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch ministries on component mount
  useEffect(() => {
    fetchMinistries();
  }, []);

  // Fetch ministries from API
  const fetchMinistries = async () => {
    try {
      setLoading(true);
      const data = await api.ministries.getAll();
      setMinistries(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching ministries:', err);
      setError('Failed to load ministries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      image: '',
      leader: '',
      meetingTime: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setEditMode(false);
    setCurrentMinistry(null);
    setFormError(null);
    setFormSuccess(null);
  };

  // Open form for creating a new ministry
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Open form for editing an existing ministry
  const handleEdit = (ministry) => {
    setFormData({
      title: ministry.title,
      category: ministry.category,
      description: ministry.description,
      image: ministry.image,
      leader: ministry.leader,
      meetingTime: ministry.meetingTime
    });
    setImagePreview(ministry.image);
    setEditMode(true);
    setCurrentMinistry(ministry);
    setShowForm(true);
    setFormError(null);
    setFormSuccess(null);
  };

  // Upload image file
  const uploadImage = async () => {
    if (!imageFile) return null;

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
      if (!formData.title || !formData.category || !formData.description || !formData.leader || !formData.meetingTime) {
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
      
      const ministryData = {
        ...formData,
        image: imagePath
      };
      
      if (editMode && currentMinistry) {
        // Update existing ministry
        await api.ministries.update(currentMinistry._id, ministryData);
        setFormSuccess('Ministry updated successfully!');
      } else {
        // Create new ministry
        await api.ministries.create(ministryData);
        setFormSuccess('Ministry created successfully!');
      }
      
      // Refresh ministries list
      fetchMinistries();
      
      // Reset form after a short delay
      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 2000);
      
    } catch (err) {
      console.error('Error saving ministry:', err);
      setFormError('Failed to save ministry. Please try again.');
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (ministry) => {
    setConfirmDelete(ministry);
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  // Delete ministry
  const handleDelete = async (id) => {
    try {
      await api.ministries.delete(id);
      setConfirmDelete(null);
      fetchMinistries();
    } catch (err) {
      console.error('Error deleting ministry:', err);
      setError('Failed to delete ministry. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <div className="data-manager">
        <div className="manager-header">
          <h1>Ministry Manager</h1>
          <button className="btn btn-primary" onClick={handleAddNew}>
            <FontAwesomeIcon icon="plus" /> Add New Ministry
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
            <p>Loading ministries...</p>
          </div>
        ) : (
          <>
            {ministries.length === 0 ? (
              <div className="no-data">
                <p>No ministries found. Click "Add New Ministry" to create one.</p>
              </div>
            ) : (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Leader</th>
                      <th>Meeting Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ministries.map(ministry => (
                      <tr key={ministry._id}>
                        <td>{ministry.title}</td>
                        <td>{ministry.category}</td>
                        <td>{ministry.leader}</td>
                        <td>{ministry.meetingTime}</td>
                        <td className="actions">
                          <button 
                            className="btn btn-sm btn-edit"
                            onClick={() => handleEdit(ministry)}
                          >
                            <FontAwesomeIcon icon="edit" /> Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-delete"
                            onClick={() => handleDeleteConfirm(ministry)}
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
        
        {/* Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editMode ? 'Edit Ministry' : 'Add New Ministry'}</h2>
                <button className="close-btn" onClick={() => setShowForm(false)}>
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>
              
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
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Title <span className="required">*</span></label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Category <span className="required">*</span></label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="worship">Worship</option>
                    <option value="children">Children</option>
                    <option value="youth">Youth</option>
                    <option value="adults">Adults</option>
                    <option value="outreach">Outreach</option>
                    <option value="discipleship">Discipleship</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description <span className="required">*</span></label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="image">Image</label>
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
                
                <div className="form-group">
                  <label htmlFor="leader">Leader <span className="required">*</span></label>
                  <input
                    type="text"
                    id="leader"
                    name="leader"
                    value={formData.leader}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="meetingTime">Meeting Time <span className="required">*</span></label>
                  <input
                    type="text"
                    id="meetingTime"
                    name="meetingTime"
                    value={formData.meetingTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? 'Update Ministry' : 'Create Ministry'}
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
              
              <div className="confirm-content">
                <p>Are you sure you want to delete the ministry <strong>{confirmDelete.title}</strong>?</p>
                <p className="warning">This action cannot be undone.</p>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleDeleteCancel}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={() => handleDelete(confirmDelete._id)}>
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

export default MinistryManager;
