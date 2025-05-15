import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import ContentContext from '../context/ContentContext';
import api from '../services/api';

/**
 * Enhanced component for debugging content fetching and rendering
 * Shows all content sections and allows direct API calls to test fetching
 */
const ContentDebugger = () => {
  const { content, getContentBySection, refreshContent } = useContext(ContentContext);
  const [sections, setSections] = useState([
    'hero', 'about', 'vision', 'mission', 'who_we_are', 'our_story', 'leadership',
    'weekly_schedule', 'featured_event', 'special_event', 'current_series',
    'sermon_series', 'event_calendar', 'how_we_serve', 'video_gallery'
  ]);
  const [selectedSection, setSelectedSection] = useState('hero');
  const [sectionContent, setSectionContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllContent, setShowAllContent] = useState(false);
  const [directApiResults, setDirectApiResults] = useState(null);
  const [directApiLoading, setDirectApiLoading] = useState(false);

  // Track if a fetch is in progress to prevent duplicate requests
  const fetchInProgressRef = useRef(false);

  // Fetch content for the selected section
  const fetchSelectedContent = useCallback(async () => {
    // Skip if already fetching or no section selected
    if (fetchInProgressRef.current || !selectedSection) {
      return;
    }

    fetchInProgressRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // First check if we already have this content in the global context
      if (content?.[selectedSection]) {
        // Removed console log to prevent browser overload
        setSectionContent(content[selectedSection]);
      } else {
        // Removed console log to prevent browser overload
        const data = await getContentBySection(selectedSection);
        // Removed console log to prevent browser overload
        setSectionContent(data);
      }
    } catch (err) {
      console.error(`ContentDebugger: Error fetching content for section "${selectedSection}":`, err);
      setError(err.message || 'Error fetching content');
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
    }
  }, [selectedSection, getContentBySection, content]);

  // Refresh all content
  const handleRefreshAll = useCallback(() => {
    refreshContent();
    fetchSelectedContent();
  }, [refreshContent, fetchSelectedContent]);

  // Direct API call to test fetching
  const fetchDirectFromApi = useCallback(async () => {
    setDirectApiLoading(true);
    try {
      console.log(`Making direct API call for section "${selectedSection}"`);
      const result = await api.content.getBySection(selectedSection);
      console.log(`Direct API result for "${selectedSection}":`, result);
      setDirectApiResults(result);
    } catch (err) {
      console.error(`Error in direct API call for "${selectedSection}":`, err);
      setDirectApiResults({ error: err.message || 'Error in direct API call' });
    } finally {
      setDirectApiLoading(false);
    }
  }, [selectedSection]);

  // Fetch content when the selected section changes
  useEffect(() => {
    if (selectedSection) {
      fetchSelectedContent();
    }
  }, [selectedSection, fetchSelectedContent]);

  return (
    <div className="content-debugger" style={{ padding: '20px', border: '1px solid #ccc', margin: '20px 0' }}>
      <h2>Content Debugger</h2>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="section-select">Select Section: </label>
        <select
          id="section-select"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          style={{ marginRight: '10px' }}
        >
          {sections.map(section => (
            <option key={section} value={section}>{section}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={fetchSelectedContent}
          disabled={loading}
          style={{ marginRight: '10px' }}
        >
          {loading ? 'Loading...' : 'Fetch from Context'}
        </button>

        <button
          type="button"
          onClick={fetchDirectFromApi}
          disabled={directApiLoading}
          style={{ marginRight: '10px' }}
        >
          {directApiLoading ? 'Loading...' : 'Direct API Call'}
        </button>

        <button
          type="button"
          onClick={handleRefreshAll}
          disabled={loading}
          style={{ marginRight: '10px' }}
        >
          Refresh All Content
        </button>

        <button
          type="button"
          onClick={() => setShowAllContent(!showAllContent)}
          style={{ marginRight: '10px' }}
        >
          {showAllContent ? 'Hide All Content' : 'Show All Content'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}

      {/* Show all content sections in context */}
      {showAllContent && (
        <div style={{ marginBottom: '20px' }}>
          <h3>All Content in Context</h3>
          {Object.keys(content || {}).length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '10px'
            }}>
              {Object.keys(content).map(section => (
                <div
                  key={section}
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    borderRadius: '4px',
                    backgroundColor: section === selectedSection ? '#f0f8ff' : 'white'
                  }}
                >
                  <h4 style={{ margin: '0 0 10px 0' }}>{section}</h4>
                  <div><strong>Title:</strong> {content[section]?.title || 'No title'}</div>
                  <div><strong>Has Content:</strong> {content[section]?.content ? 'Yes' : 'No'}</div>
                  <div><strong>Has Image:</strong> {content[section]?.image ? 'Yes' : 'No'}</div>
                  <button
                    onClick={() => setSelectedSection(section)}
                    style={{
                      marginTop: '10px',
                      padding: '5px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div>No content found in context</div>
          )}
        </div>
      )}

      {/* Selected section content from context */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Content for section: {selectedSection} (from Context)</h3>

        {loading ? (
          <div>Loading...</div>
        ) : sectionContent ? (
          <div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Title:</strong> {sectionContent.title}
            </div>

            <div style={{ marginBottom: '10px' }}>
              <strong>Content Type:</strong> {typeof sectionContent.content}
            </div>

            <div style={{ marginBottom: '10px' }}>
              <strong>Content Preview:</strong>
              <pre style={{
                whiteSpace: 'pre-wrap',
                backgroundColor: '#f5f5f5',
                padding: '10px',
                border: '1px solid #ddd',
                maxHeight: '300px',
                overflow: 'auto'
              }}>
                {typeof sectionContent.content === 'string'
                  ? sectionContent.content.substring(0, 500) + (sectionContent.content.length > 500 ? '...' : '')
                  : JSON.stringify(sectionContent.content, null, 2)
                }
              </pre>
            </div>

            <div>
              <strong>Image:</strong> {sectionContent.image || 'No image'}
            </div>
          </div>
        ) : (
          <div>No content found for this section in context</div>
        )}
      </div>

      {/* Direct API results */}
      {directApiResults && (
        <div>
          <h3>Direct API Results for section: {selectedSection}</h3>
          {directApiResults.error ? (
            <div style={{ color: 'red' }}>
              Error: {directApiResults.error}
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Title:</strong> {directApiResults.title}
              </div>

              <div style={{ marginBottom: '10px' }}>
                <strong>Content Type:</strong> {typeof directApiResults.content}
              </div>

              <div style={{ marginBottom: '10px' }}>
                <strong>Content Preview:</strong>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  backgroundColor: '#f5f5f5',
                  padding: '10px',
                  border: '1px solid #ddd',
                  maxHeight: '300px',
                  overflow: 'auto'
                }}>
                  {typeof directApiResults.content === 'string'
                    ? directApiResults.content.substring(0, 500) + (directApiResults.content.length > 500 ? '...' : '')
                    : JSON.stringify(directApiResults.content, null, 2)
                  }
                </pre>
              </div>

              <div>
                <strong>Image:</strong> {directApiResults.image || 'No image'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentDebugger;
