import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getImageUrl, handleImageError } from '../../../utils/imageUtils';
import api from '../../../services/api';

const OurBeliefsForm = ({ initialData, onSubmit }) => {
  const [title, setTitle] = useState('Our Beliefs');
  const [introduction, setIntroduction] = useState('');
  const [beliefs, setBelief] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePath, setImagePath] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize form with data if available
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || 'Our Beliefs');
      
      if (initialData.content) {
        try {
          // Try to parse the content if it's JSON
          if (initialData.content.startsWith('{') && initialData.content.endsWith('}')) {
            const parsedContent = JSON.parse(initialData.content);
            setIntroduction(parsedContent.introduction || '');
            setBelief(parsedContent.beliefs || [{ title: '', description: '' }]);
          } else {
            // If not JSON, use as introduction
            setIntroduction(initialData.content);
            setBelief([{ title: '', description: '' }]);
          }
        } catch (err) {
          console.error('Error parsing beliefs content:', err);
          setIntroduction(initialData.content);
          setBelief([{ title: '', description: '' }]);
        }
      } else {
        setBelief([{ title: '', description: '' }]);
      }

      if (initialData.image) {
        setImagePath(initialData.image);
        setImagePreview(getImageUrl(initialData.image));
      }
    }
  }, [initialData]);

  const handleBeliefChange = (index, field, value) => {
    const updatedBeliefs = [...beliefs];
    updatedBeliefs[index][field] = value;
    setBelief(updatedBeliefs);
  };

  const addBelief = () => {
    setBelief([...beliefs, { title: '', description: '' }]);
  };

  const removeBelief = (index) => {
    const updatedBeliefs = [...beliefs];
    updatedBeliefs.splice(index, 1);
    setBelief(updatedBeliefs);
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
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return imagePath;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await api.upload.uploadFile(formData);
      return response.filePath;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new Error('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      setError('Title is required');
      return false;
    }

    // Check if all beliefs have required fields
    for (const belief of beliefs) {
      if (!belief.title.trim() || !belief.description.trim()) {
        setError('All beliefs must have a title and description');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      // Create structured content object
      const contentObj = {
        introduction: introduction,
        beliefs: beliefs
      };

      // Convert to JSON string
      const contentJson = JSON.stringify(contentObj);

      // Call the parent's onSubmit with the form data
      onSubmit({
        section: 'beliefs',
        title: title,
        content: contentJson,
        image: finalImagePath
      });

      setSuccess('Our Beliefs section saved successfully!');
      setLoading(false);
    } catch (err) {
      console.error('Error saving beliefs section:', err);
      setError('Failed to save beliefs section. Please try again.');
      setSuccess(null);
      setLoading(false);
    }
  };

  return (
    <div className="specialized-form our-beliefs-form">
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
          <label htmlFor="introduction">Introduction</label>
          <textarea
            id="introduction"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            rows="4"
            placeholder="Introduce your church's core beliefs..."
          />
        </div>

        <div className="form-group">
          <label>Core Beliefs</label>
          <p className="form-help-text">
            Add the core beliefs of your church. Each belief should have a title and description.
          </p>
          
          {beliefs.map((belief, index) => (
            <div key={index} className="belief-item">
              <div className="belief-header">
                <h4>Belief #{index + 1}</h4>
                {beliefs.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeBelief(index)}
                  >
                    <FontAwesomeIcon icon="trash-alt" /> Remove
                  </button>
                )}
              </div>
              
              <div className="form-group">
                <label>Title <span className="required">*</span></label>
                <input
                  type="text"
                  value={belief.title}
                  onChange={(e) => handleBeliefChange(index, 'title', e.target.value)}
                  placeholder="e.g., God's Love"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description <span className="required">*</span></label>
                <textarea
                  value={belief.description}
                  onChange={(e) => handleBeliefChange(index, 'description', e.target.value)}
                  rows="3"
                  placeholder="Describe this belief..."
                  required
                />
              </div>
            </div>
          ))}
          
          <button
            type="button"
            className="btn btn-secondary mt-3"
            onClick={addBelief}
          >
            <FontAwesomeIcon icon="plus" /> Add Belief
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="beliefs-image">Section Image (Optional)</label>
          <div className="image-upload-container">
            {(imagePreview || imagePath) && (
              <div className="image-preview">
                <img
                  src={imagePreview || getImageUrl(imagePath)}
                  alt="Beliefs Preview"
                  onError={(e) => handleImageError(e)}
                />
              </div>
            )}

            <div className="upload-controls">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="beliefs-image"
                className="file-input"
              />
              <label htmlFor="beliefs-image" className="btn btn-secondary">
                <FontAwesomeIcon icon="upload" /> Choose Image
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <FontAwesomeIcon icon="spinner" spin /> Saving...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon="save" /> Save Beliefs
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OurBeliefsForm;

