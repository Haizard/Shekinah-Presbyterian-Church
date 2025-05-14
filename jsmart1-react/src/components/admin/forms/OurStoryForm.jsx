import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getImageUrl, handleImageError } from '../../../utils/imageUtils';
import api from '../../../services/api';

const OurStoryForm = ({ initialData, onSubmit }) => {
  const [title, setTitle] = useState('Our Story');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePath, setImagePath] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize form with data if available
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || 'Our Story');
      setContent(initialData.content || '');

      if (initialData.image) {
        setImagePath(initialData.image);
        setImagePreview(getImageUrl(initialData.image));
      }
    }
  }, [initialData]);

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

  const validateForm = () => {
    // Title is required
    if (!title.trim()) {
      setError('Section title is required');
      setSuccess(null);
      return false;
    }

    // Content is required
    if (!content.trim()) {
      setError('Content is required');
      setSuccess(null);
      return false;
    }

    // Clear any previous errors
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Upload image if selected
      let finalImagePath = imagePath;
      if (imageFile) {
        finalImagePath = await uploadImage();
      }

      // Call the parent's onSubmit with the form data
      onSubmit({
        section: 'story',
        title: title,
        content: content,
        image: finalImagePath
      });

      // Show success message
      setSuccess('Our Story section saved successfully!');

      setLoading(false);
    } catch (err) {
      console.error('Error saving our story section:', err);
      setError('Failed to save our story section. Please try again.');
      setSuccess(null);
      setLoading(false);
    }
  };

  return (
    <div className="specialized-form our-story-form">
      {error && (
        <div className="alert alert-danger">
          <FontAwesomeIcon icon="exclamation-circle" /> {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <FontAwesomeIcon icon="check-circle" /> {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Section Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            placeholder="Enter the story of your church..."
            required
          />
          <p className="form-help-text">
            You can use HTML tags to format your content. For example, use &lt;strong&gt;text&lt;/strong&gt; for bold text.
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="story-image">Story Image</label>
          <div className="image-upload-container">
            {(imagePreview || imagePath) && (
              <div className="image-preview">
                <img
                  src={imagePreview || getImageUrl(imagePath)}
                  alt="Story Preview"
                  onError={(e) => handleImageError(e)}
                />
              </div>
            )}

            <div className="upload-controls">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="story-image"
                className="file-input"
              />
              <label htmlFor="story-image" className="btn btn-secondary">
                <FontAwesomeIcon icon="upload" /> Choose Image
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small" /> Saving...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon="save" /> Save Our Story
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OurStoryForm;
