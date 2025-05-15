import React, { useState, useEffect } from 'react';
import BranchSlider from '../BranchSlider';
import api from '../../services/api';

/**
 * Component for rendering the "hero" structured content
 * Follows the same pattern as LeadershipRenderer
 * Only displays real data from the backend, no static fallbacks
 */
const HeroSectionRenderer = ({ content, backgroundImage }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Parse content if it's a string
  let heroData;
  try {
    heroData = typeof content === 'string' ? JSON.parse(content) : content;

    // Validate the structure of heroData
    if (!heroData || typeof heroData !== 'object') {
      console.error('Invalid hero data structure:', heroData);
      return null; // Return nothing if data is invalid
    }
  } catch (error) {
    console.error('Error parsing hero section data:', error);
    return null; // Return nothing if parsing fails
  }

  // Fetch branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const data = await api.branches.getAll();

        // Filter branches if selectedBranchIds is provided
        if (heroData.selectedBranchIds && Array.isArray(heroData.selectedBranchIds) && heroData.selectedBranchIds.length > 0) {
          const filteredBranches = data.filter(branch =>
            heroData.selectedBranchIds.includes(branch._id)
          );
          setBranches(filteredBranches);
        } else {
          setBranches(data);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Failed to load branches');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch branches if showBranchSlider is true
    if (heroData.showBranchSlider !== false) {
      fetchBranches();
    }
  }, [heroData]);

  // Only render branch slider if showBranchSlider is true and we have branches
  // Otherwise return null (display nothing) instead of using static fallback data
  if (heroData.showBranchSlider !== false && branches.length > 0) {
    return (
      <div className="hero-branch-slider" style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/CHURCH.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1
        }}></div>
        <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <BranchSlider branches={branches} />
        </div>
      </div>
    );
  }

  // If we're still loading, show a loading indicator
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading church branches...</p>
      </div>
    );
  }

  // If there was an error, show an error message
  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  // Return null if no branches or showBranchSlider is false
  // This ensures we don't display any static fallback content
  return null;
};

export default HeroSectionRenderer;
