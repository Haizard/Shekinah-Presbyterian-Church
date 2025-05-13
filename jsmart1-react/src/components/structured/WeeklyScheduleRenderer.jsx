import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

/**
 * Component for rendering the "weekly_schedule" structured content
 */
const WeeklyScheduleRenderer = ({ content }) => {
  console.log('WeeklyScheduleRenderer received content:', content);

  // Handle different content formats
  let parsedContent;

  // If content is a string, try to parse it
  if (typeof content === 'string') {
    try {
      parsedContent = JSON.parse(content);
      console.log('WeeklyScheduleRenderer parsed string content:', parsedContent);
    } catch (error) {
      console.error('Error parsing WeeklySchedule content:', error);
      return <div>Error rendering content: Invalid JSON format</div>;
    }
  } else {
    // If content is already an object, use it directly
    parsedContent = content;
    console.log('WeeklyScheduleRenderer using object content directly:', parsedContent);
  }

  // If parsedContent is not an array, check if it's nested in a property
  if (!Array.isArray(parsedContent)) {
    // Some content might be structured as { schedule: [...] }
    if (parsedContent?.schedule && Array.isArray(parsedContent.schedule)) {
      parsedContent = parsedContent.schedule;
      console.log('WeeklyScheduleRenderer using nested schedule array:', parsedContent);
    } else {
      // Try to convert to array if it's a single object
      if (typeof parsedContent === 'object' && parsedContent !== null) {
        console.log('WeeklyScheduleRenderer converting single object to array:', parsedContent);
        parsedContent = [parsedContent];
      } else {
        console.error('WeeklySchedule content is not an array:', parsedContent);
        return <div>Invalid content format: Expected an array of schedule days</div>;
      }
    }
  }

  return (
    <div className="schedule-container">
      <h3>Weekly Schedule</h3>
      <div className="schedule-grid">
        {parsedContent.map((day, index) => (
          <div className="schedule-item" key={`day-${day.day || index}`}>
            <div className="day">{day.day}</div>
            <div className="events">
              {day.events?.map((event, eventIndex) => (
                <div className="event" key={`event-${day.day}-${event.title || event.name || eventIndex}`}>
                  <div className="event-name">{event.title || event.name}</div>
                  <div className="event-details">
                    <p><FontAwesomeIcon icon={faClock} /> {event.time}</p>
                    {event.location && (
                      <p><FontAwesomeIcon icon={faMapMarkerAlt} /> {event.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyScheduleRenderer;
