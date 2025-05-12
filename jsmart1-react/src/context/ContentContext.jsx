import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

const ContentContext = createContext();

// Create a Map to track pending requests globally
const pendingRequests = new Map();

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch all content on mount and when refreshTrigger changes
  useEffect(() => {
    fetchAllContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // Fetch all content
  const fetchAllContent = useCallback(async () => {
    try {
      console.log('ContentContext: Fetching all content...');
      setLoading(true);
      const data = await api.content.getAll();
      console.log('ContentContext: Received content data:', data);

      // Validate the data
      if (!Array.isArray(data)) {
        console.error('ContentContext: Received invalid content data (not an array):', data);
        setError('Failed to load content. Invalid data format.');
        setLoading(false);
        return;
      }

      // Filter out any invalid items
      const validData = data.filter(item =>
        item && typeof item === 'object' && 'section' in item && 'title' in item && 'content' in item
      );

      if (validData.length !== data.length) {
        console.warn(`ContentContext: Filtered out ${data.length - validData.length} invalid content items`);
      }

      // Convert array to object with section as key
      const contentObj = {};
      for (const item of validData) {
        contentObj[item.section] = item;
      }

      console.log('ContentContext: Processed content object with sections:', Object.keys(contentObj));
      console.log('ContentContext: Content object details:', contentObj);

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
      console.log('ContentContext: Finished fetching all content');
    }
  }, []);

  // Get content by section with improved error handling and caching
  const getContentBySection = useCallback(async (section) => {
    console.log(`ContentContext: Fetching content for section "${section}"...`);

    // First check if we already have this content in our state
    if (content[section]) {
      console.log(`ContentContext: Using cached content for section "${section}":`, content[section]);
      return content[section];
    }

    // If we already have a pending request for this section, return that promise
    if (pendingRequests.has(section)) {
      console.log(`ContentContext: Reusing pending request for section "${section}"`);
      return pendingRequests.get(section);
    }

    try {
      // Create a new request promise
      const requestPromise = api.content.getBySection(section);

      // Store the promise in our pending requests map
      pendingRequests.set(section, requestPromise);

      // Wait for the request to complete
      const data = await requestPromise;
      console.log(`ContentContext: Received data for section "${section}":`, data);

      // Validate the data
      if (!data) {
        console.error(`ContentContext: Received empty data for section "${section}"`);
        pendingRequests.delete(section);
        return null;
      }

      // Ensure the data has the expected structure
      if (!data.section || !data.title || data.content === undefined) {
        console.error(`ContentContext: Received malformed data for section "${section}"`, data);
        pendingRequests.delete(section);
        return null;
      }

      // Update state with the new content
      setContent(prev => {
        console.log(`ContentContext: Updating content state for section "${section}"`);
        const newContent = {
          ...prev,
          [section]: data
        };
        console.log('ContentContext: New content state:', newContent);
        return newContent;
      });

      // Force a refresh trigger update to ensure components re-render
      setRefreshTrigger(prev => prev + 1);

      // Remove the request from our pending requests map
      pendingRequests.delete(section);

      return data;
    } catch (err) {
      console.error(`ContentContext: Error fetching content for section "${section}":`, err);

      // Remove the request from our pending requests map
      pendingRequests.delete(section);

      // If API call fails but we have cached data, return that
      if (content[section]) {
        console.log(`ContentContext: Returning cached content for section "${section}"`);
        return content[section];
      }

      console.log(`ContentContext: No cached data available for section "${section}"`);
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

  // Refresh content with improved efficiency
  const refreshContent = useCallback(() => {
    console.log('ContentContext: Refreshing content cache...');

    // Instead of clearing the entire cache, mark it as stale
    // This way we still have data to display while fetching fresh data
    const staleTimestamp = Date.now();

    // Increment the refresh trigger to force a re-fetch
    setRefreshTrigger(prev => {
      const newValue = prev + 1;
      console.log(`ContentContext: Refresh trigger updated: ${prev} -> ${newValue}`);
      return newValue;
    });

    // Force a fetch of all content, but don't clear the cache first
    // This prevents the UI from flickering while data is being refreshed
    console.log('ContentContext: Fetching fresh content data');
    fetchAllContent();

    // Clear any pending requests to ensure we get fresh data
    pendingRequests.clear();

    return staleTimestamp; // Return the timestamp for debugging purposes
  }, [fetchAllContent]);

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
