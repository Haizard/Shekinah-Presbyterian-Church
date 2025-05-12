import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandsHelping,
  faUsers,
  faChurch,
  faBookOpen,
  faHeart,
  faPrayingHands,
  faMusic,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';

// Map of icon names to FontAwesome icons
const iconMap = {
  faHandsHelping,
  faUsers,
  faChurch,
  faBookOpen,
  faHeart,
  faPrayingHands,
  faMusic,
  faGraduationCap
};

/**
 * Component for rendering the "how_we_serve" structured content
 */
const HowWeServeRenderer = ({ content }) => {
  console.log('HowWeServeRenderer received content:', content);

  // Handle different content formats
  let parsedContent;

  // If content is a string, try to parse it
  if (typeof content === 'string') {
    try {
      parsedContent = JSON.parse(content);
      console.log('HowWeServeRenderer parsed string content:', parsedContent);
    } catch (error) {
      console.error('Error parsing HowWeServe content:', error);
      return <div>Error rendering content: Invalid JSON format</div>;
    }
  } else {
    // If content is already an object, use it directly
    parsedContent = content;
    console.log('HowWeServeRenderer using object content directly:', parsedContent);
  }

  // If parsedContent is not an array, check if it's nested in a property
  if (!Array.isArray(parsedContent)) {
    // Some content might be structured as { ministryAreas: [...] }
    if (parsedContent?.ministryAreas && Array.isArray(parsedContent.ministryAreas)) {
      parsedContent = parsedContent.ministryAreas;
      console.log('HowWeServeRenderer using nested ministryAreas array:', parsedContent);
    } else {
      // Try to convert to array if it's a single object
      if (typeof parsedContent === 'object' && parsedContent !== null) {
        console.log('HowWeServeRenderer converting single object to array:', parsedContent);
        parsedContent = [parsedContent];
      } else {
        console.error('HowWeServe content is not an array:', parsedContent);
        return <div>Invalid content format: Expected an array of ministry areas</div>;
      }
    }
  }

  return (
    <div className="how-we-serve-grid">
      {parsedContent.map((item, index) => (
        <div className="service-card" key={`service-${item.title || item.icon || index}`}>
          <div className="service-icon">
            {item.icon && iconMap[item.icon] ? (
              <FontAwesomeIcon icon={iconMap[item.icon]} />
            ) : (
              <FontAwesomeIcon icon={faHeart} /> // Default icon
            )}
          </div>
          <div className="service-content">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HowWeServeRenderer;
