import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ForceNavLink from './ForceNavLink';
import '../styles/Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // State to track which dropdown is active on mobile
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Close the menu when a link is clicked
  const closeMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    // Also reset any active dropdown
    setActiveDropdown(null);
  };

  // Toggle dropdown on mobile
  const toggleDropdown = (dropdownName) => {
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownName);
    }
  };

  return (
    <header className={isScrolled ? 'scrolled' : ''}>
      <div className="container">
        <div className="logo">
          <img src="/images/SPCT/LOGO.jpg" alt="Shekinah Church Logo" />
          <h1>Shekinah Church</h1>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          onKeyUp={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleMenu();
            }
          }}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={isMenuOpen ? 'active' : ''}>
          <ul>
            <li>
              <ForceNavLink to="/" onClick={closeMenu}>Home</ForceNavLink>
            </li>
            <li className={`dropdown ${activeDropdown === 'about' ? 'active' : ''}`}>
              <div className="nav-link-wrapper">
                <ForceNavLink to="/about" onClick={closeMenu}>
                  About Us
                </ForceNavLink>
                <button
                  type="button"
                  className="dropdown-toggle"
                  aria-label="Toggle About dropdown"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown('about');
                  }}
                >
                  <FontAwesomeIcon icon={faChevronDown} />
                </button>
              </div>
              <div className="dropdown-content">
                <ForceNavLink to="/about#vision" onClick={closeMenu}>Our Vision</ForceNavLink>
                <ForceNavLink to="/about#mission" onClick={closeMenu}>Our Mission</ForceNavLink>
                <ForceNavLink to="/about#story" onClick={closeMenu}>Our Story</ForceNavLink>
                <ForceNavLink to="/about#motto" onClick={closeMenu}>Our Motto</ForceNavLink>
                <ForceNavLink to="/about#beliefs" onClick={closeMenu}>Our Beliefs</ForceNavLink>
              </div>
            </li>
            <li>
              <ForceNavLink to="/sermons" onClick={closeMenu}>Sermons</ForceNavLink>
            </li>
            <li>
              <ForceNavLink to="/events" onClick={closeMenu}>Events</ForceNavLink>
            </li>
            <li>
              <ForceNavLink to="/ministries" onClick={closeMenu}>Ministries</ForceNavLink>
            </li>
            <li>
              <ForceNavLink to="/gallery" onClick={closeMenu}>Gallery</ForceNavLink>
            </li>
            <li>
              <ForceNavLink to="/contact" onClick={closeMenu}>Contact</ForceNavLink>
            </li>
            <li>
              <ForceNavLink to="/give" className="btn-give" onClick={closeMenu}>Give</ForceNavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
