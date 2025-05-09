import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import DynamicContent from './DynamicContent';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import '../styles/FeaturedEvent.css';

const FeaturedEvent = () => {
  return (
    <div className="featured-event">
      <DynamicContent
        section="featured_event"
        fallback={
          <div className="featured-event-container">
            <div className="featured-event-image">
              <img src="/images/SPCT/CHURCH.jpg" alt="Featured Event" />
              <div className="featured-event-date">
                <span className="month">JUN</span>
                <span className="day">15</span>
              </div>
            </div>
            <div className="featured-event-details">
              <h3>Annual Church Conference</h3>
              <p className="featured-event-meta">
                <span><FontAwesomeIcon icon={faCalendarAlt} /> June 15-17, 2023</span>
                <span><FontAwesomeIcon icon={faClock} /> 9:00 AM - 4:00 PM</span>
                <span><FontAwesomeIcon icon={faMapMarkerAlt} /> Main Sanctuary</span>
              </p>
              <p className="featured-event-description">
                Join us for our annual church conference with guest speakers and worship. This year's theme is "Rooted in Christ, Growing in Faith."
              </p>
              <Link to="/events" className="btn btn-primary">Learn More</Link>
            </div>
          </div>
        }
        renderContent={(content) => {
          // Parse content for event details if it's in JSON format
          let eventDetails = {};
          try {
            if (content.content.startsWith('{') && content.content.endsWith('}')) {
              eventDetails = JSON.parse(content.content);
            }
          } catch (error) {
            console.error('Error parsing featured event content:', error);
          }

          return (
            <div className="featured-event-container">
              <div className="featured-event-image">
                <img 
                  src={getImageUrl(content.image)} 
                  alt={content.title} 
                  onError={(e) => handleImageError(e)}
                />
                {eventDetails.date && (
                  <div className="featured-event-date">
                    <span className="month">
                      {new Date(eventDetails.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                    </span>
                    <span className="day">
                      {new Date(eventDetails.date).getDate()}
                    </span>
                  </div>
                )}
              </div>
              <div className="featured-event-details">
                <h3>{content.title}</h3>
                <p className="featured-event-meta">
                  {eventDetails.date && (
                    <span><FontAwesomeIcon icon={faCalendarAlt} /> {eventDetails.date}</span>
                  )}
                  {eventDetails.time && (
                    <span><FontAwesomeIcon icon={faClock} /> {eventDetails.time}</span>
                  )}
                  {eventDetails.location && (
                    <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {eventDetails.location}</span>
                  )}
                </p>
                {!eventDetails.description && (
                  <div className="featured-event-description" dangerouslySetInnerHTML={{ __html: content.content }} />
                )}
                {eventDetails.description && (
                  <p className="featured-event-description">{eventDetails.description}</p>
                )}
                <Link to={eventDetails.link || "/events"} className="btn btn-primary">Learn More</Link>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default FeaturedEvent;
