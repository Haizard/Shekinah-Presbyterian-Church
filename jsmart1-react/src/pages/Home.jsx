import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faMapMarkerAlt,
  faBookOpen,
  faCross,
  faDove,
  faPlay,
  faHeadphones,
  faDownload,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Home.css';
import DynamicContent from '../components/DynamicContent';
import ContentContext from '../context/ContentContext';
import api from '../services/api';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

import BranchSlider from '../components/BranchSlider';
import ContentRendererFactory from '../components/structured/ContentRendererFactory';

const Home = () => {
  const [latestSermons, setLatestSermons] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch latest sermons, upcoming events, and church branches
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch sermons, events, and branches
        const [sermons, events, branchesData] = await Promise.all([
          api.sermons.getAll(),
          api.events.getAll(),
          api.branches.getAll()
        ]);

        // Removed console logs to prevent browser overload

        // Sort sermons by date (newest first) and take the first 2
        const sortedSermons = sermons
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2);

        // Sort events by date (upcoming first) and take the first 3
        const sortedEvents = events
          .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
          })
          .slice(0, 3);

        setLatestSermons(sortedSermons);
        setUpcomingEvents(sortedEvents);
        setBranches(branchesData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get content from context but don't re-render on every change
  const { content } = useContext(ContentContext);

  // Simple state to track when content is loaded
  const [localRefreshTrigger, setLocalRefreshTrigger] = useState(0);

  // Update local trigger when content changes
  useEffect(() => {
    // Check if we have content and it has sections
    if (content && Object.keys(content).length > 0) {
      // Removed console log to prevent browser overload

      // Only update if we haven't set the trigger yet
      if (localRefreshTrigger === 0) {
        // Removed console log to prevent browser overload
        setLocalRefreshTrigger(1);
      }
    }
  }, [content, localRefreshTrigger]);

  // Removed content sections logging to prevent browser overload

  return (
    <main>

      {/* Hero Section - Church Branches Slider */}
      <section id="home" className="hero">
        {/* Background Image */}
        <div className="hero-background">
          <DynamicContent
            section="hero"
            showTitle={false}
            showContent={false}
            renderContent={(content) => (
              <img
                src={getImageUrl(content.image) || '/images/SPCT/CHURCH.jpg'}
                alt="Church Background"
                className="hero-bg-image"
                onError={(e) => handleImageError(e)}
              />
            )}
          />
        </div>

        {/* Overlay */}
        <div className="hero-overlay"></div>

        {/* Content - Branch Slider */}
        <div className="hero-content branches-only">
          <DynamicContent
            section="hero"
            showTitle={false}
            showImage={false}
            renderContent={(content) => (
              <ContentRendererFactory
                section="hero"
                content={content.content}
                backgroundImage={content.image}
              />
            )}
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <div className="section-header">
            <h2>About Us</h2>
            <div className="divider" />
          </div>
          <DynamicContent
            key={`about-${localRefreshTrigger}`}
            section="about"
            className="about-content"
            renderContent={(content) => {
              return (
                <div className="about-content">
                  <div className="about-text">
                    {typeof content.content === 'string' && (
                      <ContentRendererFactory
                        section="about"
                        content={content.content}
                        contentId={content._id}
                      />
                    )}
                  </div>
                  <div className="about-image">
                    <img
                      src={getImageUrl(content.image)}
                      alt={content.title}
                      onError={(e) => handleImageError(e)}
                    />
                  </div>
                </div>
              );
            }}
          />
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Our Vision</h2>
            <div className="divider" />
          </div>
          <DynamicContent
            key={`vision-${localRefreshTrigger}`}
            section="vision"
            className="vision-content"
            renderContent={(content) => {
              return (
                <div className="vision-content">
                  <div className="vision-image">
                    <img
                      src={getImageUrl(content.image)}
                      alt={content.title}
                      onError={(e) => handleImageError(e)}
                    />
                  </div>
                  <div className="vision-text">
                    {typeof content.content === 'string' && (
                      <ContentRendererFactory
                        section="vision"
                        content={content.content}
                        contentId={content._id}
                      />
                    )}
                  </div>
                </div>
              );
            }}
          />
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Mission</h2>
            <div className="divider" />
          </div>
          <DynamicContent
            key={`mission-${localRefreshTrigger}`}
            section="mission"
            className="mission-content"
            renderContent={(content) => {
              return (
                <div className="mission-content">
                  <div className="mission-text">
                    {typeof content.content === 'string' && (
                      <ContentRendererFactory
                        section="mission"
                        content={content.content}
                        contentId={content._id}
                      />
                    )}
                  </div>
                  <div className="mission-image">
                    <img
                      src={getImageUrl(content.image)}
                      alt={content.title}
                      onError={(e) => handleImageError(e)}
                    />
                  </div>
                </div>
              );
            }}
          />
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Upcoming Events</h2>
            <div className="divider" />
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner-small" />
              <p>Loading events...</p>
            </div>
          ) : (
            <>
              <div className="events-grid">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => {
                    // Parse the date
                    const eventDate = new Date(event.date);
                    // Make sure day is a valid number and convert to string
                    const day = !Number.isNaN(eventDate.getDate()) ? eventDate.getDate().toString() : '1';
                    // Make sure month is a valid string
                    const month = !Number.isNaN(eventDate.getTime())
                      ? eventDate.toLocaleString('default', { month: 'short' }).toUpperCase()
                      : 'JAN';

                    return (
                      <div className="event-card" key={event._id}>
                        <div className="event-date">
                          <span className="day">{day}</span>
                          <span className="month">{month}</span>
                        </div>
                        <div className="event-details">
                          <h3>{event.title}</h3>
                          <p><FontAwesomeIcon icon={faClock} /> {event.time}</p>
                          <p><FontAwesomeIcon icon={faMapMarkerAlt} /> {event.location}</p>
                          <Link to={`/events/${event._id}`} className="btn btn-sm">Learn More</Link>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-events">
                    <p>No upcoming events at this time. Check back soon!</p>
                  </div>
                )}
              </div>
              <div className="text-center mt-4">
                <Link to="/events" className="btn btn-primary">View All Events</Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Sermons Section */}
      <section id="sermons" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Latest Sermons</h2>
            <div className="divider" />
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner-small" />
              <p>Loading sermons...</p>
            </div>
          ) : (
            <>
              <div className="sermons-grid">
                {latestSermons.length > 0 ? (
                  latestSermons.map((sermon) => (
                    <div className="sermon-card" key={sermon._id}>
                      <div className="sermon-thumbnail">
                        <img
                          src={getImageUrl(sermon.image)}
                          alt={sermon.title}
                          onError={(e) => handleImageError(e)}
                        />
                        {sermon.videoUrl && (
                          <div className="play-button">
                            <FontAwesomeIcon icon={faPlay} />
                          </div>
                        )}
                      </div>
                      <div className="sermon-details">
                        <h3>{sermon.title}</h3>
                        <p className="sermon-meta">{sermon.speaker} | {sermon.date}</p>
                        <p className="sermon-verse">{sermon.scripture}</p>
                        <div className="sermon-links">
                          {sermon.audioUrl && (
                            <a href={sermon.audioUrl} target="_blank" rel="noopener noreferrer">
                              <FontAwesomeIcon icon={faHeadphones} /> Listen
                            </a>
                          )}
                          {sermon.audioUrl && (
                            <a href={sermon.audioUrl} download>
                              <FontAwesomeIcon icon={faDownload} /> Download
                            </a>
                          )}
                          {sermon.notesUrl && (
                            <a href={sermon.notesUrl} target="_blank" rel="noopener noreferrer">
                              <FontAwesomeIcon icon={faFileAlt} /> Notes
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-sermons">
                    <p>No sermons available at this time. Check back soon!</p>
                  </div>
                )}
              </div>
              <div className="text-center mt-4">
                <Link to="/sermons" className="btn btn-primary">View All Sermons</Link>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
