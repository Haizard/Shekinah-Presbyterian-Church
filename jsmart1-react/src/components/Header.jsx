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
                <a href="/about#vision" onClick={(e) => {
                  closeMenu();
                  // If we're already on the about page, prevent default navigation and just scroll
                  if (window.location.pathname === '/about') {
                    e.preventDefault();
                    const element = document.getElementById('vision');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}>Our Vision</a>
                <a href="/about#mission" onClick={(e) => {
                  closeMenu();
                  if (window.location.pathname === '/about') {
                    e.preventDefault();
                    const element = document.getElementById('mission');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}>Our Mission</a>
                <a href="/about#story" onClick={(e) => {
                  closeMenu();
                  if (window.location.pathname === '/about') {
                    e.preventDefault();
                    const element = document.getElementById('story');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}>Our Story</a>
                <a href="/about#motto" onClick={(e) => {
                  closeMenu();
                  if (window.location.pathname === '/about') {
                    e.preventDefault();
                    const element = document.getElementById('motto');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}>Our Motto</a>
                <a href="/about#beliefs" onClick={(e) => {
                  closeMenu();
                  if (window.location.pathname === '/about') {
                    e.preventDefault();
                    const element = document.getElementById('beliefs');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}>Our Beliefs</a>
                <a href="/about#leadership" onClick={(e) => {
                  closeMenu();
                  if (window.location.pathname === '/about') {
                    e.preventDefault();
                    const element = document.getElementById('leadership');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}>Our Leadership</a>
                <a href="/about#schedule" onClick={(e) => {
                  closeMenu();
                  if (window.location.pathname === '/about') {
                    e.preventDefault();
                    const element = document.getElementById('schedule');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}>Weekly Schedule</a>
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
