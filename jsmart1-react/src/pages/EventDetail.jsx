import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt, faCalendarAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SocialShare from '../components/SocialShare';
import api from '../services/api';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import '../styles/EventDetail.css';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventAndRelated = async () => {
      try {
        setLoading(true);

        // Fetch the main event
        const data = await api.events.getById(id);
        setEvent(data);

        // Fetch related events (same category or upcoming events)
        if (data?.category) {
          try {
            const allEvents = await api.events.getAll();

            // Filter events: same category but different ID, limit to 3
            const related = allEvents
              .filter(e => e._id !== id && (e.category === data.category || new Date(e.date) > new Date()))
              .slice(0, 3);

            setRelatedEvents(related);
          } catch (relatedErr) {
            console.error('Error fetching related events:', relatedErr);
            // Don't set an error for related events, just leave the array empty
          }
        }

        setError(null);

        // Scroll to top when event loads
        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndRelated();
  }, [id]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';

    const parts = dateString.split(' ');
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1].replace(',', '')}${parts.length > 2 ? `, ${parts[2]}` : ''}`;
    }
    return dateString;
  };

  return (
    <main className="event-detail-page">
      <div className="container">
        <div className="back-link">
          <Link to="/events">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Events
          </Link>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
            <p>Loading event details...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <Link to="/events" className="btn btn-primary">Return to Events</Link>
          </div>
        ) : event ? (
          <div className="event-detail-content">
            <div className="event-detail-header">
              <h1>{event.title}</h1>
              <div className="event-meta">
                {event.date && (
                  <span>
                    <FontAwesomeIcon icon={faCalendarAlt} /> {event.date}
                  </span>
                )}
                {event.time && (
                  <span>
                    <FontAwesomeIcon icon={faClock} /> {event.time}
                  </span>
                )}
                {event.location && (
                  <span>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {event.location}
                  </span>
                )}
              </div>
            </div>

            <div className="event-detail-body">
              <div className="event-image-container">
                <img
                  src={getImageUrl(event.image)}
                  alt={event.title}
                  onError={(e) => handleImageError(e)}
                />
                {event.date && (
                  <div className="event-date-badge">
                    <span className="month">{event.date.split(' ')[0]}</span>
                    <span className="day">{formatDate(event.date)}</span>
                  </div>
                )}
              </div>

              <div className="event-description">
                {event.description ? (
                  <div dangerouslySetInnerHTML={{ __html: event.description }} />
                ) : (
                  <p>No description available for this event.</p>
                )}
              </div>

              {event.category && (
                <div className="event-category">
                  <span className="category-label">Category:</span>
                  <span>{event.category}</span>
                </div>
              )}

              <div className="event-actions">
                {event.registrationLink && (
                  <a href={event.registrationLink} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                    Register Now
                  </a>
                )}
                <Link to="/contact" className="btn btn-secondary">
                  Contact Us
                </Link>
              </div>

              <div className="social-share-container">
                <SocialShare
                  title={event.title}
                  description={`Join us for ${event.title} on ${event.date} at ${event.location}`}
                />
              </div>
            </div>

            {/* Related Events Section */}
            {relatedEvents.length > 0 && (
              <div className="related-events-section">
                <h3>Related Events</h3>
                <div className="related-events-grid">
                  {relatedEvents.map(relatedEvent => (
                    <div key={relatedEvent._id} className="related-event-card">
                      <Link
                        to={`/events/${relatedEvent._id}`}
                        className="related-event-link"
                      >
                        <div className="related-event-image">
                          <img
                            src={getImageUrl(relatedEvent.image)}
                            alt={relatedEvent.title}
                            onError={(e) => handleImageError(e)}
                          />
                        </div>
                        <div className="related-event-content">
                          <h4>{relatedEvent.title}</h4>
                          {relatedEvent.date && (
                            <div className="related-event-date">
                              <FontAwesomeIcon icon={faCalendarAlt} />
                              {relatedEvent.date}
                            </div>
                          )}
                          <span className="related-event-view-link">
                            View Details →
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="not-found-container">
            <h2>Event Not Found</h2>
            <p>The event you're looking for doesn't exist or has been removed.</p>
            <Link to="/events" className="btn btn-primary">Browse All Events</Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default EventDetail;
