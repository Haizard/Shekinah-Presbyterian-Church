import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

/**
 * Component for rendering the "video_gallery" structured content
 */
const VideoGalleryRenderer = ({ content }) => {
  console.log('VideoGalleryRenderer received content:', content);

  // Handle different content formats
  let parsedContent;

  // If content is a string, try to parse it
  if (typeof content === 'string') {
    try {
      parsedContent = JSON.parse(content);
      console.log('VideoGalleryRenderer parsed string content:', parsedContent);
    } catch (error) {
      console.error('Error parsing VideoGallery content:', error);
      return <div>Error rendering content: Invalid JSON format</div>;
    }
  } else {
    // If content is already an object, use it directly
    parsedContent = content;
    console.log('VideoGalleryRenderer using object content directly:', parsedContent);
  }

  // If parsedContent is not an array, check if it's nested in a property
  if (!Array.isArray(parsedContent)) {
    // Some content might be structured as { videos: [...] }
    if (parsedContent?.videos && Array.isArray(parsedContent.videos)) {
      parsedContent = parsedContent.videos;
      console.log('VideoGalleryRenderer using nested videos array:', parsedContent);
    } else {
      // Try to convert to array if it's a single object
      if (typeof parsedContent === 'object' && parsedContent !== null) {
        console.log('VideoGalleryRenderer converting single object to array:', parsedContent);
        parsedContent = [parsedContent];
      } else {
        console.error('VideoGallery content is not an array:', parsedContent);
        return <div>Invalid content format: Expected an array of videos</div>;
      }
    }
  }

  return (
    <div className="video-gallery-grid">
      {parsedContent.map((video, index) => (
        <div className="video-card" key={`video-${video.title || video.url || index}`}>
          <div className="video-thumbnail">
            <img
              src={getImageUrl(video.thumbnail)}
              alt={video.title}
              onError={(e) => handleImageError(e)}
            />
            <div className="play-button">
              <FontAwesomeIcon icon={faPlay} />
            </div>
          </div>
          <div className="video-details">
            <h3>{video.title}</h3>
            {video.date && <p className="video-date">{video.date}</p>}
            {video.description && <p className="video-description">{video.description}</p>}
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm"
            >
              Watch Video
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoGalleryRenderer;
