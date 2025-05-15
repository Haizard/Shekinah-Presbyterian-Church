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

// Function to get an appropriate icon for a ministry based on its name
const getIconForMinistry = (ministryName) => {
  const name = ministryName.toLowerCase();

  if (name.includes('worship') || name.includes('music')) {
    return 'faMusic';
  } else if (name.includes('prayer') || name.includes('intercession')) {
    return 'faPrayingHands';
  } else if (name.includes('children') || name.includes('youth') || name.includes('teen')) {
    return 'faUsers';
  } else if (name.includes('bible') || name.includes('study') || name.includes('discipleship')) {
    return 'faBookOpen';
  } else if (name.includes('outreach') || name.includes('mission') || name.includes('community')) {
    return 'faHandsHelping';
  } else if (name.includes('education') || name.includes('school') || name.includes('teaching')) {
    return 'faGraduationCap';
  } else if (name.includes('church') || name.includes('sanctuary')) {
    return 'faChurch';
  } else {
    return 'faHeart'; // Default icon
  }
};

/**
 * Component for rendering the "how_we_serve" structured content
 */
const HowWeServeRenderer = ({ content, image }) => {
  console.log('HowWeServeRenderer received content:', content);
  console.log('HowWeServeRenderer content type:', typeof content);
  console.log('HowWeServeRenderer received image:', image);

  // If content is a string that looks like "[object Object]", it might be a toString() conversion
  if (typeof content === 'string' && content.includes('[object Object]')) {
    console.log('Content appears to be a stringified object that lost its structure');
  }

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
    } else if (parsedContent?.areas && Array.isArray(parsedContent.areas)) {
      // Try another common property name
      parsedContent = parsedContent.areas;
      console.log('HowWeServeRenderer using nested areas array:', parsedContent);
    } else if (parsedContent?.services && Array.isArray(parsedContent.services)) {
      // Try another common property name
      parsedContent = parsedContent.services;
      console.log('HowWeServeRenderer using nested services array:', parsedContent);
    } else {
      // Try to convert to array if it's a single object
      if (typeof parsedContent === 'object' && parsedContent !== null) {
        console.log('HowWeServeRenderer converting single object to array:', parsedContent);
        // Check if the object has title and description properties
        if (parsedContent.title && parsedContent.description) {
          parsedContent = [parsedContent];
        } else {
          // If it's an object with multiple properties, convert each property to an array item
          const items = [];
          Object.keys(parsedContent).forEach(key => {
            if (typeof parsedContent[key] === 'object' && parsedContent[key] !== null) {
              items.push(parsedContent[key]);
            } else if (key !== 'introduction' && key !== 'title') {
              // Create an item from the key-value pair
              items.push({
                title: key,
                description: parsedContent[key]
              });
            }
          });

          if (items.length > 0) {
            parsedContent = items;
          } else {
            parsedContent = [{
              title: 'How We Serve',
              description: JSON.stringify(parsedContent)
            }];
          }
        }
      } else {
        console.error('HowWeServe content is not an array:', parsedContent);
        return <div>Invalid content format: Expected an array of ministry areas</div>;
      }
    }
  }

  // Special handling for the specific format seen in the UI
  if (typeof content === 'string') {
    // Check if it's the specific format with [object Object] followed by ministry names
    if (content.includes('[object Object]')) {
      // Extract the list of items that appear after [object Object]
      const contentLines = content.split('\n');
      const items = [];

      for (const line of contentLines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.includes('[object Object]')) {
          items.push({
            title: trimmedLine,
            description: `Our ${trimmedLine} ministry serves the church and community.`,
            icon: getIconForMinistry(trimmedLine)
          });
        }
      }

      if (items.length > 0) {
        return (
          <div className="how-we-serve-grid">
            {items.map((item) => (
              <div className="service-card" key={`service-${item.title}`}>
                <div className="service-icon">
                  <FontAwesomeIcon icon={iconMap[item.icon] || faHeart} />
                </div>
                <div className="service-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        );
      }
    } else {
      // If it's just a regular string, create a single service item
      return (
        <div className="how-we-serve-grid">
          <div className="service-card">
            <div className="service-icon">
              <FontAwesomeIcon icon={faHeart} />
            </div>
            <div className="service-content">
              <h3>How We Serve</h3>
              <p>{content}</p>
            </div>
          </div>
        </div>
      );
    }
  }

  // Standard rendering for properly formatted data
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
