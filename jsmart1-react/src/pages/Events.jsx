import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Events.css';
import api from '../services/api';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

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
          <div className="featured-event">
            <div className="featured-event-image">
              <img src="/images/SPCT/CHURCH.jpg" alt="Annual Church Conference" />
            </div>
            <div className="featured-event-details">
              <div className="event-date-large">
                <span className="month">JUN</span>
                <span className="day">25</span>
                <span className="year">2023</span>
              </div>
              <h3>Annual Church Conference: "Rooted in Christ"</h3>
              <p className="event-time"><FontAwesomeIcon icon="clock" /> 9:00 AM - 4:00 PM</p>
              <p className="event-location"><FontAwesomeIcon icon="map-marker-alt" /> Main Sanctuary, Shekinah Church</p>
              <p className="event-description">Join us for our annual church conference as we explore what it means to be rooted in Christ. This full-day event will feature inspiring speakers, powerful worship, and practical workshops to help you grow in your faith.</p>
              <div className="event-buttons">
                <Link to="/events/conference/register" className="btn btn-primary">Register Now</Link>
                <Link to="/events/featured-conference" className="btn btn-secondary">Learn More</Link>
                <Link to="/simple-event" className="btn btn-primary">View Simple Event</Link>
              </div>
              <div className="event-countdown" data-date="2023-06-25T09:00:00">
                <div className="countdown-item">
                  <span className="countdown-number" id="countdown-days">30</span>
                  <span className="countdown-label">Days</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-number" id="countdown-hours">12</span>
                  <span className="countdown-label">Hours</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-number" id="countdown-minutes">45</span>
                  <span className="countdown-label">Minutes</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-number" id="countdown-seconds">20</span>
                  <span className="countdown-label">Seconds</span>
                </div>
              </div>
            </div>
          </div>
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
          <div className="calendar-controls">
            <div className="calendar-navigation">
              <button type="button" className="btn btn-sm"><FontAwesomeIcon icon="chevron-left" /> Previous</button>
              <h3>June 2023</h3>
              <button type="button" className="btn btn-sm">Next <FontAwesomeIcon icon="chevron-right" /></button>
            </div>
            <div className="calendar-view-options">
              <button type="button" className="btn btn-sm active">Month</button>
              <button type="button" className="btn btn-sm">List</button>
            </div>
          </div>
          <div className="calendar-container">
            <div className="calendar-notice">
              <p>View our full calendar to plan your visit and stay updated on all church activities.</p>
              <Link to="/calendar" className="btn btn-primary">View Full Calendar</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Schedule Section */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Weekly Schedule</h2>
            <div className="divider" />
          </div>
          <div className="weekly-schedule">
            <div className="schedule-day">
              <h3>Sunday</h3>
              <div className="schedule-items">
                <div className="schedule-item">
                  <span className="schedule-time">9:00 AM - 12:00 PM</span>
                  <span className="schedule-title">Sunday Worship Service</span>
                  <span className="schedule-location">Main Sanctuary</span>
                </div>
                <div className="schedule-item">
                  <span className="schedule-time">10:30 AM - 11:30 AM</span>
                  <span className="schedule-title">Children's Sunday School</span>
                  <span className="schedule-location">Children's Wing</span>
                </div>
              </div>
            </div>
            <div className="schedule-day">
              <h3>Wednesday</h3>
              <div className="schedule-items">
                <div className="schedule-item">
                  <span className="schedule-time">6:00 PM - 7:30 PM</span>
                  <span className="schedule-title">Midweek Bible Study</span>
                  <span className="schedule-location">Fellowship Hall</span>
                </div>
                <div className="schedule-item">
                  <span className="schedule-time">6:00 PM - 7:30 PM</span>
                  <span className="schedule-title">Youth Group</span>
                  <span className="schedule-location">Youth Center</span>
                </div>
              </div>
            </div>
            <div className="schedule-day">
              <h3>Friday</h3>
              <div className="schedule-items">
                <div className="schedule-item">
                  <span className="schedule-time">7:00 PM - 9:00 PM</span>
                  <span className="schedule-title">Prayer Meeting</span>
                  <span className="schedule-location">Prayer Room</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Events Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Special Events</h2>
            <div className="divider" />
          </div>
          <div className="special-events">
            <div className="special-event">
              <div className="special-event-image">
                <img src="/images/SPCT/CHURCH.jpg" alt="Annual Conference" />
              </div>
              <div className="special-event-details">
                <h3>Annual Church Conference</h3>
                <p className="special-event-date">August 15-18, 2023</p>
                <p className="special-event-description">
                  Our annual church conference brings together believers from across Tanzania for a time of powerful teaching, worship, and fellowship. This year's theme is "Advancing the Kingdom" with guest speakers from around the world.
                </p>
                <Link to="/events/special-annual-conference" className="btn btn-primary">Learn More</Link>
              </div>
            </div>
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
