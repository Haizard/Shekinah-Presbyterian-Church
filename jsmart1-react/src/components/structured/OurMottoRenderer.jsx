import React from 'react';

/**
 * Component for rendering the "motto" structured content
 * Follows the same pattern as other content renderers
 */
const OurMottoRenderer = ({ content }) => {
  // Parse content if it's a string
  let mottoData;
  try {
    mottoData = typeof content === 'string' ? JSON.parse(content) : content;
  } catch (error) {
    console.error('Error parsing motto data:', error);
    // If parsing fails, try to use the content as is
    mottoData = {
      mottoText: typeof content === 'string' ? content : 'Our Motto',
      verseReference: '',
      explanation: ''
    };
  }

  // If mottoData is not an object, create a default object
  if (!mottoData || typeof mottoData !== 'object') {
    mottoData = {
      mottoText: 'Our Motto',
      verseReference: '',
      explanation: ''
    };
  }

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
