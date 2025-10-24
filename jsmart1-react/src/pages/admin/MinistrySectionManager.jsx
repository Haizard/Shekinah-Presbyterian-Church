import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';
import '../../styles/admin/DataManager.css';

const MinistrySectionManager = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    focusAreas: [],
    order: 0,
    sectionId: '',
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newFocusArea, setNewFocusArea] = useState({ icon: 'star', text: '' });

  // Fetch sections on component mount
  useEffect(() => {
    fetchSections();
  }, []);

  // Fetch sections from API
  const fetchSections = async () => {
    try {
      setLoading(true);
      const data = await api.ministrySections.getAll();
      setSections(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching ministry sections:', err);
      setError('Failed to load ministry sections. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) : value
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
    } else {
      setImagePreview(null);
      setImageFile(null);
    }
  };

  // Add focus area
  const handleAddFocusArea = () => {
    if (newFocusArea.text.trim()) {
      setFormData(prev => ({
        ...prev,
        focusAreas: [...prev.focusAreas, { ...newFocusArea }]
      }));
      setNewFocusArea({ icon: 'star', text: '' });
    }
  };

  // Remove focus area
  const handleRemoveFocusArea = (index) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.filter((_, i) => i !== index)
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      focusAreas: [],
      order: 0,
      sectionId: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setEditMode(false);
    setCurrentSection(null);
    setFormError(null);
    setFormSuccess(null);
    setNewFocusArea({ icon: 'star', text: '' });
  };

  // Open form for creating a new section
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Open form for editing an existing section
  const handleEdit = (section) => {
    setFormData(section);
    setCurrentSection(section);
    setEditMode(true);
    setShowForm(true);
    setImagePreview(section.image ? getImageUrl(section.image) : null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!formData.title || !formData.description || !formData.sectionId) {
      setFormError('Title, description, and section ID are required');
      return;
    }

    try {
      const submitData = { ...formData };

      if (editMode) {
        await api.ministrySections.update(currentSection._id, submitData);
        setFormSuccess('Ministry section updated successfully!');
      } else {
        await api.ministrySections.create(submitData);
        setFormSuccess('Ministry section created successfully!');
      }

      setTimeout(() => {
        resetForm();
        setShowForm(false);
        fetchSections();
      }, 1500);
    } catch (err) {
      console.error('Error saving ministry section:', err);
      setFormError(err.message || 'Failed to save ministry section');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await api.ministrySections.delete(id);
      setFormSuccess('Ministry section deleted successfully!');
      setConfirmDelete(null);
      setTimeout(() => {
        fetchSections();
      }, 1000);
    } catch (err) {
      console.error('Error deleting ministry section:', err);
      setFormError('Failed to delete ministry section');
    }
  };

  return (
    <AdminLayout>
      <div className="data-manager">
        <div className="manager-header">
          <h1>Ministry Sections Manager</h1>
          <button className="btn btn-primary" onClick={handleAddNew}>
            <FontAwesomeIcon icon="plus" /> Add New Section
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
            <p>Loading ministry sections...</p>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Section ID</th>
                  <th>Order</th>
                  <th>Focus Areas</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sections.length > 0 ? (
                  sections.map(section => (
                    <tr key={section._id}>
                      <td>{section.title}</td>
                      <td>{section.sectionId}</td>
                      <td>{section.order}</td>
                      <td>{section.focusAreas?.length || 0}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => handleEdit(section)}
                        >
                          <FontAwesomeIcon icon="edit" /> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => setConfirmDelete(section._id)}
                        >
                          <FontAwesomeIcon icon="trash" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No ministry sections found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editMode ? 'Edit Ministry Section' : 'Add New Ministry Section'}</h2>
                <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
              </div>

              {formError && <div className="alert alert-error">{formError}</div>}
              {formSuccess && <div className="alert alert-success">{formSuccess}</div>}

              <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Church Planting & Gospel Expansion"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Section ID *</label>
                  <input
                    type="text"
                    name="sectionId"
                    value={formData.sectionId}
                    onChange={handleChange}
                    placeholder="e.g., discipleship"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter section description"
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Enter image URL"
                  />
                </div>

                <div className="form-group">
                  <label>Focus Areas</label>
                  <div className="focus-areas-list">
                    {formData.focusAreas.map((area, index) => (
                      <div key={index} className="focus-area-item">
                        <span>{area.text}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemoveFocusArea(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="add-focus-area">
                    <input
                      type="text"
                      value={newFocusArea.text}
                      onChange={(e) => setNewFocusArea({ ...newFocusArea, text: e.target.value })}
                      placeholder="Add focus area"
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={handleAddFocusArea}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editMode ? 'Update Section' : 'Create Section'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Confirm Delete</h2>
              </div>
              <p>Are you sure you want to delete this ministry section?</p>
              <div className="form-actions">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(confirmDelete)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MinistrySectionManager;

