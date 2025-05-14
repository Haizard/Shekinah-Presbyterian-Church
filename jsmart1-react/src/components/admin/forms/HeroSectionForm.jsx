import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getImageUrl, handleImageError } from '../../../utils/imageUtils';
import api from '../../../services/api';

const HeroSectionForm = ({ initialData, onSubmit }) => {
  const [title, setTitle] = useState('Hero Section');
  const [subtitle, setSubtitle] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [showBranchSlider, setShowBranchSlider] = useState(true);
  const [branches, setBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await api.branches.getAll();
        setBranches(data);
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Failed to load branches. Please try again.');
      }
    };

    fetchBranches();
  }, []);

  // Initialize form with data if available
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || 'Hero Section');
      
      if (initialData.image) {
        setBackgroundImage(initialData.image);
        setImagePreview(getImageUrl(initialData.image));
      }
      
      if (initialData.content) {
        try {
          // Try to parse the content as JSON
          if (initialData.content.startsWith('{') && initialData.content.endsWith('}')) {
            const parsedData = JSON.parse(initialData.content);
            setSubtitle(parsedData.subtitle || '');
            setShowBranchSlider(parsedData.showBranchSlider !== false);
            
            // Set selected branches if available
            if (parsedData.selectedBranchIds && Array.isArray(parsedData.selectedBranchIds)) {
              setSelectedBranches(parsedData.selectedBranchIds);
            }
          } else {
            // If not JSON, use as subtitle
            setSubtitle(initialData.content);
          }
        } catch (err) {
          console.error('Error parsing hero section data:', err);
          setError('Invalid hero section data format');
        }
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
    if (!imageFile) return backgroundImage;

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

  const handleBranchSelection = (branchId) => {
    setSelectedBranches(prev => {
      if (prev.includes(branchId)) {
        return prev.filter(id => id !== branchId);
      } else {
        return [...prev, branchId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      
      // Upload image if selected
      let finalBackgroundImage = backgroundImage;
      if (imageFile) {
        finalBackgroundImage = await uploadImage();
      }
      
      // Create the content object
      const contentObj = {
        subtitle: subtitle,
        showBranchSlider: showBranchSlider,
        selectedBranchIds: selectedBranches
      };
      
      // Convert to JSON string
      const contentJson = JSON.stringify(contentObj);
      
      // Call the parent's onSubmit with the form data
      onSubmit({
        section: 'hero',
        title: title,
        content: contentJson,
        image: finalBackgroundImage
      });
      
      setLoading(false);
    } catch (err) {
      setError('Failed to save hero section. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="specialized-form hero-section-form">
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
          <label htmlFor="subtitle">Subtitle</label>
          <textarea
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows="2"
            placeholder="Enter a subtitle for the hero section..."
          />
        </div>
        
        <div className="form-group">
          <label>Background Image</label>
          <div className="image-upload-container">
            {(imagePreview || backgroundImage) && (
              <div className="image-preview">
                <img
                  src={imagePreview || getImageUrl(backgroundImage)}
                  alt="Background Preview"
                  onError={(e) => handleImageError(e)}
                />
              </div>
            )}
            
            <div className="upload-controls">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="background-image"
                className="file-input"
              />
              <label htmlFor="background-image" className="btn btn-secondary">
                <FontAwesomeIcon icon="upload" /> Choose Image
              </label>
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="showBranchSlider"
              checked={showBranchSlider}
              onChange={(e) => setShowBranchSlider(e.target.checked)}
            />
            <label htmlFor="showBranchSlider">Show Branch Slider</label>
          </div>
          <p className="form-help-text">
            When enabled, the hero section will display a slider of church branches.
          </p>
        </div>
        
        {showBranchSlider && (
          <div className="form-group">
            <label>Select Branches to Display</label>
            <p className="form-help-text">
              Select which branches to display in the slider. If none are selected, all branches will be shown.
            </p>
            
            <div className="branches-selection">
              {branches.length > 0 ? (
                branches.map(branch => (
                  <div key={branch._id} className="branch-checkbox">
                    <input
                      type="checkbox"
                      id={`branch-${branch._id}`}
                      checked={selectedBranches.includes(branch._id)}
                      onChange={() => handleBranchSelection(branch._id)}
                    />
                    <label htmlFor={`branch-${branch._id}`}>{branch.name}</label>
                  </div>
                ))
              ) : (
                <p>No branches available. <a href="/admin/branches" target="_blank" rel="noopener noreferrer">Create branches</a> first.</p>
              )}
            </div>
          </div>
        )}
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span> Saving...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon="save" /> Save Hero Section
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HeroSectionForm;
