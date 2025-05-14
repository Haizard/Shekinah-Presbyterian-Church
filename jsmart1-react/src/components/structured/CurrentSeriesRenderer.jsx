import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

/**
 * Component for rendering the "current_series" structured content
 * Follows the same pattern as LeadershipRenderer
 */
const CurrentSeriesRenderer = ({ content, image }) => {
  // Parse content if it's a string
  let seriesData;
  try {
    seriesData = typeof content === 'string' ? JSON.parse(content) : content;

    // Validate the structure of seriesData
    if (!seriesData || typeof seriesData !== 'object') {
      console.error('Invalid current series data structure:', seriesData);
      return null; // Return nothing if data is invalid
    }
  } catch (error) {
    console.error('Error parsing current series data:', error);
    // Return nothing if parsing fails
    return null;
  }

  // If we have valid series data, render it
  if (seriesData?.seriesTitle && seriesData?.description) {
    return (
      <div className="current-series">
        <div className="series-image">
          <img
            src={getImageUrl(image)}
            alt={seriesData.seriesTitle}
            onError={(e) => handleImageError(e)}
          />
        </div>
        <div className="series-details">
          <h3>{seriesData.seriesTitle}</h3>
          <p className="series-description">{seriesData.description}</p>
          {seriesData.dateRange && (
            <p className="series-meta">{seriesData.dateRange}</p>
          )}
          <Link to={seriesData.link || '/sermons'} className="btn btn-primary">View Series</Link>
        </div>
      </div>
    );
  }

  // Return null if no valid data
  return null;
};

export default CurrentSeriesRenderer;
