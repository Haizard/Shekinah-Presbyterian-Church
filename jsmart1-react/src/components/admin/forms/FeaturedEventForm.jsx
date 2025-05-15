import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getImageUrl, handleImageError } from '../../../utils/imageUtils';
import api from '../../../services/api';

const FeaturedEventForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    link: '/events'
  });
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePath, setImagePath] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Initialize form with data if available
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        date: '',
        time: '',
        location: '',
        description: '',
        link: '/events'
      });
      
      if (initialData.image) {
        setImagePath(initialData.image);
        setImagePreview(getImageUrl(initialData.image));
      }
      
      if (initialData.content) {
        try {
          // Try to parse the content as JSON
          if (initialData.content.startsWith('{') && initialData.content.endsWith('}')) {
            const parsedData = JSON.parse(initialData.content);
            setFormData({
              title: initialData.title || parsedData.title || '',
              date: parsedData.date || '',
              time: parsedData.time || '',
              location: parsedData.location || '',
              description: parsedData.description || '',
              link: parsedData.link || '/events'
            });
          }
        } catch (err) {
          console.error('Error parsing featured event data:', err);
          setError('Invalid featured event data format');
        }
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  const uploadImage = async () => {
    if (!imageFile) return imagePath;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await api.upload.uploadFile(formData);
      setImagePath(response.filePath);
      return response.filePath;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new Error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.date || !formData.time || !formData.location || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      // Upload image if selected
      let finalImagePath = imagePath;
      if (imageFile) {
        finalImagePath = await uploadImage();
      }
      
      // Convert to JSON string
      const contentJson = JSON.stringify(formData);
      
      // Call the parent's onSubmit with the form data
      onSubmit({
        section: 'featured_event',
        title: formData.title,
        content: contentJson,
        image: finalImagePath
      });
    } catch (err) {
      setError('Failed to save featured event. Please try again.');
    }
  };

  return (
    <div className="specialized-form featured-event-form">
      {error && (
        <div className="alert alert-danger">
          <FontAwesomeIcon icon="exclamation-circle" />
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Event Title <span className="required">*</span></label>
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
              placeholder="e.g. June 15-17, 2023"
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
              placeholder="e.g. 9:00 AM - 4:00 PM"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location <span className="required">*</span></label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Main Sanctuary"
            required
          />
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
          <label htmlFor="link">Link</label>
          <input
            type="text"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="e.g. /events"
          />
          <p className="field-help">Link to more information about the event (default: /events)</p>
        </div>
        
        <div className="form-group">
          <label>Event Image</label>
          <div className="image-upload-container">
            {(imagePreview || imagePath) && (
              <div className="image-preview">
                <img
                  src={imagePreview || getImageUrl(imagePath)}
                  alt="Event Preview"
                  onError={(e) => handleImageError(e)}
                />
              </div>
            )}
            
            <div className="upload-controls">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="event-image"
                className="file-input"
              />
              <label htmlFor="event-image" className="btn btn-secondary">
                <FontAwesomeIcon icon="upload" /> Choose Image
              </label>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? (
              <>
                <div className="spinner-small"></div> Uploading...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon="save" /> Save Event
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeaturedEventForm;
