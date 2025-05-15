import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import '../../styles/admin/DataManager.css';

const SermonManager = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSermon, setCurrentSermon] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    date: '',
    scripture: '',
    category: '',
    image: '',
    audioUrl: '',
    videoUrl: '',
    notesUrl: '',
    description: ''
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [notesFile, setNotesFile] = useState(null);

  // Fetch sermons on component mount
  useEffect(() => {
    fetchSermons();
  }, []);

  // Fetch sermons from API
  const fetchSermons = async () => {
    try {
      setLoading(true);
      const data = await api.sermons.getAll();
      setSermons(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching sermons:', err);
      setError('Failed to load sermons. Please try again.');
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

  // Handle audio file selection
  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
    }
  };

  // Handle notes file selection
  const handleNotesChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNotesFile(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      speaker: '',
      date: '',
      scripture: '',
      category: '',
      image: '',
      audioUrl: '',
      videoUrl: '',
      notesUrl: '',
      description: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setAudioFile(null);
    setNotesFile(null);
    setEditMode(false);
    setCurrentSermon(null);
    setFormError(null);
    setFormSuccess(null);
  };

  // Open form for creating a new sermon
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Open form for editing an existing sermon
  const handleEdit = (sermon) => {
    setFormData({
      title: sermon.title,
      speaker: sermon.speaker,
      date: sermon.date,
      scripture: sermon.scripture,
      category: sermon.category,
      image: sermon.image,
      audioUrl: sermon.audioUrl,
      videoUrl: sermon.videoUrl,
      notesUrl: sermon.notesUrl,
      description: sermon.description
    });
    setImagePreview(sermon.image);
    setEditMode(true);
    setCurrentSermon(sermon);
    setShowForm(true);
    setFormError(null);
    setFormSuccess(null);
  };

  // Upload file
  const uploadFile = async (file) => {
    if (!file) return null;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.upload.uploadFile(formData);
      return response.filePath;
    } catch (err) {
      console.error('Error uploading file:', err);
      throw new Error('Failed to upload file. Please try again.');
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setFormError(null);
      setFormSuccess(null);
      
      // Validate form
      if (!formData.title || !formData.speaker || !formData.date || !formData.scripture || !formData.category || !formData.description) {
        setFormError('Please fill in all required fields.');
        return;
      }
      
      // Upload files if selected
      let imagePath = formData.image;
      let audioPath = formData.audioUrl;
      let notesPath = formData.notesUrl;
      
      if (imageFile) {
        imagePath = await uploadFile(imageFile);
      }
      
      if (audioFile) {
        audioPath = await uploadFile(audioFile);
      }
      
      if (notesFile) {
        notesPath = await uploadFile(notesFile);
      }
      
      const sermonData = {
        ...formData,
        image: imagePath,
        audioUrl: audioPath,
        notesUrl: notesPath
      };
      
      if (editMode && currentSermon) {
        // Update existing sermon
        await api.sermons.update(currentSermon._id, sermonData);
        setFormSuccess('Sermon updated successfully!');
      } else {
        // Create new sermon
        await api.sermons.create(sermonData);
        setFormSuccess('Sermon created successfully!');
      }
      
      // Refresh sermons list
      fetchSermons();
      
      // Reset form after a short delay
      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 2000);
      
    } catch (err) {
      console.error('Error saving sermon:', err);
      setFormError('Failed to save sermon. Please try again.');
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (sermon) => {
    setConfirmDelete(sermon);
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  // Delete sermon
  const handleDelete = async (id) => {
    try {
      await api.sermons.delete(id);
      setConfirmDelete(null);
      fetchSermons();
    } catch (err) {
      console.error('Error deleting sermon:', err);
      setError('Failed to delete sermon. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="data-manager">
        <div className="manager-header">
          <h1>Sermon Manager</h1>
          <button className="btn btn-primary" onClick={handleAddNew}>
            <FontAwesomeIcon icon="plus" /> Add New Sermon
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
            <p>Loading sermons...</p>
          </div>
        ) : (
          <>
            {sermons.length === 0 ? (
              <div className="no-data">
                <p>No sermons found. Click "Add New Sermon" to create one.</p>
              </div>
            ) : (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Speaker</th>
                      <th>Date</th>
                      <th>Scripture</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sermons.map(sermon => (
                      <tr key={sermon._id}>
                        <td>{sermon.title}</td>
                        <td>{sermon.speaker}</td>
                        <td>{sermon.date}</td>
                        <td>{sermon.scripture}</td>
                        <td>{sermon.category}</td>
                        <td className="actions">
                          <button 
                            className="btn btn-sm btn-edit"
                            onClick={() => handleEdit(sermon)}
                          >
                            <FontAwesomeIcon icon="edit" /> Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-delete"
                            onClick={() => handleDeleteConfirm(sermon)}
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
                <h2>{editMode ? 'Edit Sermon' : 'Add New Sermon'}</h2>
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
                <div className="form-row">
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
                    <label htmlFor="speaker">Speaker <span className="required">*</span></label>
                    <input
                      type="text"
                      id="speaker"
                      name="speaker"
                      value={formData.speaker}
                      onChange={handleChange}
                      required
                    />
                  </div>
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
                      placeholder="e.g., June 5, 2023"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="scripture">Scripture <span className="required">*</span></label>
                    <input
                      type="text"
                      id="scripture"
                      name="scripture"
                      value={formData.scripture}
                      onChange={handleChange}
                      placeholder="e.g., John 3:16-21"
                      required
                    />
                  </div>
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
                    <option value="faith">Faith</option>
                    <option value="prayer">Prayer</option>
                    <option value="worship">Worship</option>
                    <option value="discipleship">Discipleship</option>
                    <option value="evangelism">Evangelism</option>
                    <option value="family">Family</option>
                    <option value="leadership">Leadership</option>
                    <option value="missions">Missions</option>
                  </select>
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
                  <label htmlFor="image">Sermon Image</label>
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
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="audioFile">Audio File</label>
                    <input
                      type="file"
                      id="audioFile"
                      name="audioFile"
                      onChange={handleAudioChange}
                      accept="audio/*"
                    />
                    {formData.audioUrl && !audioFile && (
                      <div className="file-link">
                        <a href={formData.audioUrl} target="_blank" rel="noopener noreferrer">
                          <FontAwesomeIcon icon="headphones" /> Current Audio
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="notesFile">Sermon Notes</label>
                    <input
                      type="file"
                      id="notesFile"
                      name="notesFile"
                      onChange={handleNotesChange}
                      accept=".pdf,.doc,.docx"
                    />
                    {formData.notesUrl && !notesFile && (
                      <div className="file-link">
                        <a href={formData.notesUrl} target="_blank" rel="noopener noreferrer">
                          <FontAwesomeIcon icon="file-alt" /> Current Notes
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="videoUrl">Video URL</label>
                  <input
                    type="url"
                    id="videoUrl"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    placeholder="e.g., https://youtube.com/watch?v=..."
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? 'Update Sermon' : 'Create Sermon'}
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
                <p>Are you sure you want to delete the sermon <strong>{confirmDelete.title}</strong>?</p>
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

export default SermonManager;
