import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getImageUrl, handleImageError } from '../../../utils/imageUtils';
import api from '../../../services/api';

const EventCalendarForm = ({ initialData, onSubmit }) => {
  const [title, setTitle] = useState('Event Calendar');
  const [introduction, setIntroduction] = useState('');
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize form with data if available
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || 'Event Calendar');
      
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
              setCalendarEvents(eventsWithIds);
            } else {
              // No events found, initialize with empty event
              setCalendarEvents([{
                title: '',
                date: '',
                startTime: '',
                endTime: '',
                location: '',
                description: '',
                tempId: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
              }]);
            }
          } else {
            // If not JSON, use as introduction and initialize with empty events array
            setIntroduction(initialData.content);
            setCalendarEvents([{
              title: '',
              date: '',
              startTime: '',
              endTime: '',
              location: '',
              description: '',
              tempId: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            }]);
          }
        } catch (err) {
          console.error('Error parsing event calendar data:', err);
          setError('Invalid event calendar data format');
          // Initialize with default structure
          setIntroduction('');
          setCalendarEvents([{
            title: '',
            date: '',
            startTime: '',
            endTime: '',
            location: '',
            description: '',
            tempId: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          }]);
        }
      } else {
        // Initialize with default structure
        setIntroduction('');
        setCalendarEvents([{
          title: '',
          date: '',
          startTime: '',
          endTime: '',
          location: '',
          description: '',
          tempId: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }]);
      }
    } else {
      // Initialize with default structure
      setIntroduction('');
      setCalendarEvents([{
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        tempId: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }]);
    }
  }, [initialData]);

  const handleEventChange = (index, field, value) => {
    const updatedEvents = [...calendarEvents];
    updatedEvents[index][field] = value;
    setCalendarEvents(updatedEvents);
  };

  const addEvent = () => {
    // Add a new event with a unique temporary ID to help with tracking
    setCalendarEvents([...calendarEvents, {
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      tempId: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }]);
  };

  const removeEvent = (index) => {
    const updatedEvents = [...calendarEvents];
    updatedEvents.splice(index, 1);
    setCalendarEvents(updatedEvents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    let isValid = true;

    // Check if all events have required fields
    for (const event of calendarEvents) {
      if (!event.title.trim() || !event.date.trim()) {
        setError('All events must have a title and date');
        isValid = false;
        break;
      }
    }

    if (isValid) {
      try {
        setLoading(true);
        
        // Filter out any empty events
        const validEvents = calendarEvents.filter(event =>
          event.title.trim() && event.date.trim()
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
          section: 'event_calendar',
          title: title,
          content: contentJson
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to save event calendar. Please try again.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="specialized-form event-calendar-form">
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
            placeholder="Introduce your event calendar..."
          />
        </div>
        
        <div className="form-group">
          <div className="events-header">
            <h3 id="calendar-events-label">Calendar Events</h3>
            <p className="form-help-text" aria-labelledby="calendar-events-label">
              Add events to your church calendar. Each event should have a title and date at minimum.
            </p>
          </div>
          
          {calendarEvents.map((event, index) => {
            // Use tempId as key if available, otherwise fallback to index
            const eventKey = event.tempId || `event-${index}`;
            
            return (
              <div key={eventKey} className="calendar-event-item">
                <div className="event-header">
                  <h4>Event #{index + 1}</h4>
                  {calendarEvents.length > 1 && (
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
                  <div className="form-group">
                    <label htmlFor={`event-title-${index}`}>Event Title</label>
                    <input
                      type="text"
                      id={`event-title-${index}`}
                      value={event.title}
                      onChange={(e) => handleEventChange(index, 'title', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`event-date-${index}`}>Date</label>
                      <input
                        type="date"
                        id={`event-date-${index}`}
                        value={event.date}
                        onChange={(e) => handleEventChange(index, 'date', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`event-start-time-${index}`}>Start Time</label>
                      <input
                        type="time"
                        id={`event-start-time-${index}`}
                        value={event.startTime}
                        onChange={(e) => handleEventChange(index, 'startTime', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`event-end-time-${index}`}>End Time</label>
                      <input
                        type="time"
                        id={`event-end-time-${index}`}
                        value={event.endTime}
                        onChange={(e) => handleEventChange(index, 'endTime', e.target.value)}
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
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`event-description-${index}`}>Description</label>
                    <textarea
                      id={`event-description-${index}`}
                      value={event.description}
                      onChange={(e) => handleEventChange(index, 'description', e.target.value)}
                      rows="3"
                    />
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
                <FontAwesomeIcon icon="save" /> Save Event Calendar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventCalendarForm;
