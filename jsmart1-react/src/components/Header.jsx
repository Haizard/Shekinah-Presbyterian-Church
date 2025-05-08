import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
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

  return (
    <header className={isScrolled ? 'scrolled' : ''}>
      <div className="container">
        <div className="logo">
          <img src="/images/SPCT/LOGO.jpg" alt="Shekinah Church Logo" />
          <h1>Shekinah Church</h1>
        </div>

        <div 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={isMenuOpen ? 'active' : ''}>
          <ul>
            <li>
              <NavLink to="/" end>Home</NavLink>
            </li>
            <li className="dropdown">
              <NavLink to="/about">
                About Us <FontAwesomeIcon icon={faChevronDown} />
              </NavLink>
              <div className="dropdown-content">
                <Link to="/about#vision">Our Vision</Link>
                <Link to="/about#mission">Our Mission</Link>
                <Link to="/about#story">Our Story</Link>
                <Link to="/about#motto">Our Motto</Link>
                <Link to="/about#beliefs">Our Beliefs</Link>
              </div>
            </li>
            <li>
              <NavLink to="/sermons">Sermons</NavLink>
            </li>
            <li>
              <NavLink to="/events">Events</NavLink>
            </li>
            <li>
              <NavLink to="/ministries">Ministries</NavLink>
            </li>
            <li>
              <NavLink to="/gallery">Gallery</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
            <li>
              <NavLink to="/give" className="btn-give">Give</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
