import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getImageUrl, handleImageError } from '../../../utils/imageUtils';
import api from '../../../services/api';

const HowWeServeForm = ({ initialData, onSubmit }) => {
  const [title, setTitle] = useState('How We Serve');
  const [introduction, setIntroduction] = useState('');
  const [ministryAreas, setMinistryAreas] = useState([]);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentMinistryIndex, setCurrentMinistryIndex] = useState(null);

  useEffect(() => {
    // Initialize form with data if available
    if (initialData) {
      setTitle(initialData.title || 'How We Serve');
      
      if (initialData.content) {
        try {
          // Try to parse the content as JSON
          if (initialData.content.startsWith('{') && initialData.content.endsWith('}')) {
            const parsedData = JSON.parse(initialData.content);
            setIntroduction(parsedData.introduction || '');
            setMinistryAreas(parsedData.ministryAreas || [{ name: '', description: '', icon: '', image: '' }]);
          } else {
            // If not JSON, use as introduction and initialize with empty ministry areas array
            setIntroduction(initialData.content);
            setMinistryAreas([{ name: '', description: '', icon: '', image: '' }]);
          }
        } catch (err) {
          console.error('Error parsing how we serve data:', err);
          setError('Invalid data format');
          // Initialize with default structure
          setIntroduction('');
          setMinistryAreas([{ name: '', description: '', icon: '', image: '' }]);
        }
      } else {
        // Initialize with default structure
        setIntroduction('');
        setMinistryAreas([{ name: '', description: '', icon: '', image: '' }]);
      }
    } else {
      // Initialize with default structure
      setIntroduction('');
      setMinistryAreas([{ name: '', description: '', icon: '', image: '' }]);
    }
  }, [initialData]);

  const handleMinistryChange = (index, field, value) => {
    const updatedMinistries = [...ministryAreas];
    updatedMinistries[index][field] = value;
    setMinistryAreas(updatedMinistries);
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

  const handleMinistryImageUpload = async (index) => {
    setCurrentMinistryIndex(index);
    
    try {
      if (imageFile) {
        const imagePath = await uploadImage();
        if (imagePath) {
          handleMinistryChange(index, 'image', imagePath);
          setImageFile(null);
          setImagePreview(null);
        }
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setCurrentMinistryIndex(null);
    }
  };

  const addMinistry = () => {
    setMinistryAreas([...ministryAreas, { name: '', description: '', icon: '', image: '' }]);
  };

  const removeMinistry = (index) => {
    const updatedMinistries = [...ministryAreas];
    updatedMinistries.splice(index, 1);
    setMinistryAreas(updatedMinistries);
  };

  // Available FontAwesome icons for ministry areas
  const availableIcons = [
    { value: 'church', label: 'Church' },
    { value: 'hands-helping', label: 'Helping Hands' },
    { value: 'graduation-cap', label: 'Education' },
    { value: 'bible', label: 'Bible' },
    { value: 'cross', label: 'Cross' },
    { value: 'dove', label: 'Dove' },
    { value: 'heart', label: 'Heart' },
    { value: 'users', label: 'Community' },
    { value: 'globe-africa', label: 'Missions' },
    { value: 'music', label: 'Music' },
    { value: 'child', label: 'Children' },
    { value: 'hands', label: 'Prayer' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    let isValid = true;
    
    // Check if all ministry areas have required fields
    for (const ministry of ministryAreas) {
      if (!ministry.name.trim() || !ministry.description.trim()) {
        setError('All ministry areas must have a name and description');
        isValid = false;
        break;
      }
    }
    
    if (isValid) {
      try {
        // Create the content object
        const contentObj = {
          introduction: introduction,
          ministryAreas: ministryAreas
        };
        
        // Convert to JSON string
        const contentJson = JSON.stringify(contentObj);
        
        // Call the parent's onSubmit with the form data
        onSubmit({
          section: 'how_we_serve',
          title: title,
          content: contentJson
        });
      } catch (err) {
        setError('Failed to save data. Please try again.');
      }
    }
  };

  return (
    <div className="specialized-form how-we-serve-form">
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
            placeholder="Introduce your ministry areas..."
          />
        </div>
        
        <div className="form-group">
          <label>Ministry Areas</label>
          <p className="form-help-text">
            Add the different areas of ministry in your church.
          </p>
          
          {ministryAreas.map((ministry, index) => (
            <div key={index} className="ministry-item">
              <div className="ministry-header">
                <h4>Ministry Area #{index + 1}</h4>
                {ministryAreas.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeMinistry(index)}
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
                    value={ministry.name}
                    onChange={(e) => handleMinistryChange(index, 'name', e.target.value)}
                    placeholder="e.g. Worship"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Icon</label>
                  <select
                    value={ministry.icon}
                    onChange={(e) => handleMinistryChange(index, 'icon', e.target.value)}
                  >
                    <option value="">Select an icon</option>
                    {availableIcons.map(icon => (
                      <option key={icon.value} value={icon.value}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Description <span className="required">*</span></label>
                <textarea
                  value={ministry.description}
                  onChange={(e) => handleMinistryChange(index, 'description', e.target.value)}
                  rows="3"
                  placeholder="Describe this ministry area..."
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Image</label>
                <div className="ministry-image-upload">
                  {ministry.image && (
                    <div className="image-preview">
                      <img
                        src={getImageUrl(ministry.image)}
                        alt={ministry.name}
                        onError={(e) => handleImageError(e)}
                      />
                    </div>
                  )}
                  
                  <div className="upload-controls">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      id={`ministry-image-${index}`}
                      className="file-input"
                    />
                    <label htmlFor={`ministry-image-${index}`} className="btn btn-secondary">
                      <FontAwesomeIcon icon="upload" /> Choose Image
                    </label>
                    
                    {imageFile && currentMinistryIndex === null && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleMinistryImageUpload(index)}
                      >
                        <FontAwesomeIcon icon="save" /> Upload Image
                      </button>
                    )}
                    
                    {currentMinistryIndex === index && (
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
            onClick={addMinistry}
          >
            <FontAwesomeIcon icon="plus" /> Add Ministry Area
          </button>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <FontAwesomeIcon icon="save" /> Save Ministry Areas
          </button>
        </div>
      </form>
    </div>
  );
};

export default HowWeServeForm;
