import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/Contact.css';
import '../styles/modern-contact.css';
import api from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      // Submit form data to API
      const response = await api.contact.submit(formData);

      // Handle success
      setSuccess(true);

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      // Handle error
      setError('There was an error submitting your message. Please try again later.');
      console.error('Contact form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">
      {/* Page Banner */}
      <section className="page-banner">
        <div className="container">
          <h2>Contact Us</h2>
          <p>We'd love to hear from you</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Get In Touch</h2>
            <div className="divider" />
          </div>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <FontAwesomeIcon icon="map-marker-alt" />
                <div>
                  <h3>Location</h3>
                  <a href="https://maps.google.com/?q=Dar+es+Salaam,Tanzania" target="_blank" rel="noopener noreferrer" className="contact-link">
                    Dar es Salaam, Tanzania
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <FontAwesomeIcon icon="phone" />
                <div>
                  <h3>Phone</h3>
                  <a href="tel:+255769080629" className="contact-link">
                    +255 769 080 629
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <FontAwesomeIcon icon="envelope" />
                <div>
                  <h3>Email</h3>
                  <a href="mailto:spctanzania@gmail.com" className="contact-link">
                    spctanzania@gmail.com
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <FontAwesomeIcon icon="clock" />
                <div>
                  <h3>Service Times</h3>
                  <p>Sunday: 9:00 AM - 12:00 PM</p>
                </div>
              </div>
              <div className="social-links">
                <a href="https://facebook.com" aria-label="Facebook"><FontAwesomeIcon icon={['fab', 'facebook-f']} /></a>
                <a href="https://twitter.com" aria-label="Twitter"><FontAwesomeIcon icon={['fab', 'twitter']} /></a>
                <a href="https://instagram.com" aria-label="Instagram"><FontAwesomeIcon icon={['fab', 'instagram']} /></a>
                <a href="https://youtube.com" aria-label="YouTube"><FontAwesomeIcon icon={['fab', 'youtube']} /></a>
              </div>
            </div>
            <div className="contact-form">
              {success && (
                <div className="alert alert-success">
                  <FontAwesomeIcon icon="check-circle" />
                  Thank you for your message! We will get back to you soon.
                </div>
              )}

              {error && (
                <div className="alert alert-danger">
                  <FontAwesomeIcon icon="exclamation-circle" />
                  {error}
                </div>
              )}

              <form id="contactForm" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    id="name"
                    placeholder="Your Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    id="email"
                    placeholder="Your Email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    id="subject"
                    placeholder="Subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <textarea
                    id="message"
                    placeholder="Your Message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Get in Touch</h2>
            <div className="divider" />
          </div>
          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-icon">
                <FontAwesomeIcon icon="map-marker-alt" />
              </div>
              <h3>Visit Us</h3>
              <p>Shekinah Presbyterian Church Tanzania</p>
              <p>P.O. Box 32807</p>
              <a href="https://maps.google.com/?q=Dar+es+Salaam,Tanzania" target="_blank" rel="noopener noreferrer" className="contact-link">
                Dar es Salaam, Tanzania
              </a>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <FontAwesomeIcon icon="phone" />
              </div>
              <h3>Call Us</h3>
              <a href="tel:+255769080629" className="contact-link">
                Phone: +255 769 080 629
              </a>
              <p>Office Hours:</p>
              <p>Monday-Friday: 9:00 AM - 5:00 PM</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <FontAwesomeIcon icon="envelope" />
              </div>
              <h3>Email Us</h3>
              <p>Email:</p>
              <a href="mailto:spctanzania@gmail.com" className="contact-link">
                spctanzania@gmail.com
              </a>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <FontAwesomeIcon icon="clock" />
              </div>
              <h3>Service Times</h3>
              <p>Sunday Worship: 9:00 AM - 12:00 PM</p>
              <p>Bible Study: Wednesday 6:00 PM</p>
              <p>Prayer Meeting: Friday 6:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <div className="section-header">
            <h2>Find Us</h2>
            <div className="divider" />
          </div>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58585957848!2d39.14023235!3d-6.7924035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4c1c89b0bcf7%3A0x741e1e8ee48c4fdd!2sDar%20es%20Salaam%2C%20Tanzania!5e0!3m2!1sen!2sus!4v1654321234567!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Church Location Map"
            />
          </div>
        </div>
      </section>

      {/* Prayer Request Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Prayer Requests</h2>
            <div className="divider" />
          </div>
          <div className="prayer-request-content">
            <div className="prayer-request-text">
              <p>We believe in the power of prayer. If you have a specific prayer need, our prayer team would be honored to pray for you.</p>
              <p>You can submit your prayer request using the form below or by emailing us at <a href="mailto:spctanzania@gmail.com" className="contact-link">spctanzania@gmail.com</a>.</p>
              <p>All prayer requests are kept confidential and are shared only with our prayer team.</p>
            </div>
            <div className="prayer-request-form">
              <div className="form-card">
                <div className="form-header">
                  <h3>Submit a Prayer Request</h3>
                  <p>Our prayer team is committed to lifting your needs before God. Share your request below.</p>
                </div>
                <form id="prayerRequestForm">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="prayer-name">Your Name (Optional)</label>
                      <input type="text" id="prayer-name" name="prayer-name" placeholder="Enter your name" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="prayer-email">Your Email (Optional)</label>
                      <input type="email" id="prayer-email" name="prayer-email" placeholder="Enter your email address" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="prayer-request" className="form-required">Prayer Request</label>
                    <textarea id="prayer-request" name="prayer-request" rows="5" placeholder="Share your prayer request here..." required />
                  </div>
                  <div className="form-checkbox">
                    <input type="checkbox" id="prayer-confidential" name="prayer-confidential" />
                    <label htmlFor="prayer-confidential">Keep this request confidential (shared only with the prayer team)</label>
                  </div>
                  <button type="submit" className="btn btn-primary">Submit Prayer Request</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connect With Us Section */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Connect With Us</h2>
            <div className="divider" />
          </div>
          <div className="social-connect">
            <p>Follow us on social media to stay updated with our latest news, events, and sermons.</p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FontAwesomeIcon icon={['fab', 'facebook-f']} />
                <span>Facebook</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FontAwesomeIcon icon={['fab', 'twitter']} />
                <span>Twitter</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FontAwesomeIcon icon={['fab', 'instagram']} />
                <span>Instagram</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FontAwesomeIcon icon={['fab', 'youtube']} />
                <span>YouTube</span>
              </a>
              <a href="https://wa.me/255769080629" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FontAwesomeIcon icon={['fab', 'whatsapp']} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2 className="animate-fade-in">Join Us This Sunday</h2>
          <p className="animate-fade-in" style={{animationDelay: '0.2s'}}>Experience the presence of God and the fellowship of believers</p>
          <Link to="/events" className="btn btn-primary btn-lg animate-slide-bottom" style={{animationDelay: '0.4s'}}>
            View Service Times <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Contact;
