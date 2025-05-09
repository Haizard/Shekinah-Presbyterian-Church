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
        fallback={
          <div className="video-gallery-container">
            <div className="video-gallery-intro">
              <p>Watch our latest sermons, testimonies, and ministry updates.</p>
            </div>
            <div className="video-grid">
              <div className="video-card">
                <div className="video-thumbnail">
                  <img src="/images/SPCT/CHURCH.jpg" alt="Sunday Worship" />
                  <div className="play-button">
                    <FontAwesomeIcon icon={faPlay} />
                  </div>
                </div>
                <div className="video-details">
                  <h3>Sunday Worship Service</h3>
                  <p className="video-date">June 4, 2023</p>
                </div>
              </div>
              <div className="video-card">
                <div className="video-thumbnail">
                  <img src="/images/SPCT/CHURCH.jpg" alt="Bible Study" />
                  <div className="play-button">
                    <FontAwesomeIcon icon={faPlay} />
                  </div>
                </div>
                <div className="video-details">
                  <h3>Wednesday Bible Study</h3>
                  <p className="video-date">May 31, 2023</p>
                </div>
              </div>
              <div className="video-card">
                <div className="video-thumbnail">
                  <img src="/images/SPCT/CHURCH.jpg" alt="Youth Ministry" />
                  <div className="play-button">
                    <FontAwesomeIcon icon={faPlay} />
                  </div>
                </div>
                <div className="video-details">
                  <h3>Youth Ministry Highlights</h3>
                  <p className="video-date">May 26, 2023</p>
                </div>
              </div>
              <div className="video-card">
                <div className="video-thumbnail">
                  <img src="/images/SPCT/CHURCH.jpg" alt="Testimony" />
                  <div className="play-button">
                    <FontAwesomeIcon icon={faPlay} />
                  </div>
                </div>
                <div className="video-details">
                  <h3>Testimony: God's Faithfulness</h3>
                  <p className="video-date">May 21, 2023</p>
                </div>
              </div>
            </div>
          </div>
        }
        renderContent={(content) => {
          // Parse content for videos if it's in JSON format
          let videos = [];
          try {
            if (content.content.startsWith('[') && content.content.endsWith(']')) {
              videos = JSON.parse(content.content);
            }
          } catch (error) {
            console.error('Error parsing video gallery content:', error);
          }

          return (
            <div className="video-gallery-container">
              <div className="video-gallery-intro">
                <h3>{content.title}</h3>
                {!videos.length && (
                  <div dangerouslySetInnerHTML={{ __html: content.content }} />
                )}
              </div>
              {videos.length > 0 && (
                <div className="video-grid">
                  {videos.map((video, index) => (
                    <div className="video-card" key={index}>
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
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default VideoGallery;
