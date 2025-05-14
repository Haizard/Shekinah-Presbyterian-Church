import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import ContentContext from '../context/ContentContext';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import { parseContent, isHtmlContent } from '../utils/contentUtils';
import ContentRendererFactory from './structured/ContentRendererFactory';

/**
 * Optimized version of DynamicContent component that prevents infinite update loops
 * and improves performance by reducing unnecessary re-renders and API calls.
 */
const DynamicContentOptimized = ({
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
  // Get content and functions from context
  const { content, getContentBySection, refreshContent } = useContext(ContentContext);

  // Local state
  const [contentData, setContentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  // Refs to track component lifecycle and prevent unnecessary updates
  const componentMounted = useRef(true);
  const hasFetchedRef = useRef(false);
  const fetchInProgressRef = useRef(false);

  // Check if we already have this content in the global context
  const hasContentInContext = useRef(false);

  useEffect(() => {
    // Check if content is available in the global context
    if (content?.[section]) {
      hasContentInContext.current = true;

      // If we haven't set content data yet, or if it's different from what we have
      if (!contentData || contentData._id !== content[section]._id) {
        console.log(`DynamicContentOptimized: Using content from global context for "${section}"`);
        setContentData(content[section]);
        setIsLoading(false);
        hasFetchedRef.current = true;
        setLastFetchTime(Date.now());
      }
    }
  }, [content, section, contentData]);

  // Fetch content when component mounts or section changes
  useEffect(() => {
    // Skip if we're already fetching or if we already have data from context
    if (fetchInProgressRef.current || (hasContentInContext.current && contentData)) {
      return;
    }

    const fetchContent = async () => {
      // Prevent concurrent fetches
      if (fetchInProgressRef.current) return;
      fetchInProgressRef.current = true;

      // Only show loading state if we don't have content yet
      if (!contentData) {
        setIsLoading(true);
      }

      try {
        console.log(`DynamicContentOptimized: Fetching content for section "${section}"...`);
        const data = await getContentBySection(section);

        if (componentMounted.current) {
          if (data) {
            // Only update if the data is different from what we have
            const isNewData = !contentData || contentData._id !== data._id;

            if (isNewData) {
              console.log(`DynamicContentOptimized: Setting content data for section "${section}"`);
              setContentData(data);
              setLastFetchTime(Date.now());
            } else {
              console.log(`DynamicContentOptimized: No changes for section "${section}", skipping update`);
            }
          } else {
            console.log(`DynamicContentOptimized: No data found for section "${section}"`);
          }

          // Mark that we've fetched content
          hasFetchedRef.current = true;
          setIsLoading(false);
          setError(null);
        }
      } catch (err) {
        console.error(`DynamicContentOptimized: Error fetching content for section "${section}":`, err);
        if (componentMounted.current) {
          setError(err.message || 'Error loading content');
          setIsLoading(false);
        }
      } finally {
        fetchInProgressRef.current = false;
      }
    };

    fetchContent();

    // Cleanup function
    return () => {
      componentMounted.current = false;
    };
  }, [section, getContentBySection, contentData]);

  // Manual refresh function that can be called from parent components
  const manualRefresh = useCallback(() => {
    if (fetchInProgressRef.current) {
      console.log(`DynamicContentOptimized: Refresh already in progress for "${section}"`);
      return;
    }

    console.log(`DynamicContentOptimized: Manual refresh triggered for "${section}"`);

    // Reset fetch status
    hasFetchedRef.current = false;
    hasContentInContext.current = false;

    // Trigger a global content refresh
    if (refreshContent) {
      refreshContent();
    }
  }, [section, refreshContent]);

  // Expose refresh function to global scope for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.refreshDynamicContent = window.refreshDynamicContent || {};
      window.refreshDynamicContent[section] = manualRefresh;

      return () => {
        if (window.refreshDynamicContent?.[section]) {
          delete window.refreshDynamicContent[section];
        }
      };
    }
  }, [section, manualRefresh]);

  // If custom render function is provided, use it
  if (renderContent && contentData) {
    console.log(`DynamicContentOptimized: Using custom renderContent for section "${section}"`, {
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
            console.log(`DynamicContentOptimized: Parsed JSON content for section "${section}"`, parsedContent);

            // Update the content with the parsed version
            contentToRender.content = parsedContent;
          } catch (parseError) {
            console.error(`DynamicContentOptimized: Error parsing JSON content for section "${section}"`, parseError);
            // Continue with the original string content if parsing fails
          }
        }
      } catch (error) {
        console.error(`DynamicContentOptimized: Error processing content for section "${section}"`, error);
      }
    }

    console.log(`DynamicContentOptimized: Rendering content for section "${section}" with custom renderer`, contentToRender);
    try {
      const renderedContent = renderContent(contentToRender);
      console.log(`DynamicContentOptimized: Successfully rendered content for section "${section}"`);
      return renderedContent;
    } catch (error) {
      console.error(`DynamicContentOptimized: Error rendering content for section "${section}"`, error);
      // Fall back to default rendering if custom rendering fails
    }
  }

  // Show loading state only during initial load
  if (isLoading && !contentData) {
    return (
      <div className={`dynamic-content-loading ${className}`}>
        <div className="spinner-small" />
        <p>Loading {section} content...</p>
      </div>
    );
  }

  // Show error state
  if (error && !contentData) {
    return (
      <div className={`dynamic-content-error ${className}`}>
        <p>Error loading content: {error}</p>
        <button type="button" onClick={manualRefresh}>Retry</button>
      </div>
    );
  }

  // If no content found, show fallback
  if (!contentData) {
    return fallback || null;
  }

  // Debug: Log the content data
  console.log(`DynamicContentOptimized: Content data for section "${section}":`, contentData);

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
            truncate={truncateContent}
            maxLength={maxContentLength}
            contentId={contentData._id}
          />
        </div>
      )}
    </div>
  );
};

export default DynamicContentOptimized;
