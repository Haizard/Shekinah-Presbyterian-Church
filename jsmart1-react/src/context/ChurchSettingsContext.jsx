import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const ChurchSettingsContext = createContext();

export const ChurchSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch church settings
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.churchSettings.get();
      setSettings(data);
    } catch (err) {
      console.error('Error fetching church settings:', err);
      setError('Failed to load church settings');
      // Set default empty settings on error
      setSettings({
        churchName: '',
        churchDescription: '',
        logo: '',
        favicon: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
        phone: '',
        email: '',
        serviceTimes: [],
        socialMedia: {},
        bankDetails: {},
        mapCoordinates: {},
        timezone: 'UTC',
        currency: 'USD',
        language: 'en',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Update church settings
  const updateSettings = useCallback(async (newSettings) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.churchSettings.update(newSettings);
      setSettings(data);
      return data;
    } catch (err) {
      console.error('Error updating church settings:', err);
      setError('Failed to update church settings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const value = {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
  };

  return (
    <ChurchSettingsContext.Provider value={value}>
      {children}
    </ChurchSettingsContext.Provider>
  );
};

export default ChurchSettingsContext;

