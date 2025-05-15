import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const WeeklyScheduleForm = ({ initialData, onSubmit }) => {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize form with data if available
    if (initialData && initialData.content) {
      try {
        // Try to parse the content as JSON
        if (initialData.content.startsWith('[') && initialData.content.endsWith(']')) {
          const parsedData = JSON.parse(initialData.content);
          setScheduleItems(parsedData);
        } else {
          // If not JSON, initialize with empty array
          setScheduleItems([
            { day: 'Sunday', events: [{ name: '', time: '', location: '' }] },
            { day: 'Wednesday', events: [{ name: '', time: '', location: '' }] }
          ]);
        }
      } catch (err) {
        console.error('Error parsing schedule data:', err);
        setError('Invalid schedule data format');
        // Initialize with default structure
        setScheduleItems([
          { day: 'Sunday', events: [{ name: '', time: '', location: '' }] },
          { day: 'Wednesday', events: [{ name: '', time: '', location: '' }] }
        ]);
      }
    } else {
      // Initialize with default structure
      setScheduleItems([
        { day: 'Sunday', events: [{ name: '', time: '', location: '' }] },
        { day: 'Wednesday', events: [{ name: '', time: '', location: '' }] }
      ]);
    }
  }, [initialData]);

  const handleDayChange = (index, value) => {
    const updatedItems = [...scheduleItems];
    updatedItems[index].day = value;
    setScheduleItems(updatedItems);
  };

  const handleEventChange = (dayIndex, eventIndex, field, value) => {
    const updatedItems = [...scheduleItems];
    updatedItems[dayIndex].events[eventIndex][field] = value;
    setScheduleItems(updatedItems);
  };

  const addEvent = (dayIndex) => {
    const updatedItems = [...scheduleItems];
    updatedItems[dayIndex].events.push({ name: '', time: '', location: '' });
    setScheduleItems(updatedItems);
  };

  const removeEvent = (dayIndex, eventIndex) => {
    const updatedItems = [...scheduleItems];
    updatedItems[dayIndex].events.splice(eventIndex, 1);
    setScheduleItems(updatedItems);
  };

  const addDay = () => {
    setScheduleItems([...scheduleItems, { day: '', events: [{ name: '', time: '', location: '' }] }]);
  };

  const removeDay = (index) => {
    const updatedItems = [...scheduleItems];
    updatedItems.splice(index, 1);
    setScheduleItems(updatedItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    let isValid = true;
    
    // Check if all days have a name
    for (const item of scheduleItems) {
      if (!item.day.trim()) {
        setError('All days must have a name');
        isValid = false;
        break;
      }
      
      // Check if all events have required fields
      for (const event of item.events) {
        if (!event.name.trim() || !event.time.trim() || !event.location.trim()) {
          setError('All events must have a name, time, and location');
          isValid = false;
          break;
        }
      }
      
      if (!isValid) break;
    }
    
    if (isValid) {
      // Convert to JSON string
      const contentJson = JSON.stringify(scheduleItems);
      
      // Call the parent's onSubmit with the form data
      onSubmit({
        section: 'weekly_schedule',
        title: 'Weekly Schedule',
        content: contentJson
      });
    }
  };

  return (
    <div className="specialized-form weekly-schedule-form">
      {error && (
        <div className="alert alert-danger">
          <FontAwesomeIcon icon="exclamation-circle" />
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Weekly Schedule</label>
          <p className="form-help-text">
            Add the days and events for your weekly schedule.
          </p>
          
          {scheduleItems.map((day, dayIndex) => (
            <div key={dayIndex} className="schedule-day">
              <div className="day-header">
                <div className="form-group">
                  <label>Day</label>
                  <input
                    type="text"
                    value={day.day}
                    onChange={(e) => handleDayChange(dayIndex, e.target.value)}
                    placeholder="e.g. Sunday"
                    required
                  />
                </div>
                
                {scheduleItems.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeDay(dayIndex)}
                  >
                    <FontAwesomeIcon icon="trash-alt" /> Remove Day
                  </button>
                )}
              </div>
              
              <div className="events-container">
                <label>Events</label>
                {day.events.map((event, eventIndex) => (
                  <div key={eventIndex} className="event-item">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Event Name</label>
                        <input
                          type="text"
                          value={event.name}
                          onChange={(e) => handleEventChange(dayIndex, eventIndex, 'name', e.target.value)}
                          placeholder="e.g. Worship Service"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Time</label>
                        <input
                          type="text"
                          value={event.time}
                          onChange={(e) => handleEventChange(dayIndex, eventIndex, 'time', e.target.value)}
                          placeholder="e.g. 9:00 AM - 12:00 PM"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Location</label>
                        <input
                          type="text"
                          value={event.location}
                          onChange={(e) => handleEventChange(dayIndex, eventIndex, 'location', e.target.value)}
                          placeholder="e.g. Main Sanctuary"
                          required
                        />
                      </div>
                      
                      {day.events.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger remove-event"
                          onClick={() => removeEvent(dayIndex, eventIndex)}
                        >
                          <FontAwesomeIcon icon="times" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => addEvent(dayIndex)}
                >
                  <FontAwesomeIcon icon="plus" /> Add Event
                </button>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            className="btn btn-secondary mt-3"
            onClick={addDay}
          >
            <FontAwesomeIcon icon="plus" /> Add Day
          </button>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <FontAwesomeIcon icon="save" /> Save Schedule
          </button>
        </div>
      </form>
    </div>
  );
};

export default WeeklyScheduleForm;
