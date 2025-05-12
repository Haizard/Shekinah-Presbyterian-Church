import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

/**
 * Component for rendering the "featured_event" structured content
 */
const FeaturedEventRenderer = ({ content }) => {
  console.log('FeaturedEventRenderer received content:', content);

  // Handle different content formats
  let parsedContent;

  // If content is a string, try to parse it
  if (typeof content === 'string') {
    try {
      parsedContent = JSON.parse(content);
      console.log('FeaturedEventRenderer parsed string content:', parsedContent);
    } catch (error) {
      console.error('Error parsing FeaturedEvent content:', error);
      return <div>Error rendering content: Invalid JSON format</div>;
    }
  } else {
    // If content is already an object, use it directly
    parsedContent = content;
    console.log('FeaturedEventRenderer using object content directly:', parsedContent);
  }

  // If parsedContent is not an object, return an error message
  if (typeof parsedContent !== 'object' || parsedContent === null) {
    // Try to convert to object if it's a string that looks like JSON
    if (typeof parsedContent === 'string') {
      try {
        const tryParse = JSON.parse(parsedContent);
        if (typeof tryParse === 'object' && tryParse !== null) {
          console.log('FeaturedEventRenderer parsed string to object:', tryParse);
          parsedContent = tryParse;
        } else {
          console.error('FeaturedEvent content is not an object after parsing:', tryParse);
          return <div>Invalid content format: Expected an object with event details</div>;
        }
      } catch (error) {
        console.error('FeaturedEvent content is not an object:', parsedContent);
        return <div>Invalid content format: Expected an object with event details</div>;
      }
    } else {
      console.error('FeaturedEvent content is not an object:', parsedContent);
      return <div>Invalid content format: Expected an object with event details</div>;
    }
  }

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
          <button type="button" className="btn btn-primary">Register Now</button>
          <button type="button" className="btn btn-secondary">Learn More</button>
        </div>
      </div>

      {parsedContent.image && (
        <div className="featured-event-image">
          <img
            src={getImageUrl(parsedContent.image)}
            alt={parsedContent.title}
            onError={(e) => handleImageError(e)}
          />
        </div>
      )}
    </div>
  );
};

export default FeaturedEventRenderer;
