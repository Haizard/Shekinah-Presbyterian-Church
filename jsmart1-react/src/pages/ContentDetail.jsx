import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SocialShare from '../components/SocialShare';
import ContentContext from '../context/ContentContext';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import ContentRendererFactory from '../components/structured/ContentRendererFactory';
import '../styles/ContentDetail.css';

const ContentDetail = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const { getContentBySection } = useContext(ContentContext);
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get human-readable section name
  const getSectionTitle = (section) => {
    const sectionMap = {
      'about_us': 'About Us',
      'vision': 'Our Vision',
      'mission': 'Our Mission',
      'values': 'Our Values',
      'history': 'Our History',
      'leadership': 'Our Leadership',
      'weekly_schedule': 'Weekly Schedule',
      'featured_event': 'Featured Event',
      'how_we_serve': 'How We Serve',
      // Add more sections as needed
    };

    return sectionMap[section] || section.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get back link based on section
  const getBackLink = (section) => {
    const linkMap = {
      'about_us': '/about',
      'vision': '/about',
      'mission': '/about',
      'values': '/about',
      'history': '/about',
      'leadership': '/about',
      'weekly_schedule': '/',
      'featured_event': '/events',
      'how_we_serve': '/ministries',
      // Add more sections as needed
    };

    return linkMap[section] || '/';
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const data = await getContentBySection(section);

        if (!data) {
          setError('Content not found');
          return;
        }

        setContentData(data);
        setError(null);

        // Scroll to top when content loads
        window.scrollTo(0, 0);
      } catch (err) {
        console.error(`Error fetching content for section ${section}:`, err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [section, getContentBySection]);

  return (
    <main style={{ padding: '60px 0', minHeight: '70vh' }}>
      <div className="container">
        <div style={{ marginBottom: '20px' }}>
          <Link to={getBackLink(section)} style={{ display: 'inline-flex', alignItems: 'center', color: '#333', textDecoration: 'none', fontWeight: '500' }}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '8px' }} /> Back to {getSectionTitle(section).split(' ')[0]}
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div style={{
              margin: '0 auto 20px',
              width: '50px',
              height: '50px',
              border: '5px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '50%',
              borderTopColor: 'var(--primary-color)',
              animation: 'spin 1s ease-in-out infinite'
            }} />
            <p>Loading content...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <p style={{ marginBottom: '20px', color: '#666' }}>{error}</p>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-primary">Go Back</button>
          </div>
        ) : contentData ? (
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '30px',
              backgroundColor: 'var(--primary-color)',
              color: 'white'
            }}>
              <h1 style={{ margin: '0', fontSize: '2.2rem' }}>{contentData.title || getSectionTitle(section)}</h1>
            </div>

            <div style={{ padding: '30px' }}>
              {contentData.image && (
                <div style={{
                  marginBottom: '30px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  maxHeight: '400px'
                }}>
                  <img
                    src={getImageUrl(contentData.image)}
                    alt={contentData.title || getSectionTitle(section)}
                    onError={(e) => handleImageError(e)}
                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                  />
                </div>
              )}

              <div style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>
                <ContentRendererFactory
                  section={section}
                  content={contentData.content}
                />
              </div>

              <div style={{
                marginTop: '30px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '5px'
              }}>
                <SocialShare
                  title={contentData.title || getSectionTitle(section)}
                  description={`Learn more about ${contentData.title || getSectionTitle(section)}`}
                />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <h2>Content Not Found</h2>
            <p style={{ marginBottom: '20px', color: '#666' }}>The content you're looking for doesn't exist or has been removed.</p>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-primary">Go Back</button>
          </div>
        )}
        </div>
      </main>
  );
};

export default ContentDetail;
