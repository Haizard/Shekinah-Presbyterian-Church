import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPlay, faHeadphones, faDownload, faFileAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
// Import our modern design system
import '../styles/main.css';
import '../styles/modern-home.css';
import '../styles/modern-about.css';
import '../styles/modern-events.css';
import '../styles/modern-sermons.css';
import api from '../services/api';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

const Sermons = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sermons from API
  useEffect(() => {
    const fetchSermons = async () => {
      try {
        setLoading(true);
        const data = await api.sermons.getAll();
        console.log('Fetched sermons:', data);
        setSermons(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching sermons:', err);
        setError('Failed to load sermons. Please try again.');

        // Fallback to sample data if API fails
        setSermons([
          {
            _id: '1',
            title: 'Walking in Faith',
            preacher: 'Rev. Dr. Daniel John Seni',
            date: 'June 5, 2023',
            scripture: 'Hebrews 11:1-6',
            category: 'faith',
            image: '/images/SPCT/CHURCH.jpg',
            audioUrl: '#',
            description: 'This sermon explores what it means to walk by faith and not by sight, drawing from the examples of the heroes of faith in Hebrews 11.'
          },
          {
            _id: '2',
            title: 'The Power of Prayer',
            preacher: 'Rev. Emanuel Nzelah',
            date: 'May 29, 2023',
            scripture: 'James 5:13-18',
            category: 'prayer',
            image: '/images/SPCT/CHURCH.jpg',
            audioUrl: '#',
            description: 'An exploration of the transformative power of prayer in the life of a believer and the community of faith.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSermons();
  }, []);

  // Filter sermons based on category and search term
  const filteredSermons = sermons.filter(sermon => {
    const matchesCategory = filter === 'all' || sermon.category === filter;
    const matchesSearch = sermon.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (sermon.preacher || sermon.speaker)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sermon.scripture?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="sermons-page">
      {/* Page Banner */}
      <section className="page-banner">
        <div className="container">
          <h2 className="animate-fade-in">Sermons</h2>
          <p className="animate-fade-in" style={{animationDelay: '0.2s'}}>Listen to the Word of God preached with clarity and conviction</p>
        </div>
      </section>

      {/* Current Series Section */}
      <section className="section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Current Series</h2>
            <div className="divider" />
          </div>
          <div className="current-series animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="series-image">
              <img src="/images/SPCT/CHURCH.jpg" alt="Current Sermon Series" />
            </div>
            <div className="series-details">
              <h3>Walking in Faith</h3>
              <p className="series-description">A journey through the book of Hebrews exploring what it means to live by faith in today's world.</p>
              <p className="series-meta">June 2023 - August 2023</p>
              <Link to="/sermons/series/faith" className="btn btn-primary btn-lg">
                View Series <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sermons Section */}
      <section className="section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Latest Sermons</h2>
            <div className="divider" />
          </div>

          {/* Search and Filter */}
          <div className="sermons-filters animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search sermons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="button"><FontAwesomeIcon icon={faSearch} /></button>
            </div>
            <div className="category-filter">
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="faith">Faith</option>
                <option value="prayer">Prayer</option>
                <option value="discipleship">Discipleship</option>
                <option value="gospel">Gospel</option>
                <option value="holy-spirit">Holy Spirit</option>
                <option value="grace">Grace</option>
              </select>
            </div>
          </div>

          {/* Sermons Grid */}
          <div className="sermons-grid">
            {loading ? (
              <div className="loading-container">
                <div className="spinner" />
                <p>Loading sermons...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <FontAwesomeIcon icon="exclamation-circle" className="error-icon" />
                <p className="error-message">{error}</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>Try Again</button>
              </div>
            ) : filteredSermons.length > 0 ? (
              filteredSermons.map((sermon, index) => (
                <div
                  className="sermon-card animate-slide-bottom"
                  key={sermon._id}
                  style={{animationDelay: `${0.1 * (index + 1)}s`}}
                >
                  <div className="sermon-thumbnail">
                    <img
                      src={getImageUrl(sermon.image)}
                      alt={sermon.title}
                      onError={(e) => handleImageError(e)}
                    />
                    <div className="play-button">
                      <FontAwesomeIcon icon={faPlay} />
                    </div>
                  </div>
                  <div className="sermon-details">
                    <h3>{sermon.title}</h3>
                    <p className="sermon-meta">{sermon.preacher || sermon.speaker} | {sermon.date}</p>
                    <p className="sermon-verse">{sermon.scripture}</p>
                    <p className="sermon-description">{sermon.description}</p>
                    <div className="sermon-links">
                      {sermon.audioUrl && (
                        <a href={sermon.audioUrl} className="underline-effect">
                          <FontAwesomeIcon icon={faHeadphones} /> Listen
                        </a>
                      )}
                      {sermon.videoUrl && (
                        <a href={sermon.videoUrl} className="underline-effect">
                          <FontAwesomeIcon icon={faPlay} /> Watch
                        </a>
                      )}
                      {sermon.notesUrl && (
                        <a href={sermon.notesUrl} className="underline-effect">
                          <FontAwesomeIcon icon={faFileAlt} /> Notes
                        </a>
                      )}
                      {sermon.audioUrl && (
                        <a href={sermon.audioUrl} download className="underline-effect">
                          <FontAwesomeIcon icon={faDownload} /> Download
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FontAwesomeIcon icon="bible" className="empty-state-icon" />
                <p className="empty-state-title">No sermons found matching your criteria</p>
                <p className="empty-state-description">Please try a different search or filter</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="pagination animate-fade-in" style={{animationDelay: '0.5s'}}>
            <button type="button" className="active">1</button>
            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button"><FontAwesomeIcon icon="chevron-right" /></button>
          </div>
        </div>
      </section>

      {/* Series Section */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Sermon Series</h2>
            <div className="divider" />
          </div>
          <div className="series-grid">
            <div className="series-card animate-slide-bottom" style={{animationDelay: '0.1s'}}>
              <div className="series-image">
                <img src="/images/SPCT/CHURCH.jpg" alt="Foundations of Faith" />
              </div>
              <div className="series-details">
                <h3>Foundations of Faith</h3>
                <p>A 6-part series exploring the core beliefs of the Christian faith</p>
                <a href="/sermons/series/foundations" className="btn btn-primary btn-sm">
                  View Series <FontAwesomeIcon icon={faArrowRight} />
                </a>
              </div>
            </div>
            <div className="series-card animate-slide-bottom" style={{animationDelay: '0.2s'}}>
              <div className="series-image">
                <img src="/images/SPCT/CHURCH.jpg" alt="Kingdom Living" />
              </div>
              <div className="series-details">
                <h3>Kingdom Living</h3>
                <p>A study of the Sermon on the Mount and its implications for daily life</p>
                <a href="/sermons/series/kingdom" className="btn btn-primary btn-sm">
                  View Series <FontAwesomeIcon icon={faArrowRight} />
                </a>
              </div>
            </div>
            <div className="series-card animate-slide-bottom" style={{animationDelay: '0.3s'}}>
              <div className="series-image">
                <img src="/images/SPCT/CHURCH.jpg" alt="Spiritual Disciplines" />
              </div>
              <div className="series-details">
                <h3>Spiritual Disciplines</h3>
                <p>Practical guidance on prayer, Bible study, fasting, and more</p>
                <a href="/sermons/series/disciplines" className="btn btn-primary btn-sm">
                  View Series <FontAwesomeIcon icon={faArrowRight} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Subscribe to Our Sermons</h2>
            <div className="divider" />
          </div>
          <div className="subscribe-content animate-fade-in" style={{animationDelay: '0.2s'}}>
            <p>Never miss a sermon! Subscribe to our podcast and receive the latest messages directly on your device.</p>
            <div className="podcast-platforms">
              <a href="https://apple.com/podcasts" target="_blank" rel="noopener noreferrer" className="podcast-link animate-slide-bottom" style={{animationDelay: '0.3s'}}>
                <FontAwesomeIcon icon={['fab', 'apple']} />
                <span>Apple Podcasts</span>
              </a>
              <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="podcast-link animate-slide-bottom" style={{animationDelay: '0.4s'}}>
                <FontAwesomeIcon icon={['fab', 'spotify']} />
                <span>Spotify</span>
              </a>
              <a href="https://podcasts.google.com" target="_blank" rel="noopener noreferrer" className="podcast-link animate-slide-bottom" style={{animationDelay: '0.5s'}}>
                <FontAwesomeIcon icon={['fab', 'google']} />
                <span>Google Podcasts</span>
              </a>
              <a href="/rss-feed" className="podcast-link animate-slide-bottom" style={{animationDelay: '0.6s'}}>
                <FontAwesomeIcon icon="rss" />
                <span>RSS Feed</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2 className="animate-fade-in">Join Us This Sunday</h2>
          <p className="animate-fade-in" style={{animationDelay: '0.2s'}}>Experience the presence of God and the fellowship of believers</p>
          <Link to="/contact" className="btn btn-primary btn-lg animate-slide-bottom" style={{animationDelay: '0.4s'}}>
            Plan Your Visit <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Sermons;
