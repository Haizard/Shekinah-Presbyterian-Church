import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import ContentContext from '../context/ContentContext';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

const DynamicContent = ({
  section,
  fallback,
  renderContent = null,
  className = '',
  showImage = true,
  showTitle = true,
  showContent = true
}) => {
  const { getContentBySection, loading, error, content, refreshContent, refreshTrigger } = useContext(ContentContext);
  const [contentData, setContentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  const [localRefreshCount, setLocalRefreshCount] = useState(0);
  const componentMounted = useRef(true);

  // Manual refresh function that can be called from parent components
  const manualRefresh = useCallback(async () => {
    console.log(`DynamicContent: Manually refreshing content for section: ${section}`);
    try {
      setIsLoading(true);
      const data = await getContentBySection(section);
      if (componentMounted.current) {
        setContentData(data);
        setLastFetchTime(Date.now());
        setLocalRefreshCount(prev => prev + 1);
        console.log(`DynamicContent: Content refreshed for section: ${section}`, data);
      }
    } catch (err) {
      console.error(`DynamicContent: Error manually refreshing content for section ${section}:`, err);
    } finally {
      if (componentMounted.current) {
        setIsLoading(false);
      }
    }
  }, [section, getContentBySection]);

  // Expose this function to parent components and global scope for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.refreshDynamicContent = window.refreshDynamicContent || {};
      window.refreshDynamicContent[section] = manualRefresh;

      return () => {
        componentMounted.current = false;
        if (window.refreshDynamicContent && window.refreshDynamicContent[section]) {
          delete window.refreshDynamicContent[section];
        }
      };
    }
  }, [section, manualRefresh]);

  // Fetch content when component mounts, section changes, or refreshTrigger changes
  useEffect(() => {
    console.log(`DynamicContent: Effect triggered for section "${section}" (refreshTrigger: ${refreshTrigger})`);
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        console.log(`DynamicContent: Fetching content for section "${section}"...`);
        const data = await getContentBySection(section);
        if (componentMounted.current) {
          console.log(`DynamicContent: Setting content data for section "${section}":`, data);
          setContentData(data);
          setLastFetchTime(Date.now());
        }
      } catch (err) {
        console.error(`DynamicContent: Error fetching content for section ${section}:`, err);
      } finally {
        if (componentMounted.current) {
          setIsLoading(false);
        }
      }
    };

    fetchContent();
  }, [section, getContentBySection, refreshTrigger]);

  // Refresh content periodically (every 10 seconds instead of 30)
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // Only refresh if it's been more than 10 seconds since the last fetch
      if (Date.now() - lastFetchTime > 10000) {
        console.log(`DynamicContent: Periodic refresh for section "${section}"`);
        const refreshData = async () => {
          try {
            console.log(`DynamicContent: Fetching fresh data for section "${section}"...`);
            const data = await getContentBySection(section);
            if (componentMounted.current) {
              console.log(`DynamicContent: Updating content data for section "${section}"`, data);
              setContentData(data);
              setLastFetchTime(Date.now());
              setLocalRefreshCount(prev => prev + 1);
            }
          } catch (err) {
            console.error(`DynamicContent: Error refreshing content for section ${section}:`, err);
          }
        };

        refreshData();
      }
    }, 10000); // Reduced from 30000 to 10000 ms

    return () => clearInterval(refreshInterval);
  }, [section, getContentBySection, lastFetchTime]);

  // If custom render function is provided, use it
  if (renderContent && contentData) {
    return renderContent(contentData);
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={`dynamic-content-loading ${className}`}>
        <div className="spinner-small" />
      </div>
    );
  }

  // If no content found, show fallback
  if (!contentData) {
    return fallback || null;
  }

  // Default rendering
  return (
    <div className={`dynamic-content ${className}`} data-refresh-count={localRefreshCount} data-section={section}>
      {/* Hidden debug info - only visible in development */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="dynamic-content-debug" style={{ display: 'none' }}>
          <p>Section: {section}</p>
          <p>Refresh Count: {localRefreshCount}</p>
          <p>Last Updated: {new Date(lastFetchTime).toLocaleTimeString()}</p>
          <p>Content ID: {contentData._id}</p>
          <button onClick={manualRefresh}>Force Refresh</button>
        </div>
      )}

      {showTitle && contentData.title && (
        <h2 className="dynamic-content-title">{contentData.title}</h2>
      )}

      {showImage && contentData.image && (
        <div className="dynamic-content-image">
          <img
            src={getImageUrl(contentData.image)}
            alt={contentData.title}
            onError={(e) => handleImageError(e)}
          />
        </div>
      )}

      {showContent && contentData.content && (
        <div
          className="dynamic-content-text"
          dangerouslySetInnerHTML={{ __html: contentData.content }}
        />
      )}
    </div>
  );
};

export default DynamicContent;
