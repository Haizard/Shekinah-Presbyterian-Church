import React, { useState, useContext } from 'react';
import ContentContext from '../../context/ContentContext';

/**
 * A simple component to debug content in the ContentContext
 */
const ContentDebugger = () => {
  const { content, debugContent, refreshContent } = useContext(ContentContext);
  const [showDebug, setShowDebug] = useState(false);

  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  const handleRefresh = () => {
    refreshContent();
  };

  return (
    <div className="content-debugger" style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <button 
        onClick={toggleDebug}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          marginRight: '10px'
        }}
      >
        {showDebug ? 'Hide Content Debug' : 'Show Content Debug'}
      </button>
      
      <button 
        onClick={handleRefresh}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px' 
        }}
      >
        Refresh Content
      </button>
      
      {showDebug && (
        <div style={{ marginTop: '20px' }}>
          <h3>Content Sections in Context:</h3>
          <ul>
            {Object.keys(content || {}).map(section => (
              <li key={section} style={{ margin: '10px 0' }}>
                <strong>{section}</strong>: {content[section]?.title || 'No title'} 
                <br />
                <small>Content: {typeof content[section]?.content === 'string' 
                  ? (content[section].content.length > 100 
                    ? content[section].content.substring(0, 100) + '...' 
                    : content[section].content)
                  : 'Not a string'}</small>
              </li>
            ))}
          </ul>
          
          {Object.keys(content || {}).length === 0 && (
            <p>No content sections found in context.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentDebugger;
