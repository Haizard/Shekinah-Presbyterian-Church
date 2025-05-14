import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faUser, faPhone, faChurch, faPlay } from '@fortawesome/free-solid-svg-icons';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/BranchSlider.css';

const BranchSlider = ({ branches }) => {
  // Create a ref for the slider
  const sliderRef = useRef(null);

  // Settings for the slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000, // 10 seconds per slide
    pauseOnHover: true,
    fade: true,
    arrows: true,
    className: 'branch-slider',
    adaptiveHeight: true
  };

  // Function to manually play the slider
  const playSlider = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPlay();
      console.log('Branch slider manually played');
    }
  };

  // Ensure autoplay is working correctly
  useEffect(() => {
    // If slider is initialized and has branches
    if (sliderRef.current && branches && branches.length > 0) {
      console.log('Branch slider initialized with autoplay');

      // Force autoplay to start
      const timer = setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.slickPlay();
          console.log('Branch slider autoplay started');
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [branches]);

  // If no branches, return a message
  if (!branches || branches.length === 0) {
    console.log('No branches to display in slider');
    return (
      <div className="branch-slider-container">
        <h2 className="branch-slider-title">
          <FontAwesomeIcon icon={faChurch} /> Shekinah Presbyterian Church
        </h2>
        <div className="no-branches-message">
          <p>No church branches available. Please add branches in the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="branch-slider-container">
      <h2 className="branch-slider-title">
        <FontAwesomeIcon icon={faChurch} /> Shekinah Presbyterian Church
      </h2>
      <div className="slider-controls">
        <button className="play-button" onClick={playSlider} title="Play Slideshow">
          <FontAwesomeIcon icon={faPlay} />
        </button>
      </div>
      <Slider ref={sliderRef} {...settings}>
        {branches.map((branch) => (
          <div key={branch._id} className="branch-slide">
            <div className="branch-slide-content">
              <div className="branch-info">
                <h3>{branch.name}</h3>
                <div className="branch-details">
                  <p className="branch-location">
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {branch.location}
                  </p>
                  <p className="branch-pastor">
                    <FontAwesomeIcon icon={faUser} /> Pastor: {branch.pastor}
                  </p>
                  <p className="branch-contact">
                    <FontAwesomeIcon icon={faPhone} /> {branch.contactInfo}
                  </p>
                </div>
                {branch.description && (
                  <div className="branch-description">
                    <p>{branch.description}</p>
                  </div>
                )}
              </div>
              {branch.image ? (
                <div className="branch-image">
                  <img
                    src={getImageUrl(branch.image)}
                    alt={branch.name}
                    onError={handleImageError}
                  />
                </div>
              ) : (
                <div className="branch-image branch-image-placeholder">
                  <FontAwesomeIcon icon={faChurch} size="3x" />
                </div>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BranchSlider;
