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
      // Default to showing branch slider if data is invalid
      heroData = { showBranchSlider: true };
    }
  } catch (error) {
    console.error('Error parsing hero section data:', error);
    // Default to showing branch slider if parsing fails
    heroData = { showBranchSlider: true };
  }

  // Log the hero data for debugging
  console.log('HeroSectionRenderer: Hero data after parsing:', heroData);

  // Fetch branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        console.log('HeroSectionRenderer: Fetching branches...');
        const data = await api.branches.getAll();
        console.log('HeroSectionRenderer: Fetched branches:', data);

        // Filter branches if selectedBranchIds is provided
        if (heroData.selectedBranchIds && Array.isArray(heroData.selectedBranchIds) && heroData.selectedBranchIds.length > 0) {
          console.log('HeroSectionRenderer: Filtering branches by selectedBranchIds:', heroData.selectedBranchIds);
          const filteredBranches = data.filter(branch =>
            heroData.selectedBranchIds.includes(branch._id)
          );
          console.log('HeroSectionRenderer: Filtered branches:', filteredBranches);
          setBranches(filteredBranches);
        } else {
          console.log('HeroSectionRenderer: Using all branches');
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
      console.log('HeroSectionRenderer: showBranchSlider is true, fetching branches');
      fetchBranches();
    } else {
      console.log('HeroSectionRenderer: showBranchSlider is false, not fetching branches');
    }
  }, [heroData]);

  // Log the branches state for debugging
  console.log('HeroSectionRenderer: Current branches state:', branches);
  console.log('HeroSectionRenderer: showBranchSlider value:', heroData.showBranchSlider);

  // Only render branch slider if showBranchSlider is true and we have branches
  // Otherwise return null (display nothing) instead of using static fallback data
  if (heroData.showBranchSlider !== false && branches.length > 0) {
    console.log('HeroSectionRenderer: Rendering branch slider with', branches.length, 'branches');
    return (
      <div className="hero-branch-slider" style={{
        backgroundImage: `url('/images/CHURCH.jpg')`,
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
    console.log('HeroSectionRenderer: Showing loading indicator');
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading church branches...</p>
      </div>
    );
  }

  // If there was an error, show an error message
  if (error) {
    console.log('HeroSectionRenderer: Showing error message:', error);
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  // If no branches found but showBranchSlider is true, show a message
  if (heroData.showBranchSlider !== false && branches.length === 0 && !loading) {
    console.log('HeroSectionRenderer: No branches found but showBranchSlider is true');
    return (
      <div className="hero-branch-slider" style={{
        backgroundImage: `url('/images/CHURCH.jpg')`,
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
        <div style={{ position: 'relative', zIndex: 2, width: '100%', textAlign: 'center', color: 'white' }}>
          <h2>Shekinah Presbyterian Church</h2>
          <p>No church branches available. Please add branches in the admin panel.</p>
        </div>
      </div>
    );
  }

  // Return null if showBranchSlider is false
  console.log('HeroSectionRenderer: Returning null (no content to display)');
  return null;
};

export default HeroSectionRenderer;
