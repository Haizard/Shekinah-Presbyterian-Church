import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import ContentContext from '../context/ContentContext';

/**
 * Component for debugging content fetching and rendering
 */
const ContentDebugger = () => {
  const { content, getContentBySection, refreshContent } = useContext(ContentContext);
  const [sections, setSections] = useState([
    'hero', 'about', 'vision', 'mission', 'who_we_are',
    'weekly_schedule', 'featured_event', 'how_we_serve', 'video_gallery'
  ]);
  const [selectedSection, setSelectedSection] = useState('hero');
  const [sectionContent, setSectionContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          {loading ? 'Loading...' : 'Fetch Content'}
        </button>

        <button
          type="button"
          onClick={handleRefreshAll}
          disabled={loading}
        >
          Refresh All Content
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}

      <div>
        <h3>Content for section: {selectedSection}</h3>

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
          <div>No content found for this section</div>
        )}
      </div>
    </div>
  );
};

export default ContentDebugger;
