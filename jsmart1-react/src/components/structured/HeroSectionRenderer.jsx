import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import BranchSlider from '../BranchSlider';
import api from '../../services/api';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

/**
 * Component for rendering the "hero" structured content
 * Follows the same pattern as LeadershipRenderer
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
      return renderFallback();
    }
  } catch (error) {
    console.error('Error parsing hero section data:', error);
    // Return fallback if parsing fails
    return renderFallback();
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

  // Render branch slider if showBranchSlider is true and we have branches
  if (heroData.showBranchSlider !== false && branches.length > 0) {
    return <BranchSlider branches={branches} />;
  }

  // Render fallback content if no branches or showBranchSlider is false
  return renderFallback();

  // Fallback content function
  function renderFallback() {
    return (
      <div className="hero-content">
        <div className="hero-main-content">
          <h2>Welcome to Shekinah Presbyterian Church Tanzania</h2>
          {heroData?.subtitle ? (
            <p>{heroData.subtitle}</p>
          ) : (
            <p>"The True Word, The True Gospel, and True Freedom"</p>
          )}
          <div className="hero-buttons">
            <a href="#about" className="btn btn-primary">Learn More</a>
            <Link to="/contact" className="btn btn-secondary">Plan Your Visit</Link>
          </div>
          <div className="service-times">
            <p><FontAwesomeIcon icon={faClock} /> Sunday Service: 9:00 AM</p>
            <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Dar es Salaam, Tanzania</p>
          </div>
        </div>
      </div>
    );
  }
};

export default HeroSectionRenderer;
