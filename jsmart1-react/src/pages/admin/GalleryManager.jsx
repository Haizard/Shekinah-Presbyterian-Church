import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import '../../styles/admin/DataManager.css';

const GalleryManager = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    description: '',
    image: ''
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch gallery items on component mount
  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Fetch gallery items from API
  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const data = await api.gallery.getAll();
      setGalleryItems(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching gallery items:', err);
      setError('Failed to load gallery items. Please try again.');
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
      date: '',
      description: '',
      image: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setEditMode(false);
    setCurrentItem(null);
    setFormError(null);
    setFormSuccess(null);
  };

  // Open form for creating a new gallery item
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Open form for editing an existing gallery item
  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      category: item.category,
      date: item.date,
      description: item.description || '',
      image: item.image
    });
    setImagePreview(item.image);
    setEditMode(true);
    setCurrentItem(item);
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
      if (!formData.title || !formData.category || !formData.date) {
        setFormError('Please fill in all required fields.');
        return;
      }
      
      // Validate image
      if (!formData.image && !imageFile) {
        setFormError('Please select an image.');
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
      
      const galleryData = {
        ...formData,
        image: imagePath
      };
      
      if (editMode && currentItem) {
        // Update existing gallery item
        await api.gallery.update(currentItem._id, galleryData);
        setFormSuccess('Gallery item updated successfully!');
      } else {
        // Create new gallery item
        await api.gallery.create(galleryData);
        setFormSuccess('Gallery item created successfully!');
      }
      
      // Refresh gallery items list
      fetchGalleryItems();
      
      // Reset form after a short delay
      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 2000);
      
    } catch (err) {
      console.error('Error saving gallery item:', err);
      setFormError('Failed to save gallery item. Please try again.');
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (item) => {
    setConfirmDelete(item);
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  // Delete gallery item
  const handleDelete = async (id) => {
    try {
      await api.gallery.delete(id);
      setConfirmDelete(null);
      fetchGalleryItems();
    } catch (err) {
      console.error('Error deleting gallery item:', err);
      setError('Failed to delete gallery item. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <div className="data-manager">
        <div className="manager-header">
          <h1>Gallery Manager</h1>
          <button className="btn btn-primary" onClick={handleAddNew}>
            <FontAwesomeIcon icon="plus" /> Add New Image
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
            <p>Loading gallery items...</p>
          </div>
        ) : (
          <>
            {galleryItems.length === 0 ? (
              <div className="no-data">
                <p>No gallery items found. Click "Add New Image" to create one.</p>
              </div>
            ) : (
              <div className="gallery-grid">
                {galleryItems.map(item => (
                  <div key={item._id} className="gallery-item">
                    <div className="gallery-image">
                      <img src={item.image} alt={item.title} />
                      <div className="gallery-overlay">
                        <div className="gallery-actions">
                          <button 
                            className="btn btn-sm btn-edit"
                            onClick={() => handleEdit(item)}
                          >
                            <FontAwesomeIcon icon="edit" /> Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-delete"
                            onClick={() => handleDeleteConfirm(item)}
                          >
                            <FontAwesomeIcon icon="trash-alt" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="gallery-info">
                      <h3>{item.title}</h3>
                      <p className="gallery-category">{item.category}</p>
                      <p className="gallery-date">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editMode ? 'Edit Gallery Item' : 'Add New Gallery Item'}</h2>
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
                
                <div className="form-row">
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
                      <option value="events">Events</option>
                      <option value="outreach">Outreach</option>
                      <option value="youth">Youth</option>
                      <option value="children">Children</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="date">Date <span className="required">*</span></label>
                    <input
                      type="text"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      placeholder="e.g., May 28, 2023"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="image">Image <span className="required">*</span></label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    required={!formData.image}
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
                    {editMode ? 'Update Gallery Item' : 'Create Gallery Item'}
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
                <p>Are you sure you want to delete the gallery item <strong>{confirmDelete.title}</strong>?</p>
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

export default GalleryManager;
