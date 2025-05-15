import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import ContentContext from '../../context/ContentContext';
import { parseContent } from '../../utils/contentUtils';
import './ContentDebugPanel.css';

// Debug helper function with logging removed to prevent browser overload
const logDebugInfo = (message, data) => {
  // Removed console log to prevent browser overload
};

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

  // Track if we've already set the default section
  const defaultSectionSetRef = useRef(false);

  // Get all available sections
  useEffect(() => {
    logDebugInfo('Content changed, updating sections', content);
    if (content) {
      const sectionNames = Object.keys(content).sort();
      setSections(sectionNames);

      // Set a default selected section if none is selected and we haven't set it yet
      if (sectionNames.length > 0 && !selectedSection && !defaultSectionSetRef.current) {
        logDebugInfo('Setting default selected section', sectionNames[0]);
        setSelectedSection(sectionNames[0]);
        defaultSectionSetRef.current = true;
      }
    }
  }, [content, selectedSection]); // Include selectedSection in dependencies

  // Track if a fetch is in progress
  const fetchInProgressRef = useRef(false);

  // Fetch content for the selected section
  const fetchSelectedContent = useCallback(async () => {
    // Skip if already fetching or no section selected
    if (fetchInProgressRef.current || !selectedSection) {
      return;
    }

    fetchInProgressRef.current = true;

    try {
      // Check if we already have this content in the context
      if (content?.[selectedSection]) {
        // Use the logDebugInfo helper to reduce console spam
        logDebugInfo(`Using cached content for section "${selectedSection}"`, null);
        setSectionContent(content[selectedSection]);

        // Parse the content
        if (content[selectedSection].content) {
          parseContentData(content[selectedSection].content);
        }
      } else {
        // Use the logDebugInfo helper to reduce console spam
        logDebugInfo(`Fetching content for section "${selectedSection}"`, null);
        const data = await getContentBySection(selectedSection);
        setSectionContent(data);

        // Parse the content
        if (data?.content) {
          parseContentData(data.content);
        }
      }
    } catch (error) {
      console.error('Error fetching section content:', error);
    } finally {
      fetchInProgressRef.current = false;
    }
  }, [selectedSection, getContentBySection, content]);

  // Helper function to parse content
  const parseContentData = useCallback((contentData) => {
    if (typeof contentData === 'string') {
      try {
        // Check if it looks like JSON
        if ((contentData.trim().startsWith('{') && contentData.trim().endsWith('}')) ||
            (contentData.trim().startsWith('[') && contentData.trim().endsWith(']'))) {
          const parsed = JSON.parse(contentData);
          setParsedContent(parsed);
        } else {
          setParsedContent(contentData);
        }
      } catch (error) {
        console.error('Error parsing content:', error);
        setParsedContent(contentData);
      }
    } else {
      // If it's already an object, use it directly
      setParsedContent(contentData);
    }
  }, []);

  // Fetch content when the selected section changes
  useEffect(() => {
    if (selectedSection) {
      fetchSelectedContent();
    }
  }, [selectedSection, fetchSelectedContent]);

  // Refresh when refreshCount changes
  useEffect(() => {
    if (refreshCount > 0 && selectedSection) {
      fetchSelectedContent();
    }
  }, [refreshCount, fetchSelectedContent, selectedSection]);

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
