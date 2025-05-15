import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faClock, faMapMarkerAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
// Import our modern design system
import '../styles/main.css';
import '../styles/modern-home.css';
import '../styles/modern-about.css';
import '../styles/modern-events.css';
import api from '../services/api';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import DynamicContent from '../components/DynamicContent';

const Events = () => {
  const [filter, setFilter] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await api.events.getAll();
        console.log('Fetched events:', data);
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again.');

        // Fallback to sample data if API fails
        setEvents([
          {
            _id: '1',
            title: 'Sunday Worship Service',
            date: 'June 12, 2023',
            time: '9:00 AM - 12:00 PM',
            location: 'Main Sanctuary',
            category: 'worship',
            description: 'Join us for our weekly Sunday worship service as we gather to praise God, hear His Word, and fellowship together.',
            image: '/images/SPCT/CHURCH.jpg'
          },
          {
            _id: '2',
            title: 'Bible Study',
            date: 'June 15, 2023',
            time: '6:00 PM - 8:00 PM',
            location: 'Fellowship Hall',
            category: 'study',
            description: 'A deep dive into the book of Romans, exploring the foundations of our faith and the implications for our lives today.',
            image: '/images/SPCT/CHURCH.jpg'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on category
  const filteredEvents = filter === 'all'
    ? events
    : events.filter(event => event.category === filter);

  return (
    <main className="events-page">
      {/* Page Banner */}
      <section className="page-banner">
        <div className="container">
          <h2 className="animate-fade-in">Events</h2>
          <p className="animate-fade-in" style={{animationDelay: '0.2s'}}>Join us for worship, fellowship, and growth</p>
        </div>
      </section>

      {/* Featured Event Section */}
      <section className="section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Featured Event</h2>
            <div className="divider" />
          </div>
          <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
            <DynamicContent
              section="featured_event"
              fallback={
                <div className="featured-event-container">
                  <div className="empty-state">
                    <FontAwesomeIcon icon={faCalendarAlt} className="empty-state-icon" />
                    <p className="empty-state-title">No featured event at this time</p>
                    <p className="empty-state-description">Check our upcoming events below</p>
                  </div>
                </div>
              }
              showContent={true}
              className="featured-event-container"
            />
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Upcoming Events</h2>
            <div className="divider" />
          </div>

          {/* Event Filters */}
          <div className="event-filters animate-fade-in" style={{animationDelay: '0.2s'}}>
            <button
              type="button"
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All Events
            </button>
            <button
              type="button"
              className={filter === 'worship' ? 'active' : ''}
              onClick={() => setFilter('worship')}
            >
              Worship
            </button>
            <button
              type="button"
              className={filter === 'study' ? 'active' : ''}
              onClick={() => setFilter('study')}
            >
              Bible Study
            </button>
            <button
              type="button"
              className={filter === 'youth' ? 'active' : ''}
              onClick={() => setFilter('youth')}
            >
              Youth
            </button>
            <button
              type="button"
              className={filter === 'prayer' ? 'active' : ''}
              onClick={() => setFilter('prayer')}
            >
              Prayer
            </button>
            <button
              type="button"
              className={filter === 'conference' ? 'active' : ''}
              onClick={() => setFilter('conference')}
            >
              Conferences
            </button>
            <button
              type="button"
              className={filter === 'outreach' ? 'active' : ''}
              onClick={() => setFilter('outreach')}
            >
              Outreach
            </button>
          </div>

          {/* Events Grid */}
          <div className="events-grid">
            {loading ? (
              <div className="loading-container">
                <div className="spinner" />
                <p>Loading events...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <FontAwesomeIcon icon="exclamation-circle" className="error-icon" />
                <p className="error-message">{error}</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>Try Again</button>
              </div>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <div
                  className="event-card animate-slide-bottom"
                  key={event._id}
                  style={{animationDelay: `${0.1 * (index + 1)}s`}}
                >
                  <div className="event-image">
                    <img
                      src={getImageUrl(event.image)}
                      alt={event.title}
                      onError={(e) => handleImageError(e)}
                    />
                    <div className="event-date">
                      <span className="month">{event.date ? event.date.split(' ')[0] : 'TBD'}</span>
                      <span className="day">{event.date ? event.date.split(' ')[1]?.replace(',', '') : ''}</span>
                    </div>
                  </div>
                  <div className="event-details">
                    <h3>{event.title}</h3>
                    <div className="event-meta">
                      <p><FontAwesomeIcon icon={faClock} /> {event.time}</p>
                      <p><FontAwesomeIcon icon={faMapMarkerAlt} /> {event.location}</p>
                    </div>
                    <p className="event-description">
                      {event.description && typeof event.description === 'string'
                        ? `${event.description.replace(/<[^>]*>/g, '').substring(0, 100)}...`
                        : 'No description available'}
                    </p>
                    <Link to={`/events/${event._id}`} className="btn btn-primary btn-sm">
                      Learn More <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FontAwesomeIcon icon={faCalendarAlt} className="empty-state-icon" />
                <p className="empty-state-title">No events found in this category</p>
                <p className="empty-state-description">Try selecting a different category or check back later</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Event Calendar</h2>
            <div className="divider" />
          </div>
          <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
            <DynamicContent
              section="event_calendar"
              fallback={
                <div className="event-calendar-container">
                  <div className="empty-state">
                    <FontAwesomeIcon icon={faCalendarAlt} className="empty-state-icon" />
                    <p className="empty-state-title">No events have been added to the calendar yet</p>
                    <p className="empty-state-description">Check back later for updates</p>
                  </div>
                </div>
              }
              showContent={true}
              className="event-calendar-container"
            />
          </div>
        </div>
      </section>

      {/* Weekly Schedule Section */}
      <section className="section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Weekly Schedule</h2>
            <div className="divider" />
          </div>
          <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
            <DynamicContent
              section="weekly_schedule"
              fallback={
                <div className="weekly-schedule-container">
                  <div className="empty-state">
                    <FontAwesomeIcon icon={faClock} className="empty-state-icon" />
                    <p className="empty-state-title">Weekly schedule is being updated</p>
                    <p className="empty-state-description">Please check back later</p>
                  </div>
                </div>
              }
              showContent={true}
              className="weekly-schedule-container"
            />
          </div>
        </div>
      </section>

      {/* Special Events Section */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Special Events</h2>
            <div className="divider" />
          </div>
          {/* Temporarily commenting out this section until content is created in admin panel */}
          {/*
          <DynamicContent
            section="special_events"
            fallback={null}
            showContent={true}
            className="special-events-container"
          />
          */}
          <div className="special-events-container animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="empty-state">
              <FontAwesomeIcon icon="star" className="empty-state-icon" />
              <p className="empty-state-title">No special events at this time</p>
              <p className="empty-state-description">Check back later for updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2 className="animate-fade-in">Get Involved</h2>
          <p className="animate-fade-in" style={{animationDelay: '0.2s'}}>There are many ways to connect and serve in our church community</p>
          <Link to="/ministries" className="btn btn-primary btn-lg animate-slide-bottom" style={{animationDelay: '0.4s'}}>
            Explore Ministries <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Events;
