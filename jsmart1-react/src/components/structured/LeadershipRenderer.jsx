import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

/**
 * Renders leadership team content from structured data
 */
const LeadershipRenderer = ({ content }) => {
  // Parse the content if it's a string
  let leadershipData;
  try {
    leadershipData = typeof content === 'string' 
      ? JSON.parse(content) 
      : content;
  } catch (error) {
    console.error('LeadershipRenderer: Error parsing leadership data:', error);
    return (
      <div className="leadership-content">
        <p>Error loading leadership data. Please try again later.</p>
      </div>
    );
  }

  // If we don't have valid leadership data, show an error
  if (!leadershipData || !leadershipData.leaders || !Array.isArray(leadershipData.leaders)) {
    console.error('LeadershipRenderer: Invalid leadership data format:', leadershipData);
    return (
      <div className="leadership-content">
        <p>Invalid leadership data format. Please check your content structure.</p>
      </div>
    );
  }

  return (
    <div className="leadership-content">
      <div className="leadership-intro">
        <p>{leadershipData.introduction || 'Our church is led by a team of dedicated pastors and elders who are committed to serving Christ and His people with integrity and compassion.'}</p>
      </div>
      <div className="leadership-grid">
        {leadershipData.leaders.map((leader, index) => (
          <div className="leader-card" key={index}>
            <div className="leader-image">
              <img 
                src={getImageUrl(leader.image)} 
                alt={leader.name} 
                onError={(e) => handleImageError(e)}
              />
            </div>
            <div className="leader-details">
              <h3>{leader.name}</h3>
              <p className="leader-title">{leader.position}</p>
              {leader.bio && <p className="leader-bio">{leader.bio}</p>}
              <div className="leader-social">
                <a href="/" aria-label="Facebook"><FontAwesomeIcon icon={['fab', 'facebook-f']} /></a>
                <a href="/" aria-label="Twitter"><FontAwesomeIcon icon={['fab', 'twitter']} /></a>
                <a href="/" aria-label="Instagram"><FontAwesomeIcon icon={['fab', 'instagram']} /></a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadershipRenderer;
