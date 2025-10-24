import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ChurchSettingsContext from '../context/ChurchSettingsContext';
import '../styles/Gallery.css';
import '../styles/modern-gallery.css';
import api from '../services/api';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

const Gallery = () => {
  const { settings } = useContext(ChurchSettingsContext);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [visibleImages, setVisibleImages] = useState(8);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch gallery images from API
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        const data = await api.gallery.getAll();
        console.log('Fetched gallery images:', data);
        setGalleryImages(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError('Failed to load gallery images. Please try again.');

        // Fallback to empty array if API fails
        setGalleryImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  // Filter images based on category
  const filteredImages = activeCategory === 'all'
    ? galleryImages
    : galleryImages.filter(image => image.category === activeCategory);

  // Update showLoadMore when category changes
  useEffect(() => {
    setVisibleImages(8);
    setShowLoadMore(filteredImages.length > 8);
  }, [filteredImages.length]);

  // Load more images
  const loadMoreImages = () => {
    const newVisibleImages = visibleImages + 4;
    setVisibleImages(newVisibleImages);
    if (newVisibleImages >= filteredImages.length) {
      setShowLoadMore(false);
    }
  };

  // Open image modal
  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  // Close image modal
  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <main className="gallery-page">
      {/* Page Banner */}
      <section className="page-banner">
        <div className="container">
          <h2>Gallery</h2>
          <p>Capturing moments of worship, fellowship, and service</p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Photo Gallery</h2>
            <div className="divider" />
          </div>
          <div className="gallery-intro">
            <p>Browse through our collection of photos showcasing the life and ministry of {settings?.churchName || 'our church'}. From worship services to outreach activities, these images capture the moments where we gather to glorify God and serve others.</p>
          </div>

          {/* Gallery Categories */}
          <div className="gallery-categories">
            <button
              type="button"
              className={activeCategory === 'all' ? 'active' : ''}
              onClick={() => setActiveCategory('all')}
            >
              All Photos
            </button>
            <button
              type="button"
              className={activeCategory === 'worship' ? 'active' : ''}
              onClick={() => setActiveCategory('worship')}
            >
              Worship
            </button>
            <button
              type="button"
              className={activeCategory === 'events' ? 'active' : ''}
              onClick={() => setActiveCategory('events')}
            >
              Events
            </button>
            <button
              type="button"
              className={activeCategory === 'youth' ? 'active' : ''}
              onClick={() => setActiveCategory('youth')}
            >
              Youth
            </button>
            <button
              type="button"
              className={activeCategory === 'children' ? 'active' : ''}
              onClick={() => setActiveCategory('children')}
            >
              Children
            </button>
            <button
              type="button"
              className={activeCategory === 'outreach' ? 'active' : ''}
              onClick={() => setActiveCategory('outreach')}
            >
              Outreach
            </button>
          </div>

          {/* Gallery Grid */}
          <div className="gallery-grid">
            {loading ? (
              <div className="loading-container">
                <div className="spinner" />
                <p>Loading gallery...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <p>{error}</p>
              </div>
            ) : filteredImages.slice(0, visibleImages).length > 0 ? (
              filteredImages.slice(0, visibleImages).map(image => (
                <button
                  type="button"
                  className="gallery-item"
                  key={image._id}
                  onClick={() => openModal(image)}
                  aria-label={`View ${image.title}`}
                >
                  <div className="gallery-image">
                    <img
                      src={getImageUrl(image.image)}
                      alt={image.title}
                      onError={(e) => handleImageError(e)}
                    />
                    <div className="gallery-overlay">
                      <div className="gallery-info">
                        <h3>{image.title}</h3>
                        <p>{image.date}</p>
                        <div className="view-icon">
                          <FontAwesomeIcon icon="search-plus" />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="no-results">
                <p>No gallery images found in this category.</p>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {showLoadMore && (
            <div className="text-center mt-4">
              <button type="button" className="btn btn-primary" onClick={loadMoreImages}>
                Load More
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Video Gallery Section */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Video Gallery</h2>
            <div className="divider" />
          </div>
          <div className="video-gallery">
            <div className="video-item">
              <div className="video-thumbnail">
                <img src="/images/SPCT/CHURCH.jpg" alt="Sermon Video" />
                <div className="play-button">
                  <FontAwesomeIcon icon="play" />
                </div>
              </div>
              <div className="video-details">
                <h3>Sunday Sermon: "Walking in Faith"</h3>
                <p>Pastor Daniel John Seni | June 5, 2023</p>
              </div>
            </div>
            <div className="video-item">
              <div className="video-thumbnail">
                <img src="/images/SPCT/CHURCH.jpg" alt="Worship Video" />
                <div className="play-button">
                  <FontAwesomeIcon icon="play" />
                </div>
              </div>
              <div className="video-details">
                <h3>Worship Service Highlights</h3>
                <p>May 28, 2023</p>
              </div>
            </div>
            <div className="video-item">
              <div className="video-thumbnail">
                <img src="/images/SPCT/CHURCH.jpg" alt="Church Event Video" />
                <div className="play-button">
                  <FontAwesomeIcon icon="play" />
                </div>
              </div>
              <div className="video-details">
                <h3>Annual Church Conference</h3>
                <p>May 20, 2023</p>
              </div>
            </div>
          </div>
          <div className="video-cta">
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Visit Our YouTube Channel
            </a>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <dialog
          className="image-modal"
          onClick={closeModal}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              closeModal();
            }
          }}
          open
          aria-labelledby={`modal-title-${selectedImage.id}`}
        >
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            onKeyDown={e => e.stopPropagation()}
          >
            <button
              type="button"
              className="close-modal"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <FontAwesomeIcon icon="times" />
            </button>
            <div className="modal-image">
              <img
                src={getImageUrl(selectedImage.image)}
                alt={selectedImage.title}
                onError={(e) => handleImageError(e)}
              />
            </div>
            <div className="modal-details">
              <h3 id={`modal-title-${selectedImage.id}`}>{selectedImage.title}</h3>
              <p className="modal-date">{selectedImage.date}</p>
              <p className="modal-description">{selectedImage.description}</p>
            </div>
          </div>
        </dialog>
      )}

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2 className="animate-fade-in">Share Your Photos</h2>
          <p className="animate-fade-in" style={{animationDelay: '0.2s'}}>Have photos from a church event? We'd love to add them to our gallery!</p>
          <a href="mailto:photos@spctanzania.org" className="btn btn-primary btn-lg animate-slide-bottom" style={{animationDelay: '0.4s'}}>
            Submit Photos <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </section>
    </main>
  );
};

export default Gallery;
