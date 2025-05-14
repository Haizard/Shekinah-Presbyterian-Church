import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getImageUrl, handleImageError } from '../../../utils/imageUtils';
import api from '../../../services/api';

const SpecialEventsForm = ({ initialData, onSubmit }) => {
  const [title, setTitle] = useState('Special Events');
  const [introduction, setIntroduction] = useState('');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize form with data if available
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || 'Special Events');
      
      if (initialData.content) {
        try {
          // Try to parse the content as JSON
          if (initialData.content.startsWith('{') && initialData.content.endsWith('}')) {
            const parsedData = JSON.parse(initialData.content);
            setIntroduction(parsedData.introduction || '');

            // Add tempId to each event for stable keys
            if (parsedData.events && Array.isArray(parsedData.events) && parsedData.events.length > 0) {
              const eventsWithIds = parsedData.events.map((event, index) => ({
                ...event,
                tempId: `existing-${index}-${Date.now()}`
              }));
              setEvents(eventsWithIds);
            } else {
              // No events found, initialize with empty event
              setEvents([{
                name: '',
                date: '',
                time: '',
                location: '',
                description: '',
                image: '',
                tempId: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
              }]);
            }
          } else {
            // If not JSON, use as introduction and initialize with empty events array
            setIntroduction(initialData.content);
            setEvents([{
              name: '',
              date: '',
              time: '',
              location: '',
              description: '',
              image: '',
              tempId: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            }]);
          }
        } catch (err) {
          console.error('Error parsing special events data:', err);
          setError('Invalid special events data format');
          // Initialize with default structure
          setIntroduction('');
          setEvents([{
            name: '',
            date: '',
            time: '',
            location: '',
            description: '',
            image: '',
            tempId: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          }]);
        }
      } else {
        // Initialize with default structure
        setIntroduction('');
        setEvents([{
          name: '',
          date: '',
          time: '',
          location: '',
          description: '',
          image: '',
          tempId: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }]);
      }
    } else {
      // Initialize with default structure
      setIntroduction('');
      setEvents([{
        name: '',
        date: '',
        time: '',
        location: '',
        description: '',
        image: '',
        tempId: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }]);
    }
  }, [initialData]);

  const handleEventChange = (index, field, value) => {
    const updatedEvents = [...events];
    updatedEvents[index][field] = value;
    setEvents(updatedEvents);
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

  const handleEventImageUpload = async (index) => {
    setCurrentEventIndex(index);

    try {
      if (imageFile) {
        const imagePath = await uploadImage();
        if (imagePath) {
          handleEventChange(index, 'image', imagePath);
          setImageFile(null);
          setImagePreview(null);
        }
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setCurrentEventIndex(null);
    }
  };

  const addEvent = () => {
    // Add a new event with a unique temporary ID to help with tracking
    setEvents([...events, {
      name: '',
      date: '',
      time: '',
      location: '',
      description: '',
      image: '',
      tempId: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }]);
  };

  const removeEvent = (index) => {
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    let isValid = true;

    // Check if all events have required fields
    for (const event of events) {
      if (!event.name.trim() || !event.date.trim() || !event.time.trim() || !event.location.trim()) {
        setError('All events must have a name, date, time, and location');
        isValid = false;
        break;
      }
    }

    if (isValid) {
      try {
        setLoading(true);
        
        // Filter out any empty events
        const validEvents = events.filter(event =>
          event.name.trim() && event.date.trim() && event.time.trim() && event.location.trim()
        );

        // Clean up the events data by removing temporary IDs
        const cleanedEvents = validEvents.map(event => {
          // Create a clean copy without tempId
          const { tempId, ...cleanEvent } = event;
          return cleanEvent;
        });

        // Create the content object
        const contentObj = {
          introduction: introduction,
          events: cleanedEvents
        };

        // Convert to JSON string
        const contentJson = JSON.stringify(contentObj);

        // Call the parent's onSubmit with the form data
        onSubmit({
          section: 'special_events',
          title: title,
          content: contentJson
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to save special events. Please try again.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="specialized-form special-events-form">
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
            placeholder="Introduce your special events..."
          />
        </div>
        
        <div className="form-group">
          <div className="events-header">
            <h3 id="events-label">Special Events</h3>
            <p className="form-help-text" aria-labelledby="events-label">
              Add special events for your church. Each event should have a name, date, time, and location.
            </p>
          </div>
          
          {events.map((event, index) => {
            // Use tempId as key if available, otherwise fallback to index
            const eventKey = event.tempId || `event-${index}`;
            
            return (
              <div key={eventKey} className="event-item">
                <div className="event-header">
                  <h4>Event #{index + 1}</h4>
                  {events.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => removeEvent(index)}
                    >
                      <FontAwesomeIcon icon="trash-alt" /> Remove
                    </button>
                  )}
                </div>
                
                <div className="event-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`event-name-${index}`}>Event Name</label>
                      <input
                        type="text"
                        id={`event-name-${index}`}
                        value={event.name}
                        onChange={(e) => handleEventChange(index, 'name', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`event-date-${index}`}>Date</label>
                      <input
                        type="text"
                        id={`event-date-${index}`}
                        value={event.date}
                        onChange={(e) => handleEventChange(index, 'date', e.target.value)}
                        placeholder="e.g. June 15-17, 2023"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`event-time-${index}`}>Time</label>
                      <input
                        type="text"
                        id={`event-time-${index}`}
                        value={event.time}
                        onChange={(e) => handleEventChange(index, 'time', e.target.value)}
                        placeholder="e.g. 9:00 AM - 4:00 PM"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`event-location-${index}`}>Location</label>
                    <input
                      type="text"
                      id={`event-location-${index}`}
                      value={event.location}
                      onChange={(e) => handleEventChange(index, 'location', e.target.value)}
                      placeholder="e.g. Main Sanctuary"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`event-description-${index}`}>Description</label>
                    <textarea
                      id={`event-description-${index}`}
                      value={event.description}
                      onChange={(e) => handleEventChange(index, 'description', e.target.value)}
                      rows="3"
                      placeholder="Describe the event..."
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Event Image</label>
                    <div className="image-upload-container">
                      {event.image && (
                        <div className="image-preview">
                          <img
                            src={getImageUrl(event.image)}
                            alt={event.name}
                            onError={(e) => handleImageError(e)}
                          />
                        </div>
                      )}
                      
                      <div className="upload-controls">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          id={`event-image-${eventKey}`}
                          className="file-input"
                        />
                        <label htmlFor={`event-image-${eventKey}`} className="btn btn-secondary">
                          <FontAwesomeIcon icon="upload" /> Choose Image
                        </label>
                        
                        {imageFile && currentEventIndex === null && (
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleEventImageUpload(index)}
                          >
                            <FontAwesomeIcon icon="save" /> Upload Image
                          </button>
                        )}
                        
                        {currentEventIndex === index && (
                          <div className="spinner-small" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          <button
            type="button"
            className="btn btn-secondary mt-3"
            onClick={addEvent}
          >
            <FontAwesomeIcon icon="plus" /> Add Event
          </button>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span> Saving...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon="save" /> Save Special Events
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SpecialEventsForm;
