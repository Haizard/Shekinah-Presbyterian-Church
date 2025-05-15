import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import ContentContext from '../context/ContentContext';
import api from '../services/api';
import '../styles/WeeklySchedule.css';

/**
 * Weekly Schedule component that displays church schedule information
 * Uses the exact same pattern as Leadership component
 * Directly fetches and renders data from the API
 */
const WeeklySchedule = () => {
  // State for schedule data
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the content context for creating sample data
  const { createOrUpdateContent, refreshContent } = useContext(ContentContext);

  // Fetch schedule data directly from API
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        // Direct API call similar to Leadership component
        const data = await api.content.getBySection('weekly_schedule');

        if (data?.content) {
          setScheduleData(data);
        } else {
          setScheduleData(null);
        }
        setError(null);
      } catch (err) {
        setError('Failed to load weekly schedule data');
        setScheduleData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, []);

  // Function to create sample schedule content for testing (only available in development)
  const createSampleScheduleContent = async () => {
    try {
      if (!createOrUpdateContent) {
        alert('Cannot create content: createOrUpdateContent function not available');
        return;
      }

      // Create sample schedule data
      const sampleScheduleData = {
        section: 'weekly_schedule',
        title: 'Weekly Schedule',
        content: JSON.stringify([
          {
            day: 'Sunday',
            events: [
              { name: 'Sunday School', time: '9:00 AM - 10:00 AM', location: 'Education Building' },
              { name: 'Worship Service', time: '10:30 AM - 12:00 PM', location: 'Main Sanctuary' }
            ]
          },
          {
            day: 'Wednesday',
            events: [
              { name: 'Bible Study', time: '7:00 PM - 8:30 PM', location: 'Fellowship Hall' }
            ]
          },
          {
            day: 'Friday',
            events: [
              { name: 'Youth Fellowship', time: '4:00 PM - 6:00 PM', location: 'Youth Center' },
              { name: 'Choir Practice', time: '6:30 PM - 8:30 PM', location: 'Main Sanctuary' }
            ]
          }
        ])
      };

      // Create or update the schedule content
      const result = await createOrUpdateContent(sampleScheduleData);

      if (result) {
        alert('Sample schedule content created successfully! Refreshing...');
        refreshContent();
        // Refresh the data
        fetchScheduleData();
      } else {
        alert('Failed to create sample schedule content.');
      }
    } catch (error) {
      console.error('Error creating sample schedule content:', error);
      alert(`Error creating sample schedule content: ${error.message}`);
    }
  };

  return (
    <div className="weekly-schedule-section">
      {/* Admin controls for development environment only */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="admin-controls" style={{ marginBottom: '1rem', textAlign: 'right' }}>
          <button
            type="button"
            onClick={createSampleScheduleContent}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#e6f7ff',
              border: '1px solid #91d5ff',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            Create Sample Schedule Data
          </button>
        </div>
      )}

      {/* Display loading state */}
      {loading && (
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading schedule data...</p>
        </div>
      )}

      {/* Display error state */}
      {error && !loading && (
        <div className="error-container">
          <p>{error}</p>
        </div>
      )}

      {/* Display schedule data if available */}
      {!loading && !error && scheduleData?.content && (
        <div className="weekly-schedule">
          {(() => {
            // Parse content for schedule details
            let parsedData = [];
            try {
              if (typeof scheduleData.content === 'string') {
                if (scheduleData.content.startsWith('[') && scheduleData.content.endsWith(']')) {
                  parsedData = JSON.parse(scheduleData.content);
                }
              }
            } catch (error) {
              return null; // Return nothing if parsing fails
            }

            // If we have valid schedule data, render it
            if (Array.isArray(parsedData) && parsedData.length > 0) {
              // Create a flat array of all events
              const allEvents = [];
              for (const day of parsedData) {
                if (day.events && Array.isArray(day.events)) {
                  for (const event of day.events) {
                    allEvents.push({
                      day: day.day,
                      name: event.name || event.title,
                      time: event.time,
                      location: event.location
                    });
                  }
                }
              }

              // If no events are found after processing, return null
              if (allEvents.length === 0) {
                return null;
              }

              return (
                <div className="schedule-container">
                  <h3>Weekly Schedule</h3>
                  <div className="schedule-grid-wrapper">
                    {allEvents.map((event, index) => (
                      <div className="schedule-item-card" key={`schedule-${event.day}-${event.name}-${index}`}>
                        <div className="schedule-item-day">{event.day}</div>
                        <div className="schedule-item-name">{event.name}</div>
                        <div className="schedule-item-details">
                          <p><FontAwesomeIcon icon={faClock} /> {event.time}</p>
                          <p><FontAwesomeIcon icon={faMapMarkerAlt} /> {event.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // Return null if no valid data
            return null;
          })()}
        </div>
      )}
    </div>
  );
};

export default WeeklySchedule;
