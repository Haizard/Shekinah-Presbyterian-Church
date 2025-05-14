import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClock, faMapMarkerAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import SocialShare from '../components/SocialShare';
import api from '../services/api';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import '../styles/MinistryDetail.css';

const MinistryDetail = () => {
  const { id } = useParams();
  const [ministry, setMinistry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMinistry = async () => {
      try {
        setLoading(true);
        const data = await api.ministries.getById(id);
        setMinistry(data);
        setError(null);

        // Scroll to top when ministry loads
        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Error fetching ministry:', err);
        setError('Failed to load ministry details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMinistry();
  }, [id]);

  return (
    <main style={{ padding: '60px 0', minHeight: '70vh' }}>
      <div className="container">
        <div style={{ marginBottom: '20px' }}>
          <Link to="/ministries" style={{ display: 'inline-flex', alignItems: 'center', color: '#333', textDecoration: 'none', fontWeight: '500' }}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '8px' }} /> Back to Ministries
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
            <p>Loading ministry details...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <p style={{ marginBottom: '20px', color: '#666' }}>{error}</p>
            <Link to="/ministries" className="btn btn-primary">Return to Ministries</Link>
          </div>
        ) : ministry ? (
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '30px',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              position: 'relative'
            }}>
              <h1 style={{ margin: '0 0 15px 0', fontSize: '2.2rem' }}>{ministry.name}</h1>
              {ministry.category && (
                <div style={{
                  display: 'inline-block',
                  padding: '5px 12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>{ministry.category}</div>
              )}
            </div>

            <div style={{ padding: '30px' }}>
              <div style={{
                marginBottom: '30px',
                borderRadius: '8px',
                overflow: 'hidden',
                maxHeight: '400px'
              }}>
                <img
                  src={getImageUrl(ministry.image)}
                  alt={ministry.name}
                  onError={(e) => handleImageError(e)}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                />
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                marginBottom: '30px',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
              }}>
                {ministry.leader && (
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '1rem' }}>
                    <FontAwesomeIcon icon={faUsers} style={{ marginRight: '10px', color: 'var(--primary-color)' }} />
                    <span><strong>Leader:</strong> {ministry.leader}</span>
                  </div>
                )}
                {ministry.meetingTime && (
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '1rem' }}>
                    <FontAwesomeIcon icon={faClock} style={{ marginRight: '10px', color: 'var(--primary-color)' }} />
                    <span><strong>Meeting Time:</strong> {ministry.meetingTime}</span>
                  </div>
                )}
                {ministry.location && (
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '1rem' }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '10px', color: 'var(--primary-color)' }} />
                    <span><strong>Location:</strong> {ministry.location}</span>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '30px', lineHeight: '1.6', fontSize: '1.1rem' }}>
                {ministry.description ? (
                  <div dangerouslySetInnerHTML={{ __html: ministry.description }} />
                ) : (
                  <p>No description available for this ministry.</p>
                )}
              </div>

              {ministry.vision && (
                <div style={{
                  marginBottom: '30px',
                  paddingTop: '20px',
                  borderTop: '1px solid #eee'
                }}>
                  <h3 style={{ marginBottom: '15px', color: 'var(--primary-color)', fontSize: '1.5rem' }}>Our Vision</h3>
                  <div dangerouslySetInnerHTML={{ __html: ministry.vision }} />
                </div>
              )}

              {ministry.activities && (
                <div style={{
                  marginBottom: '30px',
                  paddingTop: '20px',
                  borderTop: '1px solid #eee'
                }}>
                  <h3 style={{ marginBottom: '15px', color: 'var(--primary-color)', fontSize: '1.5rem' }}>Activities</h3>
                  <div dangerouslySetInnerHTML={{ __html: ministry.activities }} />
                </div>
              )}

              <div style={{ marginTop: '30px' }}>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                  <Link to="/contact" className="btn btn-primary">
                    Get Involved
                  </Link>
                  <Link to="/ministries" className="btn btn-secondary">
                    Explore Other Ministries
                  </Link>
                </div>

                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '5px'
                }}>
                  <SocialShare
                    title={ministry.name}
                    description={`Learn more about ${ministry.name} at our church`}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <h2>Ministry Not Found</h2>
            <p style={{ marginBottom: '20px', color: '#666' }}>The ministry you're looking for doesn't exist or has been removed.</p>
            <Link to="/ministries" className="btn btn-primary">Browse All Ministries</Link>
          </div>
        )}
        </div>
      </main>
  );
};

export default MinistryDetail;
