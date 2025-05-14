import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faWhatsapp, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPrint } from '@fortawesome/free-solid-svg-icons';

const SocialShare = ({ title, url, description, className }) => {
  // Get the current URL if not provided
  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title || document.title);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = [
    {
      name: 'Facebook',
      icon: faFacebookF,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: '#3b5998'
    },
    {
      name: 'Twitter',
      icon: faTwitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: '#1da1f2'
    },
    {
      name: 'WhatsApp',
      icon: faWhatsapp,
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: '#25d366'
    },
    {
      name: 'LinkedIn',
      icon: faLinkedinIn,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: '#0077b5'
    },
    {
      name: 'Email',
      icon: faEnvelope,
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      color: '#dd4b39'
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`social-share ${className || ''}`}>
      <div className="share-title">Share this:</div>
      <div className="share-buttons">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.name}`}
            style={{
              backgroundColor: link.color,
              color: 'white',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 8px 8px 0',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <FontAwesomeIcon icon={link.icon} />
          </a>
        ))}
        <button
          onClick={handlePrint}
          aria-label="Print this page"
          style={{
            backgroundColor: '#333',
            color: 'white',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 8px 8px 0',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <FontAwesomeIcon icon={faPrint} />
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
