import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

/**
 * Component for rendering the "featured_event" structured content
 */
const FeaturedEventRenderer = ({ content, image }) => {
  console.log('FeaturedEventRenderer received content:', content);
  console.log('FeaturedEventRenderer received image:', image);

  // Handle different content formats
  let parsedContent;

  // Special handling for the "[object Object]" format
  if (typeof content === 'string' && content.includes('[object Object]')) {
    console.log('Content appears to be a stringified object that lost its structure');

    // Extract any text that might be useful
    const contentLines = content.split('\n');
    const eventInfo = {
      title: 'Featured Event',
      description: 'Event details coming soon',
      date: new Date().toLocaleDateString(),
      time: 'TBD',
      location: 'Main Sanctuary',
      link: '/events'
    };

    // Try to extract meaningful information from the content
    for (const line of contentLines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.includes('[object Object]')) {
        // If we find a line that looks like a title, use it
        if (!eventInfo.title || eventInfo.title === 'Featured Event') {
          eventInfo.title = trimmedLine;
        } else if (!eventInfo.description || eventInfo.description === 'Event details coming soon') {
          eventInfo.description = trimmedLine;
        }
      }
    }

    parsedContent = eventInfo;
  }
  // If content is a string, try to parse it
  else if (typeof content === 'string') {
    try {
      parsedContent = JSON.parse(content);
      console.log('FeaturedEventRenderer parsed string content:', parsedContent);
    } catch (error) {
      console.error('Error parsing FeaturedEvent content:', error);

      // If parsing fails, create a simple event object from the string content
      parsedContent = {
        title: 'Featured Event',
        description: content,
        date: new Date().toLocaleDateString(),
        time: 'TBD',
        location: 'Main Sanctuary',
        link: '/events'
      };
    }
  } else {
    // If content is already an object, use it directly
    parsedContent = content;
    console.log('FeaturedEventRenderer using object content directly:', parsedContent);
  }

  // If parsedContent is still not an object, create a default one
  if (typeof parsedContent !== 'object' || parsedContent === null) {
    console.error('FeaturedEvent content is not an object:', parsedContent);
    parsedContent = {
      title: 'Featured Event',
      description: 'Event details coming soon',
      date: new Date().toLocaleDateString(),
      time: 'TBD',
      location: 'Main Sanctuary',
      link: '/events'
    };
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
