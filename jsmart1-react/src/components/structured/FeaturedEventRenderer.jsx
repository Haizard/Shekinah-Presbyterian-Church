import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

/**
 * Component for rendering the "featured_event" structured content
 * Enhanced with better error handling and default content
 */
const FeaturedEventRenderer = ({ content, image }) => {
  // Define a high-quality default event to use as fallback
  const defaultEvent = {
    title: 'Sunday Worship Service',
    description: 'Join us for our weekly worship service with praise, prayer, and powerful teaching from God\'s Word.',
    date: getNextSunday(),
    time: '10:00 AM - 12:00 PM',
    location: 'Main Sanctuary',
    link: '/events',
    buttonText: 'Learn More'
  };

  // Helper function to get the next Sunday's date
  function getNextSunday() {
    const today = new Date();
    const daysUntilSunday = 7 - today.getDay();
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + (daysUntilSunday === 7 ? 0 : daysUntilSunday));
    return nextSunday;
  }

  // For debugging only - will be removed in production
  console.log('FeaturedEventRenderer received content:', content);
  console.log('FeaturedEventRenderer received image:', image);

  // Handle different content formats
  let parsedContent;

  // Special handling for the "[object Object]" format
  if (typeof content === 'string' && content.includes('[object Object]')) {
    console.log('Content appears to be a stringified object that lost its structure');
    parsedContent = defaultEvent;
  }
  // If content is a string, try to parse it
  else if (typeof content === 'string') {
    try {
      // Only try to parse if it looks like JSON (starts with { and ends with })
      if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
        parsedContent = JSON.parse(content);
        console.log('FeaturedEventRenderer parsed string content:', parsedContent);
      } else if (content.includes('Default content for')) {
        // Handle default content case - use our better defaults
        console.log('Using default event content instead of placeholder text');
        parsedContent = defaultEvent;
      } else {
        // If it's a string but not JSON, use it as the event description
        parsedContent = {
          ...defaultEvent,
          description: content
        };
      }
    } catch (error) {
      console.error('Error parsing FeaturedEvent content:', error);
      // If parsing fails, use default content
      parsedContent = defaultEvent;
    }
  } else if (typeof content === 'object' && content !== null) {
    // If content is already an object, use it directly
    parsedContent = content;
    console.log('FeaturedEventRenderer using object content directly:', parsedContent);
  } else {
    // For null or undefined, use default
    parsedContent = defaultEvent;
  }

  // Ensure parsedContent has all required properties by merging with defaults
  parsedContent = {
    ...defaultEvent,
    ...parsedContent
  };

  // Format the date if it exists
  let formattedDate = '';
  if (parsedContent.date) {
    try {
      const date = new Date(parsedContent.date);
      formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      formattedDate = parsedContent.date;
    }
  }

  return (
    <div className="featured-event">
      <div className="featured-event-content">
        <h3 className="event-title">{parsedContent.title}</h3>

        <div className="event-details">
          {formattedDate && (
            <div className="event-date">
              <FontAwesomeIcon icon={faCalendarAlt} />
              <span>{formattedDate}</span>
            </div>
          )}

          {parsedContent.time && (
            <div className="event-time">
              <FontAwesomeIcon icon={faClock} />
              <span>{parsedContent.time}</span>
            </div>
          )}

          {parsedContent.location && (
            <div className="event-location">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>{parsedContent.location}</span>
            </div>
          )}
        </div>

        {parsedContent.description && (
          <div className="event-description">
            <p>{parsedContent.description}</p>
          </div>
        )}

        <div className="event-actions">
          {parsedContent.registerLink && (
            <Link to={parsedContent.registerLink} className="btn btn-primary">Register Now</Link>
          )}
          <Link to={parsedContent.link || '/events'} className="btn btn-secondary">Learn More</Link>
        </div>
      </div>

      {(image || parsedContent.image) && (
        <div className="featured-event-image">
          <img
            src={image ? getImageUrl(image) : getImageUrl(parsedContent.image)}
            alt={parsedContent.title}
            onError={(e) => handleImageError(e)}
          />
        </div>
      )}
    </div>
  );
};

export default FeaturedEventRenderer;
