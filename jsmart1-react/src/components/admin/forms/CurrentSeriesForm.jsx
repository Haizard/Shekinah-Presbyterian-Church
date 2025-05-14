import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getImageUrl, handleImageError } from '../../../utils/imageUtils';
import api from '../../../services/api';

const CurrentSeriesForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: 'Current Series',
    seriesTitle: '',
    description: '',
    dateRange: '',
    link: '/sermons'
  });
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePath, setImagePath] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize form with data if available
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || 'Current Series',
        seriesTitle: '',
        description: '',
        dateRange: '',
        link: '/sermons'
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
              title: initialData.title || 'Current Series',
              seriesTitle: parsedData.seriesTitle || '',
              description: parsedData.description || '',
              dateRange: parsedData.dateRange || '',
              link: parsedData.link || '/sermons'
            });
          }
        } catch (err) {
          console.error('Error parsing current series data:', err);
          setError('Invalid current series data format');
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
      setLoading(true);
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await api.upload.uploadFile(formData);
      setLoading(false);
      return response.filePath;
    } catch (err) {
      console.error('Error uploading image:', err);
      setLoading(false);
      throw new Error('Failed to upload image. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.seriesTitle || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload image if selected
      let finalImagePath = imagePath;
      if (imageFile) {
        finalImagePath = await uploadImage();
      }
      
      // Convert to JSON string
      const contentJson = JSON.stringify({
        seriesTitle: formData.seriesTitle,
        description: formData.description,
        dateRange: formData.dateRange,
        link: formData.link
      });
      
      // Call the parent's onSubmit with the form data
      onSubmit({
        section: 'current_series',
        title: formData.title,
        content: contentJson,
        image: finalImagePath
      });
      
      setLoading(false);
    } catch (err) {
      setError('Failed to save current series. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="specialized-form current-series-form">
      {error && (
        <div className="alert alert-danger">
          <FontAwesomeIcon icon="exclamation-circle" />
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Section Title</label>
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
          <label htmlFor="seriesTitle">Series Title <span className="required">*</span></label>
          <input
            type="text"
            id="seriesTitle"
            name="seriesTitle"
            value={formData.seriesTitle}
            onChange={handleChange}
            placeholder="e.g. Walking in Faith"
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
            placeholder="Describe the current sermon series..."
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="dateRange">Date Range</label>
          <input
            type="text"
            id="dateRange"
            name="dateRange"
            value={formData.dateRange}
            onChange={handleChange}
            placeholder="e.g. June 2023 - August 2023"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="link">Link URL</label>
          <input
            type="text"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="e.g. /sermons/series/faith"
          />
          <p className="form-help-text">
            URL to view the full series. Default is /sermons
          </p>
        </div>
        
        <div className="form-group">
          <label>Series Image</label>
          <div className="image-upload-container">
            {(imagePreview || imagePath) && (
              <div className="image-preview">
                <img
                  src={imagePreview || getImageUrl(imagePath)}
                  alt="Series Preview"
                  onError={(e) => handleImageError(e)}
                />
              </div>
            )}
            
            <div className="upload-controls">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="series-image"
                className="file-input"
              />
              <label htmlFor="series-image" className="btn btn-secondary">
                <FontAwesomeIcon icon="upload" /> Choose Image
              </label>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span> Saving...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon="save" /> Save Current Series
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CurrentSeriesForm;
