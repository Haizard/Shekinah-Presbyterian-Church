import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

/**
 * Component for rendering the "leadership" structured content
 */
const LeadershipRenderer = ({ content }) => {
  // Parse content if it's a string
  let leadershipData;
  try {
    leadershipData = typeof content === 'string' ? JSON.parse(content) : content;
  } catch (error) {
    // Return null to show nothing if parsing fails
    return null;
  }

  // Ensure we have a valid leadership data structure
  if (!leadershipData || !leadershipData.leaders || !Array.isArray(leadershipData.leaders) || leadershipData.leaders.length === 0) {
    // Return null to show nothing if data is invalid or empty
    return null;
  }

  return (
    <div className="leadership-content">
      <div className="leadership-intro">
        <p>{leadershipData.introduction || 'Our church is led by a team of dedicated pastors and elders who are committed to serving Christ and His people with integrity and compassion.'}</p>
      </div>
      <div className="leadership-grid">
        {leadershipData.leaders.map((leader, index) => (
          <div className="leader-card" key={`leader-${leader.name}-${index}`}>
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
