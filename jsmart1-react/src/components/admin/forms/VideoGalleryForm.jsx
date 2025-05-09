import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getImageUrl, handleImageError } from '../../../utils/imageUtils';
import api from '../../../services/api';

const VideoGalleryForm = ({ initialData, onSubmit }) => {
  const [title, setTitle] = useState('Video Gallery');
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);

  useEffect(() => {
    // Initialize form with data if available
    if (initialData) {
      setTitle(initialData.title || 'Video Gallery');
      
      if (initialData.content) {
        try {
          // Try to parse the content as JSON
          if (initialData.content.startsWith('[') && initialData.content.endsWith(']')) {
            const parsedData = JSON.parse(initialData.content);
            setVideos(parsedData);
          } else {
            // If not JSON, initialize with empty array
            setVideos([{ title: '', thumbnail: '', url: '', date: '' }]);
          }
        } catch (err) {
          console.error('Error parsing video gallery data:', err);
          setError('Invalid video gallery data format');
          // Initialize with default structure
          setVideos([{ title: '', thumbnail: '', url: '', date: '' }]);
        }
      } else {
        // Initialize with default structure
        setVideos([{ title: '', thumbnail: '', url: '', date: '' }]);
      }
    } else {
      // Initialize with default structure
      setVideos([{ title: '', thumbnail: '', url: '', date: '' }]);
    }
  }, [initialData]);

  const handleVideoChange = (index, field, value) => {
    const updatedVideos = [...videos];
    updatedVideos[index][field] = value;
    setVideos(updatedVideos);
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

  const handleThumbnailUpload = async (index) => {
    setCurrentVideoIndex(index);
    
    try {
      if (imageFile) {
        const imagePath = await uploadImage();
        if (imagePath) {
          handleVideoChange(index, 'thumbnail', imagePath);
          setImageFile(null);
          setImagePreview(null);
        }
      }
    } catch (err) {
      setError('Failed to upload thumbnail. Please try again.');
    } finally {
      setCurrentVideoIndex(null);
    }
  };

  const addVideo = () => {
    setVideos([...videos, { title: '', thumbnail: '', url: '', date: '' }]);
  };

  const removeVideo = (index) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    setVideos(updatedVideos);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    let isValid = true;
    
    // Check if all videos have required fields
    for (const video of videos) {
      if (!video.title.trim() || !video.url.trim() || !video.date.trim()) {
        setError('All videos must have a title, URL, and date');
        isValid = false;
        break;
      }
    }
    
    if (isValid) {
      // Convert to JSON string
      const contentJson = JSON.stringify(videos);
      
      // Call the parent's onSubmit with the form data
      onSubmit({
        section: 'video_gallery',
        title: title,
        content: contentJson
      });
    }
  };

  return (
    <div className="specialized-form video-gallery-form">
      {error && (
        <div className="alert alert-danger">
          <FontAwesomeIcon icon="exclamation-circle" />
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Gallery Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Videos</label>
          <p className="form-help-text">
            Add videos to your gallery. Each video should have a title, thumbnail, URL, and date.
          </p>
          
          {videos.map((video, index) => (
            <div key={index} className="video-item">
              <div className="video-header">
                <h4>Video #{index + 1}</h4>
                {videos.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeVideo(index)}
                  >
                    <FontAwesomeIcon icon="trash-alt" /> Remove
                  </button>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={video.title}
                    onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                    placeholder="e.g. Sunday Worship Service"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="text"
                    value={video.date}
                    onChange={(e) => handleVideoChange(index, 'date', e.target.value)}
                    placeholder="e.g. June 4, 2023"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Video URL</label>
                <input
                  type="url"
                  value={video.url}
                  onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                  placeholder="e.g. https://www.youtube.com/watch?v=example"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Thumbnail</label>
                <div className="thumbnail-upload">
                  {video.thumbnail && (
                    <div className="image-preview">
                      <img
                        src={getImageUrl(video.thumbnail)}
                        alt={video.title}
                        onError={(e) => handleImageError(e)}
                      />
                    </div>
                  )}
                  
                  <div className="upload-controls">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      id={`thumbnail-${index}`}
                      className="file-input"
                    />
                    <label htmlFor={`thumbnail-${index}`} className="btn btn-secondary">
                      <FontAwesomeIcon icon="upload" /> Choose Image
                    </label>
                    
                    {imageFile && currentVideoIndex === null && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleThumbnailUpload(index)}
                      >
                        <FontAwesomeIcon icon="save" /> Upload Thumbnail
                      </button>
                    )}
                    
                    {currentVideoIndex === index && (
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
            onClick={addVideo}
          >
            <FontAwesomeIcon icon="plus" /> Add Video
          </button>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <FontAwesomeIcon icon="save" /> Save Gallery
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoGalleryForm;
