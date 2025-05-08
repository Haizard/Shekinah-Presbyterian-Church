import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Gallery.css';

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [visibleImages, setVisibleImages] = useState(8);
  const [showLoadMore, setShowLoadMore] = useState(true);

  // Sample gallery data
  const galleryImages = [
    {
      id: 1,
      category: 'worship',
      title: 'Sunday Worship Service',
      description: 'Our congregation gathered for Sunday worship service.',
      image: '/images/SPCT/CHURCH.jpg',
      date: 'June 5, 2023'
    },
    {
      id: 2,
      category: 'events',
      title: 'Annual Church Conference',
      description: 'Highlights from our annual church conference.',
      image: '/images/SPCT/CHURCH.jpg',
      date: 'May 20, 2023'
    },
    {
      id: 3,
      category: 'youth',
      title: 'Youth Retreat',
      description: 'Our youth group during their annual retreat.',
      image: '/images/SPCT/CHURCH.jpg',
      date: 'April 15, 2023'
    },
    {
      id: 4,
      category: 'outreach',
      title: 'Community Outreach',
      description: 'Church members serving the local community.',
      image: '/images/SPCT/CHURCH.jpg',
      date: 'March 28, 2023'
    },
    {
      id: 5,
      category: 'worship',
      title: 'Easter Sunday Celebration',
      description: 'Celebrating the resurrection of our Lord Jesus Christ.',
      image: '/images/SPCT/CHURCH.jpg',
      date: 'April 9, 2023'
    },
    {
      id: 6,
      category: 'children',
      title: 'Children\'s Sunday School',
      description: 'Children learning about God\'s Word in Sunday School.',
      image: '/images/SPCT/CHURCH.jpg',
      date: 'May 7, 2023'
    },
    {
      id: 7,
      category: 'events',
      title: 'Church Anniversary',
      description: 'Celebrating another year of God\'s faithfulness to our church.',
      image: '/images/SPCT/CHURCH.jpg',
      date: 'February 12, 2023'
    },
    {
      id: 8,
      category: 'outreach',
      title: 'Mission Trip',
      description: 'Our mission team serving in a neighboring community.',
      image: '/images/SPCT/CHURCH.jpg',
      date: 'January 25, 2023'
    },
    {
      id: 9,
      category: 'youth',
      title: 'Youth Worship Night',
      description: 'Young people praising God during our monthly youth worship night.',
      image: '/images/SPCT/CHURCH.jpg',
      date: 'May 26, 2023'
    },
    {
      id: 10,
      category: 'children',
      title: 'Vacation Bible School',
      description: 'Children enjoying activities during our annual Vacation Bible School.',
      image: '/images/SPCT/CHURCH.jpg',
      date: 'June 1, 2023'
    },
    {
      id: 11,
      category: 'worship',
      title: 'Worship Team Practice',
      description: 'Our worship team preparing for Sunday service.',
      image: '/images/SPCT/CHURCH.jpg',
      date: 'May 30, 2023'
    },
    {
      id: 12,
      category: 'events',
      title: 'Baptism Service',
      description: 'New believers publicly declaring their faith through baptism.',
      image: '/images/SPCT/CHURCH.jpg',
      date: 'April 30, 2023'
    }
  ];

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
            <p>Browse through our collection of photos showcasing the life and ministry of Shekinah Presbyterian Church Tanzania. From worship services to outreach activities, these images capture the moments where we gather to glorify God and serve others.</p>
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
            {filteredImages.slice(0, visibleImages).map(image => (
              <button
                type="button"
                className="gallery-item"
                key={image.id}
                onClick={() => openModal(image)}
                aria-label={`View ${image.title}`}
              >
                <div className="gallery-image">
                  <img src={image.image} alt={image.title} />
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
            ))}
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
              <img src={selectedImage.image} alt={selectedImage.title} />
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
          <h2>Share Your Photos</h2>
          <p>Have photos from a church event? We'd love to add them to our gallery!</p>
          <a href="mailto:photos@spctanzania.org" className="btn btn-primary">Submit Photos</a>
        </div>
      </section>
    </main>
  );
};

export default Gallery;
