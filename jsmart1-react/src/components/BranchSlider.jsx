import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faUser, faPhone, faChurch } from '@fortawesome/free-solid-svg-icons';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/BranchSlider.css';

const BranchSlider = ({ branches }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Removed console log to prevent browser overload

  // Settings for the slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 20000, // 20 seconds per slide
    pauseOnHover: true,
    beforeChange: (current, next) => setCurrentSlide(next),
    fade: true,
    arrows: true,
    className: 'branch-slider',
    adaptiveHeight: true
  };

  // If no branches, return null
  if (!branches || branches.length === 0) {
    console.log('No branches to display in slider');
    return null;
  }

  return (
    <div className="branch-slider-container">
      <h2 className="branch-slider-title">
        <FontAwesomeIcon icon={faChurch} /> Shekinah Presbyterian Church
      </h2>
      <Slider {...settings}>
        {branches.map((branch, index) => (
          <div key={branch._id} className="branch-slide">
            <div className="branch-slide-content">
              <div className="branch-info">
                <h3>{branch.name}</h3>
                <p className="branch-location">
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> {branch.location}
                </p>
                <p className="branch-pastor">
                  <FontAwesomeIcon icon={faUser} /> Pastor: {branch.pastor}
                </p>
                <p className="branch-contact">
                  <FontAwesomeIcon icon={faPhone} /> {branch.contactInfo}
                </p>
                {branch.description && (
                  <p className="branch-description">{branch.description}</p>
                )}
                {branch.memberCount > 0 && (
                  <p className="branch-members">Members: {branch.memberCount}</p>
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
