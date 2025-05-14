import React, { useState, useEffect, useContext } from 'react';
import DynamicContent from './DynamicContent';
import ContentContext from '../context/ContentContext';
import api from '../services/api';
import '../styles/Leadership.css';

/**
 * Leadership component that displays church leadership information
 * Uses the same pattern as WeeklySchedule and other components
 * Relies on ContentRendererFactory and LeadershipRenderer for rendering
 */
const Leadership = () => {
  // State for leadership data
  const [leadershipData, setLeadershipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the content context for creating sample data
  const { createOrUpdateContent, refreshContent } = useContext(ContentContext);

  // Fetch leadership data directly from API
  const fetchLeadershipData = async () => {
    try {
      setLoading(true);
      // Direct API call similar to Events component
      const data = await api.content.getBySection('leadership');

      if (data?.content) {
        setLeadershipData(data);
      } else {
        setLeadershipData(null);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load leadership data');
      setLeadershipData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchLeadershipData();

    // Set up a refresh function on the window object
    if (typeof window !== 'undefined') {
      if (!window.refreshDynamicContent) {
        window.refreshDynamicContent = {};
      }
      window.refreshDynamicContent.leadership = fetchLeadershipData;
    }

    // Clean up the refresh function when component unmounts
    return () => {
      if (typeof window !== 'undefined' && window.refreshDynamicContent) {
        window.refreshDynamicContent.leadership = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to create sample leadership content for testing (only available in development)
  const createSampleLeadershipContent = async () => {
    try {
      if (!createOrUpdateContent) {
        alert('Cannot create content: createOrUpdateContent function not available');
        return;
      }

      // Create sample leadership data
      const sampleLeadershipData = {
        section: 'leadership',
        title: 'Our Leadership',
        content: JSON.stringify({
          introduction: 'Meet our dedicated leadership team who guide our church with wisdom and compassion.',
          leaders: [
            {
              name: 'Dr. Daniel John',
              position: 'Senior Pastor',
              bio: 'Dr. Daniel John Seni is the senior pastor and one of the founders of our church.',
              image: '/images/SPCT/Rev. Dr. Daniel John Seni (senior pastor, and one of the founder).jpg'
            },
            {
              name: 'Mwl. Boyeon Lee',
              position: 'Missionary',
              bio: 'Mwl. Boyeon Lee is a missionary and one of the founders of our church.',
              image: '/images/SPCT/Mwl. Boyeon Lee (Missionary and one of the founder).jpg'
            },
            {
              name: 'Rev. Emanuel Nzelah',
              position: 'Deputy Overseer',
              bio: 'Rev. Emanuel Nzelah serves as the deputy overseer of our church.',
              image: '/images/SPCT/Rev. Emanuel Nzelah (deputy overseer).jpg'
            }
          ]
        })
      };

      // Create or update the leadership content
      const result = await createOrUpdateContent(sampleLeadershipData);

      if (result) {
        alert('Sample leadership content created successfully! Refreshing...');
        refreshContent();
        // Refresh the leadership data
        fetchLeadershipData();
      } else {
        alert('Failed to create sample leadership content.');
      }
    } catch (error) {
      console.error('Error creating sample leadership content:', error);
      alert(`Error creating sample leadership content: ${error.message}`);
    }
  };

  return (
    <div className="leadership-section">
      {/* Admin controls for development environment only */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="admin-controls" style={{ marginBottom: '1rem', textAlign: 'right' }}>
          <button
            type="button"
            onClick={createSampleLeadershipContent}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#e6f7ff',
              border: '1px solid #91d5ff',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            Create Sample Leadership Data
          </button>
        </div>
      )}

      {/* Display loading state */}
      {loading && (
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading leadership data...</p>
        </div>
      )}

      {/* Display error state */}
      {error && !loading && (
        <div className="error-container">
          <p>{error}</p>
        </div>
      )}

      {/* Display leadership data if available */}
      {!loading && !error && leadershipData?.content && (
        <div className="leadership-content">
          {(() => {
            // Parse content for leadership details
            let parsedData = {};
            try {
              if (typeof leadershipData.content === 'string') {
                if (leadershipData.content.startsWith('{') && leadershipData.content.endsWith('}')) {
                  parsedData = JSON.parse(leadershipData.content);
                }
              }
            } catch (error) {
              return null; // Return nothing if parsing fails
            }

            // If we have valid leadership data with leaders array, render it
            if (parsedData?.leaders && Array.isArray(parsedData.leaders) && parsedData.leaders.length > 0) {
              return (
                <>
                  <div className="leadership-intro">
                    <p>{parsedData.introduction || 'Our church is led by a team of dedicated pastors and elders who are committed to serving Christ and His people with integrity and compassion.'}</p>
                  </div>
                  <div className="leadership-grid">
                    {parsedData.leaders.map((leader, index) => (
                      <div className="leader-card" key={`leader-${leader.name}-${index}`}>
                        <div className="leader-image">
                          <img
                            src={leader.image}
                            alt={leader.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/SPCT/CHURCH.jpg';
                            }}
                          />
                        </div>
                        <div className="leader-details">
                          <h3>{leader.name}</h3>
                          <p className="leader-title">{leader.position}</p>
                          {leader.bio && <p className="leader-bio">{leader.bio}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              );
            }

            // Return null if no valid data
            return null;
          })()}
        </div>
      )}
    </div>
  );
};

export default Leadership;
