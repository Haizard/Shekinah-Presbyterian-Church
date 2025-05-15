import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

/**
 * Component for rendering the "weekly_schedule" structured content
 * Follows the same pattern as LeadershipRenderer
 */
const WeeklyScheduleRenderer = ({ content }) => {
  // Parse content if it's a string
  let scheduleData;
  try {
    scheduleData = typeof content === 'string' ? JSON.parse(content) : content;
  } catch (error) {
    // Return null to show nothing if parsing fails
    return null;
  }

  // Ensure we have an array of days
  if (!Array.isArray(scheduleData)) {
    if (scheduleData?.schedule && Array.isArray(scheduleData.schedule)) {
      scheduleData = scheduleData.schedule;
    } else {
      // Return null if data is invalid or empty
      return null;
    }
  }

  // If we have no schedule items, return null
  if (scheduleData.length === 0) {
    return null;
  }

  // Create a flat array of all events
  const allEvents = [];
  for (const day of scheduleData) {
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
};

export default WeeklyScheduleRenderer;
