import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch all content on mount and when refreshTrigger changes
  useEffect(() => {
    fetchAllContent();
  }, [refreshTrigger]);

  // Fetch all content
  const fetchAllContent = useCallback(async () => {
    try {
      console.log('ContentContext: Fetching all content...');
      setLoading(true);
      const data = await api.content.getAll();
      console.log('ContentContext: Received content data:', data);

      // Convert array to object with section as key
      const contentObj = {};
      for (const item of data) {
        contentObj[item.section] = item;
      }
      console.log('ContentContext: Processed content object with sections:', Object.keys(contentObj));

      setContent(contentObj);
      setError(null);
    } catch (err) {
      console.error('ContentContext: Error fetching content:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
      console.log('ContentContext: Finished fetching all content');
    }
  }, []);

  // Get content by section
  const getContentBySection = useCallback(async (section) => {
    console.log(`ContentContext: Fetching content for section "${section}"...`);
    try {
      // Always fetch fresh data from the API
      const data = await api.content.getBySection(section);
      console.log(`ContentContext: Received data for section "${section}":`, data);

      // Update state
      setContent(prev => {
        console.log(`ContentContext: Updating content state for section "${section}"`);
        return {
          ...prev,
          [section]: data
        };
      });

      return data;
    } catch (err) {
      console.error(`ContentContext: Error fetching content for section "${section}":`, err);

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

  // Refresh content
  const refreshContent = useCallback(() => {
    console.log('ContentContext: Refreshing content cache...');

    // Clear the content cache
    setContent(prev => {
      console.log('ContentContext: Clearing content cache. Previous size:', Object.keys(prev).length);
      return {};
    });

    // Increment the refresh trigger to force a re-fetch
    setRefreshTrigger(prev => {
      const newValue = prev + 1;
      console.log(`ContentContext: Refresh trigger updated: ${prev} -> ${newValue}`);
      return newValue;
    });

    // Force an immediate fetch of all content
    setTimeout(() => {
      console.log('ContentContext: Forcing immediate fetch of all content');
      fetchAllContent();
    }, 0);
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
