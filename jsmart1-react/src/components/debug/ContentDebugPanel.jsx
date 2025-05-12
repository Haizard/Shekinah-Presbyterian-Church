import React, { useContext, useState, useEffect } from 'react';
import ContentContext from '../../context/ContentContext';
import { parseContent } from '../../utils/contentUtils';
import './ContentDebugPanel.css';

/**
 * A debug panel component that shows the current state of content in the ContentContext
 * and allows for debugging content rendering issues.
 */
const ContentDebugPanel = () => {
  const { content, getContentBySection, refreshContent } = useContext(ContentContext);
  const [selectedSection, setSelectedSection] = useState('');
  const [sectionContent, setSectionContent] = useState(null);
  const [parsedContent, setParsedContent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [sections, setSections] = useState([]);
  const [refreshCount, setRefreshCount] = useState(0);

  // Get all available sections
  useEffect(() => {
    if (content) {
      const sectionNames = Object.keys(content).sort();
      setSections(sectionNames);
      
      // Set a default selected section if none is selected
      if (sectionNames.length > 0 && !selectedSection) {
        setSelectedSection(sectionNames[0]);
      }
    }
  }, [content, selectedSection]);

  // Fetch content for the selected section
  useEffect(() => {
    const fetchSelectedContent = async () => {
      if (selectedSection) {
        try {
          const data = await getContentBySection(selectedSection);
          setSectionContent(data);
          
          // Try to parse the content if it's a string
          if (data && data.content) {
            if (typeof data.content === 'string') {
              try {
                // Check if it looks like JSON
                if ((data.content.trim().startsWith('{') && data.content.trim().endsWith('}')) ||
                    (data.content.trim().startsWith('[') && data.content.trim().endsWith(']'))) {
                  const parsed = JSON.parse(data.content);
                  setParsedContent(parsed);
                } else {
                  setParsedContent(data.content);
                }
              } catch (error) {
                console.error('Error parsing content:', error);
                setParsedContent(data.content);
              }
            } else {
              // If it's already an object, use it directly
              setParsedContent(data.content);
            }
          }
        } catch (error) {
          console.error('Error fetching section content:', error);
        }
      }
    };
    
    fetchSelectedContent();
  }, [selectedSection, getContentBySection, refreshCount]);

  // Toggle visibility of the debug panel
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Force refresh content
  const handleRefresh = () => {
    refreshContent();
    setRefreshCount(prev => prev + 1);
  };

  return (
    <div className={`content-debug-panel ${isVisible ? 'visible' : ''}`}>
      <button 
        type="button"
        className="debug-toggle-button"
        onClick={toggleVisibility}
      >
        {isVisible ? 'Hide Debug Panel' : 'Show Debug Panel'}
      </button>
      
      {isVisible && (
        <div className="debug-panel-content">
          <h3>Content Debug Panel</h3>
          
          <div className="debug-controls">
            <button type="button" onClick={handleRefresh}>
              Refresh All Content
            </button>
          </div>
          
          <div className="debug-section-selector">
            <label htmlFor="section-select">Select Section:</label>
            <select 
              id="section-select"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              {sections.map(section => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
          
          {sectionContent && (
            <div className="debug-section-info">
              <h4>Section: {sectionContent.section}</h4>
              <p><strong>Title:</strong> {sectionContent.title}</p>
              <p><strong>ID:</strong> {sectionContent._id}</p>
              <p><strong>Last Updated:</strong> {new Date(sectionContent.updatedAt).toLocaleString()}</p>
              
              <div className="debug-content-raw">
                <h5>Raw Content:</h5>
                <pre>{typeof sectionContent.content === 'string' 
                  ? sectionContent.content 
                  : JSON.stringify(sectionContent.content, null, 2)}</pre>
              </div>
              
              {parsedContent && (
                <div className="debug-content-parsed">
                  <h5>Parsed Content:</h5>
                  <pre>{typeof parsedContent === 'string' 
                    ? parsedContent 
                    : JSON.stringify(parsedContent, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
          
          <div className="debug-all-sections">
            <h4>All Available Sections:</h4>
            <ul>
              {sections.map(section => (
                <li key={section}>
                  <button 
                    type="button"
                    onClick={() => setSelectedSection(section)}
                    className={selectedSection === section ? 'active' : ''}
                  >
                    {section}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentDebugPanel;
