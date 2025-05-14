import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import ContentContext from '../context/ContentContext';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import { parseContent, isHtmlContent } from '../utils/contentUtils';
import ContentRendererFactory from './structured/ContentRendererFactory';
import api from '../services/api';

const DynamicContent = ({
  section,
  fallback,
  renderContent = null,
  className = '',
  showImage = true,
  showTitle = true,
  showContent = true,
  truncateContent = false,
  maxContentLength = 150
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

      // Reset the direct fetch attempt flag when section changes
      directFetchAttemptedRef.current = false;

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

  // Track if we've tried direct API fetching
  const directFetchAttemptedRef = useRef(false);

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
        // Removed console log to prevent browser overload
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
            // Removed console log to prevent browser overload
            setContentData(data || null);
            // Force a re-render by updating the last fetch time
            setLastFetchTime(Date.now());
            // Update the local refresh count to trigger any dependent components
            setLocalRefreshCount(prev => prev + 1);
          } else {
            // Removed console log to prevent browser overload
          }

          // Mark that we've fetched content for this section
          hasFetchedRef.current = true;

          // Exit loading state after data is set
          setIsLoading(false);
        }
      } catch (err) {
        // Removed console error to prevent browser overload
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
  }, [section, getContentBySection, refreshTrigger, contentData, isLoading]); // Added isLoading to dependencies

  // Direct API fetch effect - only runs when content is not found in context
  useEffect(() => {
    // Only attempt direct fetch if:
    // 1. We don't have content data
    // 2. We're not already loading
    // 3. We haven't already tried direct fetching
    if (!contentData && !isLoading && !directFetchAttemptedRef.current) {
      const fetchContentDirectly = async () => {
        try {
          console.log(`DynamicContent: No content found for "${section}" in context, fetching directly...`);
          setIsLoading(true);
          const data = await api.content.getBySection(section);

          if (data) {
            console.log(`DynamicContent: Successfully fetched content for "${section}" directly:`, data);
            setContentData(data);
            setLastFetchTime(Date.now());
            setLocalRefreshCount(prev => prev + 1);
          } else {
            console.log(`DynamicContent: No content found for "${section}" in direct API call`);
          }
        } catch (err) {
          console.error(`DynamicContent: Error fetching content for "${section}" directly:`, err);
        } finally {
          setIsLoading(false);
          // Mark that we've attempted direct fetching
          directFetchAttemptedRef.current = true;
        }
      };

      fetchContentDirectly();
    }
  }, [section, contentData, isLoading]);

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
        // Removed console log to prevent browser overload

        // Don't refresh if the component is already in a loading state
        if (!isLoading) {
          // Use a debounced refresh function to prevent too many simultaneous requests
          const refreshData = async () => {
            try {
              // Removed console log to prevent browser overload

              // Just update the last fetch time without actually fetching new data
              // This prevents unnecessary API calls but still keeps track of refresh attempts
              setLastFetchTime(Date.now());

              // Instead of fetching directly, increment the refresh trigger in the parent context
              // This will cause a coordinated refresh of all components
              if (refreshContent && typeof refreshContent === 'function') {
                // Removed console log to prevent browser overload
                refreshContent();
              }
            } catch (err) {
              // Removed console error to prevent browser overload
              // Still update the last fetch time to prevent too frequent retries on error
              setLastFetchTime(Date.now());
            }
          };

          refreshData();
        } else {
          // Removed console log to prevent browser overload
        }
      }
    }, 300000 + randomOffset); // 5 minutes + random offset to stagger requests

    return () => clearInterval(refreshInterval);
  }, [refreshContent, lastFetchTime, contentData, isLoading]);

  // If custom render function is provided, use it
  if (renderContent && contentData) {
    // Removed console log to prevent browser overload

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
            // Removed console log to prevent browser overload

            // Update the content with the parsed version
            contentToRender.content = parsedContent;
          } catch (parseError) {
            // Removed console error to prevent browser overload
            // Continue with the original string content if parsing fails
          }
        }
      } catch (error) {
        // Removed console error to prevent browser overload
      }
    }

    // Removed console log to prevent browser overload
    try {
      const renderedContent = renderContent(contentToRender);
      // Removed console log to prevent browser overload
      return renderedContent;
    } catch (error) {
      // Removed console error to prevent browser overload
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

  // If no content found and we're not loading, return null
  if (!contentData && !isLoading) {
    return null;
  }

  // Removed debug logging to prevent browser overload

  // Default rendering
  return (
    <div className={`dynamic-content ${className}`} data-refresh-count={localRefreshCount} data-section={section}>
      {/* Hidden debug info - only visible in development */}
      {process.env.NODE_ENV !== 'production' && contentData && (
        <div className="dynamic-content-debug" style={{ display: 'none' }}>
          <p>Section: {section}</p>
          <p>Refresh Count: {localRefreshCount}</p>
          <p>Last Updated: {new Date(lastFetchTime).toLocaleTimeString()}</p>
          <p>Content ID: {contentData._id}</p>
          <button type="button" onClick={manualRefresh}>Force Refresh</button>
        </div>
      )}

      {/* Only render content if contentData exists */}
      {contentData && (
        <>
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
                truncate={truncateContent}
                maxLength={maxContentLength}
                contentId={contentData._id}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DynamicContent;
