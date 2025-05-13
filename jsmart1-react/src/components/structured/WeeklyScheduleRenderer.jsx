import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

/**
 * Component for rendering the "weekly_schedule" structured content
 */
const WeeklyScheduleRenderer = ({ content }) => {
  // Parse content if it's a string
  let scheduleData;
  try {
    scheduleData = typeof content === 'string' ? JSON.parse(content) : content;
  } catch (error) {
    console.error('Error parsing schedule data:', error);
    return <div>Error loading schedule data</div>;
  }

  // Ensure we have an array of days
  if (!Array.isArray(scheduleData)) {
    if (scheduleData?.schedule && Array.isArray(scheduleData.schedule)) {
      scheduleData = scheduleData.schedule;
    } else {
      scheduleData = scheduleData ? [scheduleData] : [];
    }
  }

  // Create a flat array of all events
  const allEvents = [];
  scheduleData.forEach(day => {
    if (day.events && Array.isArray(day.events)) {
      day.events.forEach(event => {
        allEvents.push({
          day: day.day,
          name: event.name || event.title,
          time: event.time,
          location: event.location
        });
      });
    }
  });

  // Dummy data if no events are found
  if (allEvents.length === 0) {
    allEvents.push(
      { day: 'Sunday', name: 'Worship Service', time: '9:00 AM - 12:00 PM', location: 'Main Sanctuary' },
      { day: 'Sunday', name: 'Sunday School', time: '2:00 PM - 3:30 PM', location: 'Education Building' },
      { day: 'Wednesday', name: 'Bible Study', time: '6:00 PM - 8:00 PM', location: 'Fellowship Hall' },
      { day: 'Friday', name: 'Youth Fellowship', time: '4:00 PM - 6:00 PM', location: 'Youth Center' }
    );
  }

  return (
    <div className="schedule-container">
      <h3>Weekly Schedule</h3>
      <div className="schedule-grid-wrapper">
        {allEvents.map((event, index) => (
          <div className="schedule-item-card" key={index}>
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
