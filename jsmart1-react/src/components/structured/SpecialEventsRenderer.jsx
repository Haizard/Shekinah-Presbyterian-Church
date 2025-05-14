import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';
import '../../styles/SpecialEvents.css';

/**
 * Component for rendering the "special_events" structured content
 * Follows the same pattern as LeadershipRenderer
 */
const SpecialEventsRenderer = ({ content }) => {
  // Parse content if it's a string
  let eventsData;
  try {
    eventsData = typeof content === 'string' ? JSON.parse(content) : content;

    // Validate the structure of eventsData
    if (!eventsData || typeof eventsData !== 'object') {
      console.error('Invalid special events data structure:', eventsData);
      return null;
    }
  } catch (error) {
    console.error('Error parsing special events data:', error);
    // Return null to show nothing if parsing fails
    return null;
  }

  // If we have valid events data with events array, render it
  if (eventsData?.events && Array.isArray(eventsData.events) && eventsData.events.length > 0) {
    return (
      <div className="special-events-content">
        {eventsData.introduction && (
          <div className="special-events-intro">
            <p>{eventsData.introduction}</p>
          </div>
        )}

        <div className="special-events-grid">
          {eventsData.events.map((event, index) => (
            <div className="special-event-card" key={`event-${event.name}-${index}`}>
              {event.image && (
                <div className="event-image">
                  <img
                    src={getImageUrl(event.image)}
                    alt={event.name}
                    onError={(e) => handleImageError(e)}
                  />
                </div>
              )}

              <div className="event-details">
                <h3>{event.name}</h3>

                <div className="event-meta">
                  {event.date && (
                    <p><FontAwesomeIcon icon={faCalendarAlt} /> {event.date}</p>
                  )}

                  {event.time && (
                    <p><FontAwesomeIcon icon={faClock} /> {event.time}</p>
                  )}

                  {event.location && (
                    <p><FontAwesomeIcon icon={faMapMarkerAlt} /> {event.location}</p>
                  )}
                </div>

                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="special-events-footer">
          <Link to="/events" className="btn btn-primary">View All Events</Link>
        </div>
      </div>
    );
  }

  // Return null if no valid data
  return null;
};

export default SpecialEventsRenderer;
