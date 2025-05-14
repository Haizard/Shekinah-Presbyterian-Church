import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import '../styles/WhatsAppButton.css';

/**
 * WhatsApp floating button component with shaking animation
 * @param {Object} props - Component props
 * @param {string} props.phoneNumber - WhatsApp phone number (without + or country code)
 * @param {string} props.countryCode - Country code (default: 255 for Tanzania)
 * @param {string} props.message - Pre-filled message
 */
const WhatsAppButton = ({ 
  phoneNumber = "769080629", 
  countryCode = "255", 
  message = "Hello, I would like to get in touch with Shekinah Presbyterian Church Tanzania." 
}) => {
  // Format the WhatsApp URL
  const whatsappUrl = `https://wa.me/${countryCode}${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a 
      href={whatsappUrl} 
      className="whatsapp-button"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <div className="whatsapp-icon">
        <FontAwesomeIcon icon={faWhatsapp} />
      </div>
    </a>
  );
};

export default WhatsAppButton;
