import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import ContentContext from '../context/ContentContext';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import { parseContent, isHtmlContent } from '../utils/contentUtils';
import ContentRendererFactory from './structured/ContentRendererFactory';

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
        if (window.refreshDynamicContent?.[section]) {
          delete window.refreshDynamicContent[section];
        }
      };
    }
  }, [section, manualRefresh]);

  // Track if we've already fetched content for this section
  const hasFetchedRef = useRef(false);

  // Fetch content when component mounts, section changes, or refreshTrigger changes
  useEffect(() => {
    // Skip unnecessary re-fetches if we already have data and refreshTrigger hasn't changed
    const shouldSkipFetch = contentData &&
                           hasFetchedRef.current &&
                           refreshTrigger === 0;

    if (shouldSkipFetch) {
      console.log(`DynamicContent: Skipping fetch for section "${section}" - already have data and no refresh triggered`);
      return;
    }

    // Removed effect trigger logging to prevent browser overload

    // Set a timeout to ensure loading state doesn't get stuck
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.log(`DynamicContent: Loading timeout for section "${section}", forcing loading state to false`);
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout

    const fetchContent = async () => {
      // Only show loading state if we don't already have content
      if (!contentData) {
        setIsLoading(true);
      }

      try {
        // Removed fetch content logging to prevent browser overload
        const data = await getContentBySection(section);

        // Always update state regardless of data to ensure we exit loading state
        if (componentMounted.current) {
          // Only update if the data is different or we don't have data yet
          const isNewData = !contentData ||
                           (data && contentData && data._id !== contentData._id);

          if (isNewData) {
            console.log(`DynamicContent: Setting content data for section "${section}":`, data);
            setContentData(data || null);
            // Force a re-render by updating the last fetch time
            setLastFetchTime(Date.now());
            // Update the local refresh count to trigger any dependent components
            setLocalRefreshCount(prev => prev + 1);
          } else {
            console.log(`DynamicContent: No changes for section "${section}", skipping update`);
          }

          // Mark that we've fetched content for this section
          hasFetchedRef.current = true;

          // Exit loading state after data is set
          setIsLoading(false);
        }
      } catch (err) {
        console.error(`DynamicContent: Error fetching content for section ${section}:`, err);
        // Set content data to null to show fallback only if we don't already have data
        if (!contentData) {
          setContentData(null);
        }
        // Make sure to exit loading state even on error
        if (componentMounted.current) {
          setIsLoading(false);
        }
      }
    };

    fetchContent();

    // Clean up the timeout
    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [section, getContentBySection, refreshTrigger, contentData]); // Added contentData to dependencies

  // Refresh content periodically (every 5 minutes)
  useEffect(() => {
    // Skip periodic refresh for components that don't have data yet
    if (!contentData) {
      return;
    }

    // Stagger the refresh intervals to prevent all components from refreshing at the same time
    // Generate a random offset between 0 and 60 seconds
    const randomOffset = Math.floor(Math.random() * 60000);

    // Use a longer refresh interval (5 minutes) to reduce server load
    const refreshInterval = setInterval(() => {
      // Only refresh if it's been more than 5 minutes since the last fetch
      if (Date.now() - lastFetchTime > 300000) {
        console.log(`DynamicContent: Periodic refresh check for section "${section}"`);

        // Don't refresh if the component is already in a loading state
        if (!isLoading) {
          // Use a debounced refresh function to prevent too many simultaneous requests
          const refreshData = async () => {
            try {
              console.log(`DynamicContent: Performing periodic refresh for section "${section}"...`);

              // Just update the last fetch time without actually fetching new data
              // This prevents unnecessary API calls but still keeps track of refresh attempts
              setLastFetchTime(Date.now());

              // Instead of fetching directly, increment the refresh trigger in the parent context
              // This will cause a coordinated refresh of all components
              if (refreshContent && typeof refreshContent === 'function') {
                console.log(`DynamicContent: Triggering global content refresh from section "${section}"`);
                refreshContent();
              }
            } catch (err) {
              console.error(`DynamicContent: Error during periodic refresh for section ${section}:`, err);
              // Still update the last fetch time to prevent too frequent retries on error
              setLastFetchTime(Date.now());
            }
          };

          refreshData();
        } else {
          console.log(`DynamicContent: Skipping periodic refresh for section "${section}" - already loading`);
        }
      }
    }, 300000 + randomOffset); // 5 minutes + random offset to stagger requests

    return () => clearInterval(refreshInterval);
  }, [section, refreshContent, lastFetchTime, contentData, isLoading]);

  // If custom render function is provided, use it
  if (renderContent && contentData) {
    console.log(`DynamicContent: Using custom renderContent for section "${section}"`, {
      hasRenderContent: !!renderContent,
      hasContentData: !!contentData,
      contentDataType: typeof contentData,
      contentDataKeys: contentData ? Object.keys(contentData) : [],
      renderContentType: typeof renderContent
    });

    // Create a copy of contentData to avoid modifying the original
    const contentToRender = { ...contentData };

    // Parse the content if it's JSON before passing to renderContent
    if (contentToRender.content && typeof contentToRender.content === 'string') {
      try {
        // Check if it looks like JSON
        if ((contentToRender.content.trim().startsWith('{') && contentToRender.content.trim().endsWith('}')) ||
            (contentToRender.content.trim().startsWith('[') && contentToRender.content.trim().endsWith(']'))) {
          try {
            const parsedContent = JSON.parse(contentToRender.content);
            console.log(`DynamicContent: Parsed JSON content for section "${section}"`, parsedContent);

            // Update the content with the parsed version
            contentToRender.content = parsedContent;
          } catch (parseError) {
            console.error(`DynamicContent: Error parsing JSON content for section "${section}"`, parseError);
            // Continue with the original string content if parsing fails
          }
        }
      } catch (error) {
        console.error(`DynamicContent: Error processing content for section "${section}"`, error);
      }
    }

    console.log(`DynamicContent: Rendering content for section "${section}" with custom renderer`, contentToRender);
    try {
      const renderedContent = renderContent(contentToRender);
      console.log(`DynamicContent: Successfully rendered content for section "${section}"`);
      return renderedContent;
    } catch (error) {
      console.error(`DynamicContent: Error rendering content for section "${section}"`, error);
      // Fall back to default rendering if custom rendering fails
    }
  }

  // Show loading state only during initial load and only for a reasonable amount of time
  // Never show loading state if we already have content data to avoid flickering
  if (isLoading && !contentData && Date.now() - lastFetchTime < 10000) { // Only show loading for max 10 seconds and only during initial load
    // Removed loading state logging to prevent browser overload

    return (
      <div className={`dynamic-content-loading ${className}`}>
        <div className="spinner-small" />
        <p>Loading {section} content...</p>
      </div>
    );
  }

  // If we have content data, always show it even if we're refreshing in the background
  // This prevents flickering between content and loading states

  // If no content found, show fallback
  if (!contentData) {
    // Removed console log to prevent browser overload
    return fallback || null;
  }

  // Removed debug logging to prevent browser overload

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
          <button type="button" onClick={manualRefresh}>Force Refresh</button>
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
        <div className="dynamic-content-text">
          <ContentRendererFactory
            section={section}
            content={contentData.content}
          />
        </div>
      )}
    </div>
  );
};

export default DynamicContent;
