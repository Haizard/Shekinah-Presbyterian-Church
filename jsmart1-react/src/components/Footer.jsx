import { useEffect, useContext } from 'react';
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
import ChurchSettingsContext from '../context/ChurchSettingsContext';
// Import our modern design system
import '../styles/main.css';
import '../styles/modern-footer.css';

const Footer = () => {
  const { settings } = useContext(ChurchSettingsContext);

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
              {settings?.logo && (
                <img src={settings.logo} alt={settings.churchName || 'Church Logo'} />
              )}
              <h3>{settings?.churchName || 'Church'}</h3>
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
              {settings?.address && (
                <p>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {settings.address}
                  </a>
                </p>
              )}
              {settings?.phone && (
                <p>
                  <a href={`tel:${settings.phone}`} className="contact-link">
                    <FontAwesomeIcon icon={faPhone} /> {settings.phone}
                  </a>
                </p>
              )}
              {settings?.email && (
                <p>
                  <a href={`mailto:${settings.email}`} className="contact-link">
                    <FontAwesomeIcon icon={faEnvelope} /> {settings.email}
                  </a>
                </p>
              )}
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
            <p>&copy; <span id="year"></span> {settings?.churchName || 'Church'}. All Rights Reserved.</p>
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
