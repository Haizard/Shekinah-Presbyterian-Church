import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getImageUrl, handleImageError } from '../../../utils/imageUtils';
import api from '../../../services/api';

const LeadershipForm = ({ initialData, onSubmit }) => {
  const [title, setTitle] = useState('Our Leadership');
  const [introduction, setIntroduction] = useState('');
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentLeaderIndex, setCurrentLeaderIndex] = useState(null);

  useEffect(() => {
    // Initialize form with data if available
    if (initialData) {
      setTitle(initialData.title || 'Our Leadership');
      
      if (initialData.content) {
        try {
          // Try to parse the content as JSON
          if (initialData.content.startsWith('{') && initialData.content.endsWith('}')) {
            const parsedData = JSON.parse(initialData.content);
            setIntroduction(parsedData.introduction || '');
            setLeaders(parsedData.leaders || [{ name: '', position: '', bio: '', image: '' }]);
          } else {
            // If not JSON, use as introduction and initialize with empty leaders array
            setIntroduction(initialData.content);
            setLeaders([{ name: '', position: '', bio: '', image: '' }]);
          }
        } catch (err) {
          console.error('Error parsing leadership data:', err);
          setError('Invalid leadership data format');
          // Initialize with default structure
          setIntroduction('');
          setLeaders([{ name: '', position: '', bio: '', image: '' }]);
        }
      } else {
        // Initialize with default structure
        setIntroduction('');
        setLeaders([{ name: '', position: '', bio: '', image: '' }]);
      }
    } else {
      // Initialize with default structure
      setIntroduction('');
      setLeaders([{ name: '', position: '', bio: '', image: '' }]);
    }
  }, [initialData]);

  const handleLeaderChange = (index, field, value) => {
    const updatedLeaders = [...leaders];
    updatedLeaders[index][field] = value;
    setLeaders(updatedLeaders);
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

  const handleLeaderImageUpload = async (index) => {
    setCurrentLeaderIndex(index);
    
    try {
      if (imageFile) {
        const imagePath = await uploadImage();
        if (imagePath) {
          handleLeaderChange(index, 'image', imagePath);
          setImageFile(null);
          setImagePreview(null);
        }
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setCurrentLeaderIndex(null);
    }
  };

  const addLeader = () => {
    setLeaders([...leaders, { name: '', position: '', bio: '', image: '' }]);
  };

  const removeLeader = (index) => {
    const updatedLeaders = [...leaders];
    updatedLeaders.splice(index, 1);
    setLeaders(updatedLeaders);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    let isValid = true;
    
    // Check if all leaders have required fields
    for (const leader of leaders) {
      if (!leader.name.trim() || !leader.position.trim()) {
        setError('All leaders must have a name and position');
        isValid = false;
        break;
      }
    }
    
    if (isValid) {
      try {
        // Create the content object
        const contentObj = {
          introduction: introduction,
          leaders: leaders
        };
        
        // Convert to JSON string
        const contentJson = JSON.stringify(contentObj);
        
        // Call the parent's onSubmit with the form data
        onSubmit({
          section: 'leadership',
          title: title,
          content: contentJson
        });
      } catch (err) {
        setError('Failed to save leadership data. Please try again.');
      }
    }
  };

  return (
    <div className="specialized-form leadership-form">
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
            placeholder="Introduce your leadership team..."
          />
        </div>
        
        <div className="form-group">
          <label>Leadership Team</label>
          <p className="form-help-text">
            Add members of your leadership team. Each leader should have a name, position, and bio.
          </p>
          
          {leaders.map((leader, index) => (
            <div key={index} className="leader-item">
              <div className="leader-header">
                <h4>Leader #{index + 1}</h4>
                {leaders.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeLeader(index)}
                  >
                    <FontAwesomeIcon icon="trash-alt" /> Remove
                  </button>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Name <span className="required">*</span></label>
                  <input
                    type="text"
                    value={leader.name}
                    onChange={(e) => handleLeaderChange(index, 'name', e.target.value)}
                    placeholder="e.g. Pastor John Doe"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Position <span className="required">*</span></label>
                  <input
                    type="text"
                    value={leader.position}
                    onChange={(e) => handleLeaderChange(index, 'position', e.target.value)}
                    placeholder="e.g. Senior Pastor"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={leader.bio}
                  onChange={(e) => handleLeaderChange(index, 'bio', e.target.value)}
                  rows="3"
                  placeholder="Brief biography..."
                />
              </div>
              
              <div className="form-group">
                <label>Photo</label>
                <div className="leader-image-upload">
                  {leader.image && (
                    <div className="image-preview">
                      <img
                        src={getImageUrl(leader.image)}
                        alt={leader.name}
                        onError={(e) => handleImageError(e)}
                      />
                    </div>
                  )}
                  
                  <div className="upload-controls">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      id={`leader-image-${index}`}
                      className="file-input"
                    />
                    <label htmlFor={`leader-image-${index}`} className="btn btn-secondary">
                      <FontAwesomeIcon icon="upload" /> Choose Photo
                    </label>
                    
                    {imageFile && currentLeaderIndex === null && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleLeaderImageUpload(index)}
                      >
                        <FontAwesomeIcon icon="save" /> Upload Photo
                      </button>
                    )}
                    
                    {currentLeaderIndex === index && (
                      <div className="spinner-small"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            className="btn btn-secondary mt-3"
            onClick={addLeader}
          >
            <FontAwesomeIcon icon="plus" /> Add Leader
          </button>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <FontAwesomeIcon icon="save" /> Save Leadership
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadershipForm;
