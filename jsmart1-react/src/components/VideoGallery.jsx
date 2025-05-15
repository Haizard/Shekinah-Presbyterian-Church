import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import DynamicContent from './DynamicContent';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import '../styles/VideoGallery.css';

const VideoGallery = () => {
  return (
    <div className="video-gallery">
      <DynamicContent
        section="video_gallery"
        fallback={null} // No fallback - show nothing if no data
        renderContent={(content) => {
          // Parse content for videos if it's in JSON format
          let videos = [];
          try {
            // Check if content.content is already an array (pre-parsed by DynamicContent)
            if (Array.isArray(content.content)) {
              videos = content.content;
            }
            // Check if it's a string that needs to be parsed
            else if (typeof content.content === 'string' &&
                    content.content.trim().startsWith('[') &&
                    content.content.trim().endsWith(']')) {
              videos = JSON.parse(content.content);
            }
          } catch (error) {
            console.error('Error parsing video gallery content:', error);
          }

          // If no videos, don't render anything
          if (!videos.length) {
            return null;
          }

          return (
            <div className="video-gallery-container">
              <div className="video-gallery-intro">
                <h3>{content.title}</h3>
              </div>
              <div className="video-grid">
                {videos.map((video, index) => (
                  <div className="video-card" key={`video-${video.title || video.url || index}`}>
                    <div className="video-thumbnail">
                      <img
                        src={getImageUrl(video.thumbnail)}
                        alt={video.title}
                        onError={(e) => handleImageError(e)}
                      />
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="play-button"
                      >
                        <FontAwesomeIcon icon={faPlay} />
                      </a>
                    </div>
                    <div className="video-details">
                      <h3>{video.title}</h3>
                      <p className="video-date">{video.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default VideoGallery;
