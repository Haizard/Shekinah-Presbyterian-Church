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
import ContentDebugger from '../components/ContentDebugger';
import BranchSlider from '../components/BranchSlider';

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
  const { content, debugContent } = useContext(ContentContext);

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

  // Debug function to check content state
  const handleDebugClick = () => {
    // Removed console logs to prevent browser overload
    if (debugContent) {
      debugContent();
    }
    // Removed console logs to prevent browser overload
  };

  return (
    <main>
      {/* Debug button - only visible in development */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="debug-panel" style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}>
          <button
            type="button"
            onClick={handleDebugClick}
            style={{
              padding: '5px 10px',
              background: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Debug Content
          </button>
        </div>
      )}
      {/* Hero Section - Church Branches Slider */}
      <section id="home" className="hero" style={{
        position: 'relative',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#000'
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 0
        }}>
          <img
            src="/images/SPCT/CHURCH.jpg"
            alt="Church Background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>

        {/* Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.2)',
          zIndex: 1
        }}></div>

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          padding: '20px'
        }}>
          {branches && branches.length > 0 ? (
            <BranchSlider branches={branches} />
          ) : (
            <div className="hero-content">
              <div className="hero-main-content">
                <h2>Welcome to Shekinah Presbyterian Church Tanzania</h2>
                <p>"The True Word, The True Gospel, and True Freedom"</p>
                <div className="hero-buttons">
                  <a href="#about" className="btn btn-primary">Learn More</a>
                  <Link to="/contact" className="btn btn-secondary">Plan Your Visit</Link>
                </div>
                <div className="service-times">
                  <p><FontAwesomeIcon icon={faClock} /> Sunday Service: 9:00 AM</p>
                  <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Dar es Salaam, Tanzania</p>
                </div>
              </div>
            </div>
          )}
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
            truncateContent={true}
            maxContentLength={200}
            fallback={
              <div className="about-content">
                <div className="about-text">
                  <p><strong>Shekinah Presbyterian Church Tanzania</strong> is a Christ-centered community committed to proclaiming the Kingdom of God across Tanzania and beyond. We exist to raise up mature disciples of Jesus, build Gospel-driven communities, and extend the love and truth of Christ to every sphere of life.</p>
                  <p>We are not just building churches—we are cultivating a missional culture where every believer is equipped to live for Christ, serve others, and make disciples who make disciples.</p>
                </div>
                <div className="about-image">
                  <img src="/images/SPCT/CHURCH.jpg" alt="Shekinah Church Building" />
                </div>
              </div>
            }
            renderContent={(content) => {
              // Only log in development mode and only occasionally
              if (process.env.NODE_ENV === 'development' && Math.random() < 0.05) {
                console.log('About renderContent called');
              }
              return (
                <div className="about-content">
                  <div className="about-text">
                    {typeof content.content === 'string' && (
                      <ContentRendererFactory
                        section="about"
                        content={content.content}
                        truncate={true}
                        maxLength={200}
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
            truncateContent={true}
            maxContentLength={200}
            fallback={
              <div className="vision-content">
                <div className="vision-image">
                  <img src="/images/SPCT/CHURCH BCND.jpg" alt="Church Vision" />
                </div>
                <div className="vision-text">
                  <p>To see a generation of disciples who are rooted in the truth, shaped by the Gospel, and released to transform communities for the glory of Christ.</p>
                  <p>We envision believers who are spiritually mature, mission-minded, and actively involved in making Jesus known—locally and globally.</p>
                </div>
              </div>
            }
            renderContent={(content) => {
              // Only log in development mode and only occasionally
              if (process.env.NODE_ENV === 'development' && Math.random() < 0.05) {
                console.log('Vision renderContent called');
              }
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
                        truncate={true}
                        maxLength={200}
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
            truncateContent={true}
            maxContentLength={200}
            fallback={
              <div className="mission-content">
                <div className="mission-text">
                  <p>We exist to:</p>
                  <ul className="mission-list">
                    <li>
                      <FontAwesomeIcon icon={faBookOpen} />
                      <div>
                        <h3>Proclaim the true Word of God</h3>
                        <p>Teaching the uncompromised Word of God with clarity and conviction</p>
                      </div>
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faCross} />
                      <div>
                        <h3>Spread the true Gospel of Jesus Christ</h3>
                        <p>Proclaiming the Good News through disciple-making and church planting</p>
                      </div>
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faDove} />
                      <div>
                        <h3>Lead people into true freedom</h3>
                        <p>Helping people experience the real freedom found in Christ alone</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="mission-image">
                  <img src="/images/SPCT/CHURCH.jpg" alt="Church Mission" />
                </div>
              </div>
            }
            renderContent={(content) => {
              // Only log in development mode and only occasionally
              if (process.env.NODE_ENV === 'development' && Math.random() < 0.05) {
                console.log('Mission renderContent called');
              }
              return (
                <div className="mission-content">
                  <div className="mission-text">
                    {typeof content.content === 'string' && (
                      <ContentRendererFactory
                        section="mission"
                        content={content.content}
                        truncate={true}
                        maxLength={200}
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

      {/* Content Debugger Section */}
      <section id="debug" className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Content Debugger</h2>
            <div className="divider" />
          </div>
          <ContentDebugger />
        </div>
      </section>
    </main>
  );
};

export default Home;
