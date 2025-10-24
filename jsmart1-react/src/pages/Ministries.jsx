import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import DynamicContent from '../components/DynamicContent';
import VideoGallery from '../components/VideoGallery';
import '../styles/Ministries.css';
import '../styles/modern-ministries.css';
import api from '../services/api';
import { getImageUrl, handleImageError, debugImage } from '../utils/imageUtils';

const Ministries = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [ministries, setMinistries] = useState([]);
  const [ministrySections, setMinistrySections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ministries and ministry sections from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ministriesData, sectionsData] = await Promise.all([
          api.ministries.getAll(),
          api.ministrySections.getAll()
        ]);

        console.log('Fetched ministries data:', ministriesData);
        console.log('Fetched ministry sections:', sectionsData);

        setMinistries(ministriesData);
        setMinistrySections(sectionsData.sort((a, b) => a.order - b.order));
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load ministries. Please try again.');

        // Fallback to sample data if API fails
        setMinistries([
          {
            _id: '1',
            title: 'Worship Ministry',
            category: 'worship',
            description: 'Our worship ministry leads the congregation in praise and worship, creating an atmosphere for encountering God through music, prayer, and the arts.',
            image: '/images/SPCT/CHURCH.jpg',
            leader: 'John Doe',
            meetingTime: 'Rehearsals: Saturdays at 4:00 PM'
          },
          {
            _id: '2',
            title: 'Children\'s Ministry',
            category: 'children',
            description: 'We provide a safe, fun, and Bible-based environment where children can learn about Jesus and grow in their faith through age-appropriate activities.',
            image: '/images/SPCT/CHURCH.jpg',
            leader: 'Jane Smith',
            meetingTime: 'Sundays during service'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter ministries based on category
  const filteredMinistries = activeCategory === 'all'
    ? ministries
    : ministries.filter(ministry => ministry.category === activeCategory);

  return (
    <main className="ministries-page">
      {/* Page Banner */}
      <section className="page-banner">
        <div className="container">
          <h2>Ministries</h2>
          <p>Serving God and others through various areas of ministry</p>
        </div>
      </section>

      {/* Ministries Introduction */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>How We Serve</h2>
            <div className="divider" />
          </div>
          <DynamicContent
            section="how_we_serve"
            className="ministries-intro"
            fallback={
              <div className="ministries-intro">
                <p>Ministry is not just what we do — it's who we are. We serve with the conviction that the Gospel of Christ transforms lives, families, communities, and nations.</p>
                <p>Whether you're called to pray, serve, donate, or spread the word — there's a place for you in this mission. We invite you to explore our ministries and find where God is calling you to get involved.</p>
                <div className="ministry-buttons">
                  <a href="#worship" className="btn btn-sm">Worship</a>
                  <a href="#discipleship" className="btn btn-sm">Discipleship</a>
                  <a href="#children" className="btn btn-sm">Children</a>
                  <a href="#youth" className="btn btn-sm">Youth</a>
                  <a href="#outreach" className="btn btn-sm">Outreach</a>
                  <a href="#missions" className="btn btn-sm">Missions</a>
                  <a href="#prayer" className="btn btn-sm">Prayer</a>
                </div>
              </div>
            }
            showContent={false}
            renderContent={(content) => {
              // Use the imported components
              const HowWeServeRenderer = lazy(() => import('../components/structured/HowWeServeRenderer'));

              return (
                <div className="ministries-intro">
                  <Suspense fallback={<div>Loading...</div>}>
                    <HowWeServeRenderer content={content.content} image={content.image} />
                  </Suspense>

                  <div className="ministry-buttons">
                    <a href="#worship" className="btn btn-sm">Worship</a>
                    <a href="#discipleship" className="btn btn-sm">Discipleship</a>
                    <a href="#children" className="btn btn-sm">Children</a>
                    <a href="#youth" className="btn btn-sm">Youth</a>
                    <a href="#outreach" className="btn btn-sm">Outreach</a>
                    <a href="#missions" className="btn btn-sm">Missions</a>
                    <a href="#prayer" className="btn btn-sm">Prayer</a>
                  </div>
                </div>
              );
            }}
          />
        </div>
      </section>

      {/* Ministries Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Ministries</h2>
            <div className="divider" />
          </div>
          <div className="ministries-intro">
            <p>We believe that every believer is called to serve. Our ministries provide opportunities for you to use your gifts, grow in your faith, and make a difference in the lives of others.</p>
            <p>Explore our ministries below and find where you can connect and serve.</p>
          </div>

          {/* Ministry Categories */}
          <div className="ministry-categories">
            <button
              type="button"
              className={activeCategory === 'all' ? 'active' : ''}
              onClick={() => setActiveCategory('all')}
            >
              All Ministries
            </button>
            <button
              type="button"
              className={activeCategory === 'worship' ? 'active' : ''}
              onClick={() => setActiveCategory('worship')}
            >
              Worship
            </button>
            <button
              type="button"
              className={activeCategory === 'children' ? 'active' : ''}
              onClick={() => setActiveCategory('children')}
            >
              Children
            </button>
            <button
              type="button"
              className={activeCategory === 'youth' ? 'active' : ''}
              onClick={() => setActiveCategory('youth')}
            >
              Youth
            </button>
            <button
              type="button"
              className={activeCategory === 'adults' ? 'active' : ''}
              onClick={() => setActiveCategory('adults')}
            >
              Adults
            </button>
            <button
              type="button"
              className={activeCategory === 'prayer' ? 'active' : ''}
              onClick={() => setActiveCategory('prayer')}
            >
              Prayer
            </button>
            <button
              type="button"
              className={activeCategory === 'outreach' ? 'active' : ''}
              onClick={() => setActiveCategory('outreach')}
            >
              Outreach
            </button>
            <button
              type="button"
              className={activeCategory === 'discipleship' ? 'active' : ''}
              onClick={() => setActiveCategory('discipleship')}
            >
              Discipleship
            </button>
          </div>

          {/* Ministries Grid */}
          {loading ? (
            <div className="loading-container">
              <div className="spinner" />
              <p>Loading ministries...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
            </div>
          ) : (
            <div className="ministries-grid">
              {filteredMinistries.length > 0 ? (
                filteredMinistries.map(ministry => (
                  <div className="ministry-card" key={ministry._id}>
                    <div className="ministry-image">
                      <img
                        src={getImageUrl(ministry.image)}
                        alt={ministry.title}
                        onError={(e) => handleImageError(e)}
                        onLoad={() => debugImage(ministry.image, 'MinistryCard')}
                      />
                    </div>
                    <div className="ministry-details">
                      <h3>{ministry.title}</h3>
                      <p className="ministry-leader"><strong>Leader:</strong> {ministry.leader}</p>
                      <p className="ministry-time"><strong>Meeting Time:</strong> {ministry.meetingTime}</p>
                      <p className="ministry-description">
                        {ministry.description && typeof ministry.description === 'string'
                          ? `${ministry.description.replace(/<[^>]*>/g, '').substring(0, 100)}...`
                          : 'No description available'}
                      </p>
                      <Link to={`/ministries/${ministry._id}`} className="btn btn-sm">Learn More</Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>No ministries found in this category.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Get Involved</h2>
            <div className="divider" />
          </div>
          <div className="get-involved-content">
            <div className="get-involved-text">
              <p>We believe that every member of the body of Christ has been gifted by God to serve others and build up the church. Whether you're interested in working with children, leading worship, serving the community, or using your administrative skills, there's a place for you to serve at Shekinah Presbyterian Church Tanzania.</p>
              <p>Not sure where to start? Take our spiritual gifts assessment to discover how God has uniquely equipped you to serve.</p>
              <div className="get-involved-buttons">
                <Link to="/spiritual-gifts" className="btn btn-primary">Take Spiritual Gifts Assessment</Link>
                <Link to="/volunteer" className="btn btn-secondary">Volunteer Application</Link>
              </div>
            </div>
            <div className="get-involved-steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Discover Your Gifts</h3>
                <p>Take our spiritual gifts assessment to identify your God-donationn abilities and passions.</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Explore Opportunities</h3>
                <p>Learn about our various ministries and find where your gifts can be best utilized.</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Connect with Leaders</h3>
                <p>Meet with ministry leaders to discuss how you can get involved and make a difference.</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h3>Serve with Purpose</h3>
                <p>Begin serving in a ministry that aligns with your gifts, passions, and availability.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Ministry Sections - Dynamic */}
      {ministrySections.length > 0 ? (
        ministrySections.map((section, index) => (
          <section
            key={section._id}
            id={section.sectionId}
            className={`section ${index % 2 === 1 ? 'bg-light' : ''}`}
          >
            <div className="container">
              <div className={`ministry-content ${index % 2 === 0 ? 'reverse' : ''}`}>
                <div className="ministry-image">
                  <img
                    src={getImageUrl(section.image) || '/images/SPCT/CHURCH.jpg'}
                    alt={section.title}
                    onError={(e) => handleImageError(e)}
                  />
                </div>
                <div className="ministry-details">
                  <h2>{section.title}</h2>
                  <div className="divider" />
                  <p>{section.description}</p>
                  {section.focusAreas && section.focusAreas.length > 0 && (
                    <>
                      <h3>Focus Areas:</h3>
                      <ul className="ministry-list">
                        {section.focusAreas.map((area, idx) => (
                          <li key={idx}>
                            <FontAwesomeIcon icon={area.icon || 'star'} /> {area.text}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <Link to={`/ministries/${section.sectionId}`} className="btn btn-primary">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))
      ) : (
        <section className="section">
          <div className="container">
            <p className="text-center">No ministry sections available. Please check back soon.</p>
          </div>
        </section>
      )}

      {/* Video Gallery Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Ministry Videos</h2>
            <div className="divider" />
          </div>
          <VideoGallery />
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2 className="animate-fade-in">Ready to Make a Difference?</h2>
          <p className="animate-fade-in" style={{animationDelay: '0.2s'}}>Join one of our ministry teams and use your gifts to serve God and others</p>
          <Link to="/contact" className="btn btn-primary btn-lg animate-slide-bottom" style={{animationDelay: '0.4s'}}>
            Contact Us to Get Started <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Ministries;
