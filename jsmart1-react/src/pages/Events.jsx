import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Events.css';
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
          <h2>Events</h2>
          <p>Join us for worship, fellowship, and growth</p>
        </div>
      </section>

      {/* Featured Event Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Event</h2>
            <div className="divider" />
          </div>
          <DynamicContent
            section="featured_event"
            fallback={
              <div className="featured-event-container">
                <p className="text-center">No featured event at this time. Check our upcoming events below.</p>
              </div>
            }
            showContent={true}
            className="featured-event-container"
          />
        </div>
      </section>

      {/* Events Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Upcoming Events</h2>
            <div className="divider" />
          </div>

          {/* Event Filters */}
          <div className="event-filters">
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
                <p>{error}</p>
              </div>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <div className="event-card" key={event._id}>
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
                      <p><FontAwesomeIcon icon="clock" /> {event.time}</p>
                      <p><FontAwesomeIcon icon="map-marker-alt" /> {event.location}</p>
                    </div>
                    <p className="event-description">
                      {event.description && typeof event.description === 'string'
                        ? `${event.description.replace(/<[^>]*>/g, '').substring(0, 100)}...`
                        : 'No description available'}
                    </p>
                    <Link to={`/events/${event._id}`} className="btn btn-sm">Learn More</Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No events found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Event Calendar</h2>
            <div className="divider" />
          </div>
          <DynamicContent
            section="event_calendar"
            fallback={
              <div className="calendar-container">
                <p className="text-center">No events have been added to the calendar yet. Check back later for updates.</p>
              </div>
            }
            showContent={true}
            className="event-calendar-container"
          />
        </div>
      </section>

      {/* Weekly Schedule Section */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Weekly Schedule</h2>
            <div className="divider" />
          </div>
          <DynamicContent
            section="weekly_schedule"
            fallback={
              <div className="weekly-schedule">
                <p className="text-center">Weekly schedule is being updated. Please check back later.</p>
              </div>
            }
            showContent={true}
            className="weekly-schedule-container"
          />
        </div>
      </section>

      {/* Special Events Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
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
          <div className="special-events-container">
            <p className="text-center">No special events at this time. Check back later for updates.</p>
          </div>
        </div>
      </section>

      {/* Event Registration Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Event Registration</h2>
            <div className="divider" />
          </div>
          <div className="registration-content">
            <div className="registration-info">
              <p>To register for any of our events, please fill out the form or contact our church office:</p>
              <ul>
                <li><FontAwesomeIcon icon="phone" /> +255 769 080 629</li>
                <li><FontAwesomeIcon icon="envelope" /> events@spctanzania.org</li>
              </ul>
              <p>For large events, early registration is recommended as space may be limited.</p>
            </div>
            <div className="registration-form">
              <form>
                <div className="form-group">
                  <label htmlFor="event-select">Select Event*</label>
                  <select id="event-select" name="event" required>
                    <option value="">-- Select an Event --</option>
                    <option value="conference">Annual Church Conference (Jun 25)</option>
                    <option value="bible-study">Midweek Bible Study (Jun 15)</option>
                    <option value="outreach">Community Outreach (Jun 20)</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="reg-name">Your Name*</label>
                    <input type="text" id="reg-name" name="name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-email">Your Email*</label>
                    <input type="email" id="reg-email" name="email" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="reg-phone">Phone Number*</label>
                    <input type="tel" id="reg-phone" name="phone" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-attendees">Number of Attendees*</label>
                    <input type="number" id="reg-attendees" name="attendees" min="1" required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="reg-message">Additional Information</label>
                  <textarea id="reg-message" name="message" rows="3" />
                </div>
                <button type="submit" className="btn btn-primary">Register Now</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2>Get Involved</h2>
          <p>There are many ways to connect and serve in our church community</p>
          <Link to="/ministries" className="btn btn-primary">Explore Ministries</Link>
        </div>
      </section>
    </main>
  );
};

export default Events;
