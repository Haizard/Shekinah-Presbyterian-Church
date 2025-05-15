import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getImageUrl, handleImageError } from '../../../utils/imageUtils';
import api from '../../../services/api';

const OurMottoForm = ({ initialData, onSubmit }) => {
  const [title, setTitle] = useState('Our Motto');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePath, setImagePath] = useState('');
  const [loading, setLoading] = useState(false);
  const [verseReference, setVerseReference] = useState('');
  const [mottoText, setMottoText] = useState('');

  // Initialize form with data if available
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || 'Our Motto');
      
      // Try to parse the content if it's JSON
      if (initialData.content) {
        try {
          if (initialData.content.startsWith('{') && initialData.content.endsWith('}')) {
            const parsedContent = JSON.parse(initialData.content);
            setMottoText(parsedContent.mottoText || '');
            setVerseReference(parsedContent.verseReference || '');
            setContent(parsedContent.explanation || '');
          } else {
            // If not JSON, use as regular content
            setContent(initialData.content);
          }
        } catch (err) {
          console.error('Error parsing motto content:', err);
          setContent(initialData.content);
        }
      }

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

    if (!mottoText.trim()) {
      setError('Motto text is required');
      return false;
    }

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

      // Create structured content object
      const contentObj = {
        mottoText: mottoText,
        verseReference: verseReference,
        explanation: content
      };

      // Convert to JSON string
      const contentJson = JSON.stringify(contentObj);

      // Call the parent's onSubmit with the form data
      onSubmit({
        section: 'motto',
        title: title,
        content: contentJson,
        image: finalImagePath
      });

      // Show success message
      setSuccess('Our Motto section saved successfully!');

      setLoading(false);
    } catch (err) {
      console.error('Error saving motto section:', err);
      setError('Failed to save motto section. Please try again.');
      setSuccess(null);
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
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
          <label htmlFor="mottoText">Motto Text</label>
          <input
            type="text"
            id="mottoText"
            value={mottoText}
            onChange={(e) => setMottoText(e.target.value)}
            placeholder="Enter your church's motto..."
            required
          />
          <p className="form-help-text">
            This is the main motto text that will be displayed prominently.
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="verseReference">Bible Verse Reference (Optional)</label>
          <input
            type="text"
            id="verseReference"
            value={verseReference}
            onChange={(e) => setVerseReference(e.target.value)}
            placeholder="e.g., Matthew 28:19-20"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Explanation</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            placeholder="Explain the meaning and significance of your motto..."
            required
          />
          <p className="form-help-text">
            You can use HTML tags to format your content. For example, use &lt;strong&gt;text&lt;/strong&gt; for bold text.
            <br />
            For a list, use: &lt;ul&gt;&lt;li&gt;Item 1&lt;/li&gt;&lt;li&gt;Item 2&lt;/li&gt;&lt;/ul&gt;
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="motto-image">Motto Image (Optional)</label>
          <div className="image-upload-container">
            {(imagePreview || imagePath) && (
              <div className="image-preview">
                <img
                  src={imagePreview || getImageUrl(imagePath)}
                  alt="Motto Preview"
                  onError={(e) => handleImageError(e)}
                />
              </div>
            )}

            <div className="upload-controls">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="motto-image"
                className="file-input"
              />
              <label htmlFor="motto-image" className="btn btn-secondary">
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
                <FontAwesomeIcon icon="save" /> Save Motto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OurMottoForm;
