import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getImageUrl, handleImageError } from '../../../utils/imageUtils';
import api from '../../../services/api';
import ConfirmDialog from '../ConfirmDialog';

// Import modern styles
import '../../../styles/forms.css';

const HeroSectionForm = ({ initialData, onSubmit }) => {
  const [title, setTitle] = useState('Hero Section');
  const [subtitle, setSubtitle] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [showBranchSlider, setShowBranchSlider] = useState(true);
  const [branches, setBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  const resetForm = () => {
    // Reset form to initial state or default values
    if (initialData) {
      setTitle(initialData.title || 'Hero Section');

      if (initialData.image) {
        setBackgroundImage(initialData.image);
        setImagePreview(getImageUrl(initialData.image));
      } else {
        setBackgroundImage('');
        setImagePreview(null);
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
            } else {
              setSelectedBranches([]);
            }
          } else {
            // If not JSON, use as subtitle
            setSubtitle(initialData.content);
            setShowBranchSlider(true);
            setSelectedBranches([]);
          }
        } catch (err) {
          console.error('Error parsing hero section data:', err);
          setError('Invalid hero section data format');
          setSubtitle('');
          setShowBranchSlider(true);
          setSelectedBranches([]);
        }
      } else {
        setSubtitle('');
        setShowBranchSlider(true);
        setSelectedBranches([]);
      }
    } else {
      // Default values if no initial data
      setTitle('Hero Section');
      setSubtitle('');
      setBackgroundImage('');
      setShowBranchSlider(true);
      setSelectedBranches([]);
      setImagePreview(null);
    }

    // Clear file input
    setImageFile(null);

    // Clear messages
    setError(null);
    setSuccess(null);
  };

  // Initialize form with data if available
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    resetForm();
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
      }
      return [...prev, branchId];
    });
  };

  const validateForm = () => {
    // Title is required
    if (!title.trim()) {
      setError('Section title is required');
      setSuccess(null);
      return false;
    }

    // If showBranchSlider is true, check if there are branches available
    if (showBranchSlider && branches.length === 0) {
      setError('You need to create branches first before enabling the branch slider');
      setSuccess(null);
      return false;
    }

    // Clear any previous errors
    setError(null);
    return true;
  };

  const handleFormSubmit = async () => {
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

      // Show success message
      setSuccess('Hero section saved successfully!');

      setLoading(false);
    } catch (err) {
      console.error('Error saving hero section:', err);
      setError('Failed to save hero section. Please try again.');
      setSuccess(null);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  return (
    <div className="form-container animate-fade-in">
      {/* Confirmation Dialog */}
      <ConfirmDialog
        show={showConfirmDialog}
        title="Save Hero Section"
        message="Are you sure you want to save these changes to the Hero Section?"
        confirmText="Save Changes"
        cancelText="Cancel"
        onConfirm={() => {
          setShowConfirmDialog(false);
          handleFormSubmit();
        }}
        onCancel={() => setShowConfirmDialog(false)}
        confirmIcon="save"
      />

      <div className="form-header">
        <h2 className="form-title">Hero Section Configuration</h2>
        <p className="form-subtitle">Configure the hero section that appears at the top of your homepage</p>
      </div>

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
        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label htmlFor="title" className="form-label form-label-required">Section Title</label>
              <input
                type="text"
                id="title"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subtitle" className="form-label">Subtitle</label>
              <textarea
                id="subtitle"
                className="form-control"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                rows="3"
                placeholder="Enter a subtitle for the hero section..."
                style={{ borderLeft: '3px solid var(--accent)' }}
              />
              <span className="form-help-text">This text will appear below the main title in the hero sectio</span>
            </div>
          </div>

          <div className="form-col">
            <div className="form-group">
              <label htmlFor="background-image" className="form-label">Background Image</label>
              <div className="image-upload-container">
                {(imagePreview || backgroundImage) ? (
                  <div className="image-preview">
                    <img
                      src={imagePreview || getImageUrl(backgroundImage)}
                      alt="Background Preview"
                      onError={(e) => handleImageError(e)}
                    />
                  </div>
                ) : (
                  <div className="image-preview">
                    <FontAwesomeIcon icon="image" size="3x" style={{ color: 'var(--primary)' }} />
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
                  <label htmlFor="background-image" className="file-input-label">
                    <FontAwesomeIcon icon="upload" /> Choose Image
                  </label>
                </div>
                <span className="form-help-text">Recommended size: 1920x1080px. Max file size: 5MB</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="form-switch">
            <input
              type="checkbox"
              id="showBranchSlider"
              className="form-switch-input"
              checked={showBranchSlider}
              onChange={(e) => setShowBranchSlider(e.target.checked)}
            />
            <label htmlFor="showBranchSlider" className="form-switch-label">Show Branch Slider</label>
          </div>
          <p className="form-help-text">
            When enabled, the hero section will display a slider of church branches from the Branch Manager.
            This will be the main content in the hero section.
          </p>
        </div>

        {showBranchSlider && (
          <div className="form-group card">
            <div className="card-header">
              <h3 className="card-title">Select Branches to Display</h3>
            </div>
            <div className="card-body">
              <p className="form-help-text">
                Select which branches to display in the slider. If none are selected, all branches will be shown.
                Branches are managed in the Branch Manager section of the admin panel.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {branches.length > 0 ? (
                  branches.map(branch => (
                    <div key={branch._id} className="form-check">
                      <input
                        type="checkbox"
                        id={`branch-${branch._id}`}
                        className="form-check-input"
                        checked={selectedBranches.includes(branch._id)}
                        onChange={() => handleBranchSelection(branch._id)}
                      />
                      <label htmlFor={`branch-${branch._id}`} className="form-check-label">{branch.name}</label>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center p-4">
                    <FontAwesomeIcon icon="exclamation-triangle" className="text-warning" />
                    <p>No branches available. <a href="/admin/branches" target="_blank" rel="noopener noreferrer" className="underline-effect">Create branches</a> first.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="form-actions" style={{
          background: 'linear-gradient(to right, rgba(var(--primary-rgb), 0.05), rgba(var(--accent-rgb), 0.05))',
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          marginTop: '30px'
        }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={resetForm}
            disabled={loading}
          >
            <FontAwesomeIcon icon="undo" /> Reset
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{
            minWidth: '180px'
          }}>
            {loading ? (
              <>
                <span className="spinner-small" /> Saving...
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
