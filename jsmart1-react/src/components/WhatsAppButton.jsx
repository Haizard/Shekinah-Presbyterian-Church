import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
// Using our new animation system instead of the separate CSS file
import '../styles/animations.css';

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
  // State to control animation
  const [isShaking, setIsShaking] = useState(false);

  // Format the WhatsApp URL
  const whatsappUrl = `https://wa.me/${countryCode}${phoneNumber}?text=${encodeURIComponent(message)}`;

  // Set up interval for periodic animation
  useEffect(() => {
    // Start shaking every 10 seconds
    const interval = setInterval(() => {
      setIsShaking(true);

      // Stop shaking after 1 second
      setTimeout(() => {
        setIsShaking(false);
      }, 1000);
    }, 10000);

    // Initial shake after 3 seconds
    const initialTimeout = setTimeout(() => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 1000);
    }, 3000);

    // Clean up on unmount
    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  return (
    <a
      href={whatsappUrl}
      className={`whatsapp-button ${isShaking ? 'animate-shake' : ''}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat with us on WhatsApp"
      onClick={() => setIsShaking(false)}
    >
      <FontAwesomeIcon icon={faWhatsapp} />
    </a>
  );
};

export default WhatsAppButton;
