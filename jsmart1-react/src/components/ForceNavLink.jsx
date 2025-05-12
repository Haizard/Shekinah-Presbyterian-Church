import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * A component that forces a page reload when navigating to a new route
 * This is a workaround for issues with React Router not updating the page content
 */
const ForceNavLink = ({ to, className, children, onClick }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    
    // Call the onClick handler if provided
    if (onClick) {
      onClick(e);
    }
    
    // Force a full page reload by setting window.location
    window.location.href = to;
  };

  return (
    <a 
      href={to} 
      className={className} 
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

export default ForceNavLink;
