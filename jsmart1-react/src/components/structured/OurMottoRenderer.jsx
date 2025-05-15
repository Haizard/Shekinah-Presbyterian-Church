import React from 'react';

/**
 * Component for rendering the "motto" structured content
 * Follows the same pattern as other content renderers
 * Enhanced with better error handling and default content
 */
const OurMottoRenderer = ({ content }) => {
  // Default motto data to use as fallback
  const defaultMottoData = {
    mottoText: 'The True Word, The True Gospel, and True Freedom',
    verseReference: 'Matthew 9:35',
    explanation: `
      <p>This motto shapes everything we do. Inspired by the ministry of Jesus—who went through towns and villages teaching, preaching the Gospel of the Kingdom, and healing—we are committed to:</p>
      <ul>
        <li><strong>The True Word</strong> - Teaching the uncompromised Word of God as the foundation of life, discipleship, and mission.</li>
        <li><strong>The True Gospel</strong> - Proclaiming the Good News of Jesus Christ clearly, boldly, and faithfully—calling all people to repentance, faith, and new life.</li>
        <li><strong>True Freedom</strong> - Helping people experience the real freedom found in Christ alone—freedom from sin, fear, brokenness, and spiritual darkness.</li>
      </ul>
    `
  };

  // Parse content if it's a string
  let mottoData;
  try {
    // Check if content is a string and looks like JSON
    if (typeof content === 'string') {
      // Only try to parse if it looks like JSON (starts with { and ends with })
      if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
        mottoData = JSON.parse(content);
      } else if (content.includes('Default content for')) {
        // Handle default content case - use our better defaults
        console.log('Using default motto content instead of placeholder text');
        mottoData = defaultMottoData;
      } else {
        // If it's a string but not JSON, use it as the motto text
        mottoData = {
          mottoText: content,
          verseReference: '',
          explanation: ''
        };
      }
    } else if (typeof content === 'object' && content !== null) {
      // If it's already an object, use it directly
      mottoData = content;
    } else {
      // For null or undefined, use default
      mottoData = defaultMottoData;
    }
  } catch (error) {
    console.error('Error parsing motto data:', error);
    // If parsing fails, use default content
    mottoData = defaultMottoData;
  }

  // Ensure mottoData has all required properties
  mottoData = {
    ...defaultMottoData,
    ...mottoData
  };

  return (
    <div className="motto-content">
      <div className="motto-quote">
        <h3 className="animate-slide-bottom" style={{animationDelay: '0.3s'}}>
          "{mottoData.mottoText || 'The True Word, The True Gospel, and True Freedom'}"
        </h3>
        {mottoData.verseReference && (
          <p className="motto-verse animate-slide-bottom" style={{animationDelay: '0.4s'}}>
            {mottoData.verseReference}
          </p>
        )}
      </div>
      <div className="motto-explanation">
        {mottoData.explanation ? (
          <div dangerouslySetInnerHTML={{ __html: mottoData.explanation }} />
        ) : (
          <p>This motto shapes everything we do in our church and ministry.</p>
        )}
      </div>
    </div>
  );
};

export default OurMottoRenderer;
