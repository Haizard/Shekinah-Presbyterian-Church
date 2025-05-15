import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';
// Import our modern design system
import '../styles/main.css';
import '../styles/modern-footer.css';

const Footer = () => {
  useEffect(() => {
    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }

    // Back to top button functionality
    const backToTopButton = document.getElementById('backToTop');

    const handleScroll = () => {
      if (backToTopButton) {
        if (window.scrollY > 300) {
          backToTopButton.classList.add('show');
        } else {
          backToTopButton.classList.remove('show');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert('Thank you for subscribing to our newsletter!');
    e.target.reset();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <img src="/images/logo.png" alt="Shekinah Church Logo" />
              <h3>Shekinah Presbyterian Church Tanzania</h3>
            </div>
            <div className="footer-links">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/sermons">Sermons</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-contact">
              <h3>Contact Us</h3>
              <p>
                <a href="https://maps.google.com/?q=Dar+es+Salaam,Tanzania" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> Dar es Salaam, Tanzania
                </a>
              </p>
              <p>
                <a href="tel:+255769080629" className="contact-link">
                  <FontAwesomeIcon icon={faPhone} /> +255 769 080 629
                </a>
              </p>
              <p>
                <a href="mailto:spctanzania@gmail.com" className="contact-link">
                  <FontAwesomeIcon icon={faEnvelope} /> spctanzania@gmail.com
                </a>
              </p>
            </div>
            <div className="footer-newsletter">
              <h3>Subscribe to Our Newsletter</h3>
              <form id="newsletterForm" onSubmit={handleSubmit}>
                <input type="email" placeholder="Your Email" required />
                <button type="submit" className="btn">Subscribe</button>
              </form>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; <span id="year"></span> Shekinah Presbyterian Church Tanzania. All Rights Reserved.</p>
            <p className="admin-link"><Link to="/admin/login">Admin</Link></p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <a href="#" className="back-to-top" id="backToTop" onClick={(e) => {
        e.preventDefault();
        scrollToTop();
      }}>
        <FontAwesomeIcon icon={faArrowUp} />
      </a>
    </>
  );
};

export default Footer;
