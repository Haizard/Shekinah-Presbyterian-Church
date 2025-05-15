import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import { ensureContentSectionsExist } from '../utils/contentUtils';

const ContentContext = createContext();

// Create a Map to track pending requests globally
const pendingRequests = new Map();

// Create a Map to track content versions to prevent unnecessary updates
const contentVersions = new Map();

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Track if initial fetch has been done
  const initialFetchDone = useRef(false);

  // Fetch all content on mount only
  useEffect(() => {
    if (!initialFetchDone.current) {
      // Removed console log to prevent browser overload
      fetchAllContent();
      initialFetchDone.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Separate effect to handle refresh trigger changes
  useEffect(() => {
    // Skip the initial render (when refreshTrigger is 0)
    if (refreshTrigger > 0) {
      // Prevent too frequent refreshes by using a debounce mechanism
      if (!window._lastRefreshTriggerTime) {
        window._lastRefreshTriggerTime = 0;
      }

      const now = Date.now();
      const timeSinceLastRefresh = now - window._lastRefreshTriggerTime;

      // Only refresh if it's been at least 10 seconds since the last refresh
      if (timeSinceLastRefresh > 10000) {
        // Removed console log to prevent browser overload
        window._lastRefreshTriggerTime = now;
        fetchAllContent();
      }
      // Skip refresh if it's too soon after the last one
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // Fetch all content
  const fetchAllContent = useCallback(async () => {
    try {
      // Removed console log to prevent browser overload
      setLoading(true);

      // Ensure required content sections exist
      console.log('Ensuring required content sections exist...');
      const result = await ensureContentSectionsExist([
        'hero', 'about', 'vision', 'mission', 'leadership', 'weekly_schedule',
        'featured_event', 'special_event', 'current_series', 'sermon_series',
        'event_calendar', 'our_story', 'how_we_serve'
      ]);
      console.log('Result of ensuring content sections exist:', result);

      const data = await api.content.getAll();
      // Removed console log to prevent browser overload

      // Validate the data
      if (!Array.isArray(data)) {
        console.error('ContentContext: Received invalid content data (not an array)');
        setError('Failed to load content. Invalid data format.');
        setLoading(false);
        return;
      }

      // Filter out any invalid items
      const validData = data.filter(item =>
        item && typeof item === 'object' && 'section' in item && 'title' in item && 'content' in item
      );

      // Removed warning log to prevent browser overload

      // Convert array to object with section as key
      const contentObj = {};
      for (const item of validData) {
        contentObj[item.section] = item;
      }

      // Removed console logs to prevent browser overload

      // Update the content state
      setContent(contentObj);

      // Force a refresh trigger update to ensure components re-render
      setRefreshTrigger(prev => prev + 1);

      setError(null);
    } catch (err) {
      console.error('ContentContext: Error fetching content:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
      // Removed console log to prevent browser overload
    }
  }, []);

  // Get content by section with improved error handling and caching
  const getContentBySection = useCallback(async (section) => {
    // Removed console logs to prevent browser overload

    // First check if we already have this content in our state
    if (content[section]) {
      // Removed console log to prevent browser overload
      return content[section];
    }

    // If we already have a pending request for this section, return that promise
    if (pendingRequests.has(section)) {
      // Removed console log to prevent browser overload
      return pendingRequests.get(section);
    }

    try {
      // Create a new request promise
      const requestPromise = api.content.getBySection(section);

      // Store the promise in our pending requests map
      pendingRequests.set(section, requestPromise);

      // Wait for the request to complete
      const data = await requestPromise;
      // Removed console log to prevent browser overload

      // Validate the data
      if (!data) {
        // Removed console error to prevent browser overload
        pendingRequests.delete(section);
        return null;
      }

      // Ensure the data has the expected structure
      if (!data.section || !data.title || data.content === undefined) {
        // Removed console error to prevent browser overload
        pendingRequests.delete(section);
        return null;
      }

      // Check if the data is different from what we already have
      const isNewData = !content[section] ||
        data._id !== content[section]._id ||
        data.updatedAt !== content[section].updatedAt;

      if (isNewData) {
        // Update state with the new content
        setContent(prev => {
          // Removed console log to prevent browser overload
          const newContent = {
            ...prev,
            [section]: data
          };
          // Removed console log to prevent browser overload
          return newContent;
        });

        // Only increment the refresh trigger if we actually got new data
        // Removed console log to prevent browser overload
        setRefreshTrigger(prev => prev + 1);
      }
      // Removed console log to prevent browser overload

      // Remove the request from our pending requests map
      pendingRequests.delete(section);

      return data;
    } catch (err) {
      // Removed console error to prevent browser overload

      // Remove the request from our pending requests map
      pendingRequests.delete(section);

      // If API call fails but we have cached data, return that
      if (content[section]) {
        // Removed console log to prevent browser overload
        return content[section];
      }

      // Removed console log to prevent browser overload
      return null;
    }
  }, [content]);

  // Create or update content
  const createOrUpdateContent = useCallback(async (contentData) => {
    try {
      const data = await api.content.createOrUpdate(contentData);

      // Update state
      setContent(prev => ({
        ...prev,
        [data.section]: data
      }));

      // Trigger a refresh to ensure all components get the latest data
      setRefreshTrigger(prev => prev + 1);

      return data;
    } catch (err) {
      console.error('Error creating/updating content:', err);
      throw err;
    }
  }, []);

  // Delete content
  const deleteContent = useCallback(async (section) => {
    try {
      await api.content.delete(section);

      // Update state
      setContent(prev => {
        const newContent = { ...prev };
        delete newContent[section];
        return newContent;
      });

      // Trigger a refresh to ensure all components get the latest data
      setRefreshTrigger(prev => prev + 1);

      return true;
    } catch (err) {
      console.error('Error deleting content:', err);
      throw err;
    }
  }, []);

  // Track the last time we refreshed content to prevent too frequent refreshes
  const lastRefreshTimeRef = useRef(0);

  // Refresh content with improved efficiency and rate limiting
  const refreshContent = useCallback(() => {
    // Prevent refreshing more than once every 10 seconds
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshTimeRef.current;

    if (timeSinceLastRefresh < 10000) {
      // Removed console log to prevent browser overload
      return false;
    }

    // Removed console log to prevent browser overload

    // Update the last refresh time
    lastRefreshTimeRef.current = now;

    // Instead of clearing the entire cache, mark it as stale
    // This way we still have data to display while fetching fresh data
    const staleTimestamp = now;

    // Increment the refresh trigger to force a re-fetch
    setRefreshTrigger(prev => {
      const newValue = prev + 1;
      // Removed console log to prevent browser overload
      return newValue;
    });

    // We don't need to call fetchAllContent() here because the useEffect will handle that
    // This prevents duplicate API calls

    // Clear any pending requests to ensure we get fresh data
    pendingRequests.clear();

    return staleTimestamp; // Return the timestamp for debugging purposes
  }, []);

  return (
    <ContentContext.Provider
      value={{
        content,
        loading,
        error,
        refreshTrigger,
        getContentBySection,
        createOrUpdateContent,
        deleteContent,
        refreshContent
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export default ContentContext;
