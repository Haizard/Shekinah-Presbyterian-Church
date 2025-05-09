import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getImageUrl, handleImageError } from '../../../utils/imageUtils';
import api from '../../../services/api';

const SermonSeriesForm = ({ initialData, onSubmit }) => {
  const [seriesList, setSeriesList] = useState([]);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(null);

  useEffect(() => {
    // Initialize form with data if available
    if (initialData && initialData.content) {
      try {
        // Try to parse the content as JSON
        if (initialData.content.startsWith('[') && initialData.content.endsWith(']')) {
          const parsedData = JSON.parse(initialData.content);
          setSeriesList(parsedData);
        } else {
          // If not JSON, initialize with empty array
          setSeriesList([{
            title: '',
            description: '',
            image: '',
            sermons: [{ title: '', scripture: '', date: '' }]
          }]);
        }
      } catch (err) {
        console.error('Error parsing sermon series data:', err);
        setError('Invalid sermon series data format');
        // Initialize with default structure
        setSeriesList([{
          title: '',
          description: '',
          image: '',
          sermons: [{ title: '', scripture: '', date: '' }]
        }]);
      }
    } else {
      // Initialize with default structure
      setSeriesList([{
        title: '',
        description: '',
        image: '',
        sermons: [{ title: '', scripture: '', date: '' }]
      }]);
    }
  }, [initialData]);

  const handleSeriesChange = (index, field, value) => {
    const updatedSeries = [...seriesList];
    updatedSeries[index][field] = value;
    setSeriesList(updatedSeries);
  };

  const handleSermonChange = (seriesIndex, sermonIndex, field, value) => {
    const updatedSeries = [...seriesList];
    updatedSeries[seriesIndex].sermons[sermonIndex][field] = value;
    setSeriesList(updatedSeries);
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

  const handleSeriesImageUpload = async (index) => {
    setCurrentSeriesIndex(index);
    
    try {
      if (imageFile) {
        const imagePath = await uploadImage();
        if (imagePath) {
          handleSeriesChange(index, 'image', imagePath);
          setImageFile(null);
          setImagePreview(null);
        }
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setCurrentSeriesIndex(null);
    }
  };

  const addSeries = () => {
    setSeriesList([...seriesList, {
      title: '',
      description: '',
      image: '',
      sermons: [{ title: '', scripture: '', date: '' }]
    }]);
  };

  const removeSeries = (index) => {
    const updatedSeries = [...seriesList];
    updatedSeries.splice(index, 1);
    setSeriesList(updatedSeries);
  };

  const addSermon = (seriesIndex) => {
    const updatedSeries = [...seriesList];
    updatedSeries[seriesIndex].sermons.push({ title: '', scripture: '', date: '' });
    setSeriesList(updatedSeries);
  };

  const removeSermon = (seriesIndex, sermonIndex) => {
    const updatedSeries = [...seriesList];
    updatedSeries[seriesIndex].sermons.splice(sermonIndex, 1);
    setSeriesList(updatedSeries);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    let isValid = true;
    
    // Check if all series have required fields
    for (const series of seriesList) {
      if (!series.title.trim() || !series.description.trim()) {
        setError('All sermon series must have a title and description');
        isValid = false;
        break;
      }
      
      // Check if all sermons have required fields
      for (const sermon of series.sermons) {
        if (!sermon.title.trim() || !sermon.scripture.trim() || !sermon.date.trim()) {
          setError('All sermons must have a title, scripture reference, and date');
          isValid = false;
          break;
        }
      }
      
      if (!isValid) break;
    }
    
    if (isValid) {
      // Convert to JSON string
      const contentJson = JSON.stringify(seriesList);
      
      // Call the parent's onSubmit with the form data
      onSubmit({
        section: 'sermon_series',
        title: 'Sermon Series',
        content: contentJson
      });
    }
  };

  return (
    <div className="specialized-form sermon-series-form">
      {error && (
        <div className="alert alert-danger">
          <FontAwesomeIcon icon="exclamation-circle" />
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Sermon Series</label>
          <p className="form-help-text">
            Add your sermon series and the sermons within each series.
          </p>
          
          {seriesList.map((series, seriesIndex) => (
            <div key={seriesIndex} className="series-item">
              <div className="series-header">
                <h4>Series #{seriesIndex + 1}</h4>
                {seriesList.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeSeries(seriesIndex)}
                  >
                    <FontAwesomeIcon icon="trash-alt" /> Remove Series
                  </button>
                )}
              </div>
              
              <div className="form-group">
                <label>Series Title <span className="required">*</span></label>
                <input
                  type="text"
                  value={series.title}
                  onChange={(e) => handleSeriesChange(seriesIndex, 'title', e.target.value)}
                  placeholder="e.g. Faith That Works"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description <span className="required">*</span></label>
                <textarea
                  value={series.description}
                  onChange={(e) => handleSeriesChange(seriesIndex, 'description', e.target.value)}
                  placeholder="e.g. A study through the book of James"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Series Image</label>
                <div className="series-image-upload">
                  {series.image && (
                    <div className="image-preview">
                      <img
                        src={getImageUrl(series.image)}
                        alt={series.title}
                        onError={(e) => handleImageError(e)}
                      />
                    </div>
                  )}
                  
                  <div className="upload-controls">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      id={`series-image-${seriesIndex}`}
                      className="file-input"
                    />
                    <label htmlFor={`series-image-${seriesIndex}`} className="btn btn-secondary">
                      <FontAwesomeIcon icon="upload" /> Choose Image
                    </label>
                    
                    {imageFile && currentSeriesIndex === null && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleSeriesImageUpload(seriesIndex)}
                      >
                        <FontAwesomeIcon icon="save" /> Upload Image
                      </button>
                    )}
                    
                    {currentSeriesIndex === seriesIndex && (
                      <div className="spinner-small"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="sermons-container">
                <label>Sermons in this Series</label>
                {series.sermons.map((sermon, sermonIndex) => (
                  <div key={sermonIndex} className="sermon-item">
                    <div className="sermon-header">
                      <h5>Sermon #{sermonIndex + 1}</h5>
                      {series.sermons.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => removeSermon(seriesIndex, sermonIndex)}
                        >
                          <FontAwesomeIcon icon="times" />
                        </button>
                      )}
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Title <span className="required">*</span></label>
                        <input
                          type="text"
                          value={sermon.title}
                          onChange={(e) => handleSermonChange(seriesIndex, sermonIndex, 'title', e.target.value)}
                          placeholder="e.g. Faith and Trials"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Scripture <span className="required">*</span></label>
                        <input
                          type="text"
                          value={sermon.scripture}
                          onChange={(e) => handleSermonChange(seriesIndex, sermonIndex, 'scripture', e.target.value)}
                          placeholder="e.g. James 1:1-12"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Date <span className="required">*</span></label>
                        <input
                          type="text"
                          value={sermon.date}
                          onChange={(e) => handleSermonChange(seriesIndex, sermonIndex, 'date', e.target.value)}
                          placeholder="e.g. June 4, 2023"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => addSermon(seriesIndex)}
                >
                  <FontAwesomeIcon icon="plus" /> Add Sermon
                </button>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            className="btn btn-secondary mt-3"
            onClick={addSeries}
          >
            <FontAwesomeIcon icon="plus" /> Add Series
          </button>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <FontAwesomeIcon icon="save" /> Save Sermon Series
          </button>
        </div>
      </form>
    </div>
  );
};

export default SermonSeriesForm;
