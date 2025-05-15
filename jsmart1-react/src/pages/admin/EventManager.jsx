import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import '../../styles/admin/DataManager.css';

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    category: '',
    description: '',
    image: ''
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await api.events.getAll();
      setEvents(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
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
      date: '',
      time: '',
      location: '',
      category: '',
      description: '',
      image: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setEditMode(false);
    setCurrentEvent(null);
    setFormError(null);
    setFormSuccess(null);
  };

  // Open form for creating a new event
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Open form for editing an existing event
  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      description: event.description,
      image: event.image
    });
    setImagePreview(event.image);
    setEditMode(true);
    setCurrentEvent(event);
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
      if (!formData.title || !formData.date || !formData.time || !formData.location || !formData.category || !formData.description) {
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
      
      const eventData = {
        ...formData,
        image: imagePath
      };
      
      if (editMode && currentEvent) {
        // Update existing event
        await api.events.update(currentEvent._id, eventData);
        setFormSuccess('Event updated successfully!');
      } else {
        // Create new event
        await api.events.create(eventData);
        setFormSuccess('Event created successfully!');
      }
      
      // Refresh events list
      fetchEvents();
      
      // Reset form after a short delay
      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 2000);
      
    } catch (err) {
      console.error('Error saving event:', err);
      setFormError('Failed to save event. Please try again.');
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (event) => {
    setConfirmDelete(event);
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  // Delete event
  const handleDelete = async (id) => {
    try {
      await api.events.delete(id);
      setConfirmDelete(null);
      fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <div className="data-manager">
        <div className="manager-header">
          <h1>Event Manager</h1>
          <button className="btn btn-primary" onClick={handleAddNew}>
            <FontAwesomeIcon icon="plus" /> Add New Event
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
            <p>Loading events...</p>
          </div>
        ) : (
          <>
            {events.length === 0 ? (
              <div className="no-data">
                <p>No events found. Click "Add New Event" to create one.</p>
              </div>
            ) : (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Location</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(event => (
                      <tr key={event._id}>
                        <td>{event.title}</td>
                        <td>{event.date}</td>
                        <td>{event.time}</td>
                        <td>{event.location}</td>
                        <td>{event.category}</td>
                        <td className="actions">
                          <button 
                            className="btn btn-sm btn-edit"
                            onClick={() => handleEdit(event)}
                          >
                            <FontAwesomeIcon icon="edit" /> Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-delete"
                            onClick={() => handleDeleteConfirm(event)}
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
                <h2>{editMode ? 'Edit Event' : 'Add New Event'}</h2>
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
                    <label htmlFor="date">Date <span className="required">*</span></label>
                    <input
                      type="text"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      placeholder="e.g., June 12, 2023"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="time">Time <span className="required">*</span></label>
                    <input
                      type="text"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      placeholder="e.g., 9:00 AM - 12:00 PM"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="location">Location <span className="required">*</span></label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
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
                      <option value="study">Bible Study</option>
                      <option value="fellowship">Fellowship</option>
                      <option value="outreach">Outreach</option>
                      <option value="conference">Conference</option>
                      <option value="youth">Youth</option>
                      <option value="children">Children</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description <span className="required">*</span></label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="image">Event Image</label>
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
                    {editMode ? 'Update Event' : 'Create Event'}
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
                <p>Are you sure you want to delete the event <strong>{confirmDelete.title}</strong>?</p>
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

export default EventManager;
