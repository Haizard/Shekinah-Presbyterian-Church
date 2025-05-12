import React, { useState, useEffect, useContext } from 'react';
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

const Home = () => {
  const [latestSermons, setLatestSermons] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch latest sermons and upcoming events
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch sermons and events
        const [sermons, events] = await Promise.all([
          api.sermons.getAll(),
          api.events.getAll()
        ]);

        console.log('Home: Fetched sermons and events', { sermons, events });

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
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Force a re-render of the component when the content context changes
  const { refreshTrigger, content } = useContext(ContentContext);
  const [localRefreshTrigger, setLocalRefreshTrigger] = useState(0);

  useEffect(() => {
    console.log('Home: Content context refresh trigger changed, updating local trigger');
    setLocalRefreshTrigger(refreshTrigger);
  }, [refreshTrigger]);

  // Log the available content sections
  useEffect(() => {
    if (content) {
      console.log('Home: Available content sections:', Object.keys(content));
      // Log each section's content
      Object.entries(content).forEach(([section, data]) => {
        console.log(`Home: Content for section "${section}":`, {
          title: data.title,
          contentType: typeof data.content,
          contentPreview: typeof data.content === 'string'
            ? data.content.substring(0, 50) + '...'
            : JSON.stringify(data.content).substring(0, 50) + '...'
        });
      });
    }
  }, [content]);

  return (
    <main>
      {/* Hero Section */}
      <section id="home" className="hero">
        <DynamicContent
          key={`hero-${localRefreshTrigger}`}
          section="hero"
          fallback={
            <div className="hero-content">
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
          }
          renderContent={(content) => {
            console.log('Hero renderContent called with:', content);
            return (
              <div className="hero-content">
                <h2>{content.title}</h2>
                {typeof content.content === 'string' && (
                  <div dangerouslySetInnerHTML={{ __html: content.content }} />
                )}
                <div className="hero-buttons">
                  <a href="#about" className="btn btn-primary">Learn More</a>
                  <Link to="/contact" className="btn btn-secondary">Plan Your Visit</Link>
                </div>
                <div className="service-times">
                  <p><FontAwesomeIcon icon={faClock} /> Sunday Service: 9:00 AM</p>
                  <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Dar es Salaam, Tanzania</p>
                </div>
              </div>
            );
          }}
        />
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
              console.log('About renderContent called with:', content);
              return (
                <div className="about-content">
                  <div className="about-text">
                    {typeof content.content === 'string' && (
                      <div dangerouslySetInnerHTML={{ __html: content.content }} />
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
              console.log('Vision renderContent called with:', content);
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
                      <div dangerouslySetInnerHTML={{ __html: content.content }} />
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
              console.log('Mission renderContent called with:', content);
              return (
                <div className="mission-content">
                  <div className="mission-text">
                    {typeof content.content === 'string' && (
                      <div dangerouslySetInnerHTML={{ __html: content.content }} />
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
                    const day = eventDate.getDate();
                    const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();

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
                          <Link to={`/events#${event._id}`} className="btn btn-sm">Learn More</Link>
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
