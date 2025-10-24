import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DynamicContent from '../components/DynamicContent';
import ContentRendererFactory from '../components/structured/ContentRendererFactory';
import WeeklySchedule from '../components/WeeklySchedule';
import FeaturedEvent from '../components/FeaturedEvent';
import Leadership from '../components/Leadership';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import { initAnimations } from '../utils/animationUtils';
// Import our modern design system
import '../styles/main.css';
import '../styles/modern-home.css';
import '../styles/modern-about.css';

const About = () => {
  const location = useLocation();

  // Scroll to section based on hash in URL and initialize animations
  useEffect(() => {
    // Initialize animations when the component mounts
    initAnimations();

    // Get the hash from the URL (e.g., #vision, #mission)
    const hash = location.hash;
    if (hash) {
      // Remove the # character
      const sectionId = hash.substring(1);

      // Find the element with that ID
      const element = document.getElementById(sectionId);

      // If the element exists, scroll to it
      if (element) {
        // Add a small delay to ensure the page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }

    // Re-initialize animations when the location changes
    // This ensures animations work when navigating between sections
    initAnimations();
  }, [location]);

  return (
    <main className="about-page">
      {/* Page Banner */}
      <section className="page-banner">
        <div className="container">
          <h2 className="animate-fade-in">About Us</h2>
          <p className="animate-fade-in" style={{animationDelay: '0.2s'}}>Learn about our church, our mission, and our vision</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Who We Are</h2>
            <div className="divider" />
          </div>
          <DynamicContent
            section="about"
            className="about-content"
            renderContent={(content) => {
              return (
                <div className="about-content">
                  <div className="about-text">
                    <ContentRendererFactory
                      section="about"
                      content={content.content}
                      contentId={content._id}
                    />
                  </div>
                  <div className="about-image animate-slide-left">
                    <img
                      src={getImageUrl(content.image)}
                      alt={content.title}
                      onError={(e) => handleImageError(e)}
                    />
                  </div>
                </div>
              );
            }}
          />
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="section bg-light">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Our Vision</h2>
            <div className="divider" />
          </div>
          <DynamicContent
            section="vision"
            className="vision-content"
            renderContent={(content) => {
              return (
                <div className="vision-content">
                  <div className="vision-image">
                    <img
                      src={getImageUrl(content.image)}
                      alt={content.title}
                      onError={(e) => handleImageError(e)}
                    />
                  </div>
                  <div className="vision-text">
                    <ContentRendererFactory
                      section="vision"
                      content={content.content || 'Default content for vision'}
                      contentId={content._id}
                    />
                  </div>
                </div>
              );
            }}
          />
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Our Mission</h2>
            <div className="divider" />
          </div>
          <DynamicContent
            section="mission"
            className="mission-content"
            renderContent={(content) => {
              return (
                <div className="mission-content">
                  <div className="mission-text">
                    <ContentRendererFactory
                      section="mission"
                      content={content.content || 'Default content for mission'}
                      contentId={content._id}
                    />
                  </div>
                  <div className="mission-image">
                    <img
                      src={getImageUrl(content.image)}
                      alt={content.title}
                      onError={(e) => handleImageError(e)}
                    />
                  </div>
                </div>
              );
            }}
          />
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="section bg-light">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Our Story</h2>
            <div className="divider" />
          </div>
          <DynamicContent
            section="story"
            className="story-content animate-fade-in"
            fallback={
              <div className="story-content animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="story-text">
                  <p>Our church has a rich history of faith and service. We are committed to discipleship, Gospel expansion, and leadership development.</p>
                  <div className="story-cta animate-slide-bottom" style={{animationDelay: '0.4s'}}>
                    <Link to="/full-story" className="btn btn-primary btn-lg">
                      Read Our Full Story <FontAwesomeIcon icon="arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>
            }
            renderContent={(content) => (
              <div className="story-content animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="story-text">
                  <ContentRendererFactory
                    section="story"
                    content={content.content}
                    contentId={content._id}
                  />
                  <div className="story-cta animate-slide-bottom" style={{animationDelay: '0.4s'}}>
                    <Link to="/full-story" className="btn btn-primary btn-lg">
                      Read Our Full Story <FontAwesomeIcon icon="arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </section>

      {/* Motto Section */}
      <section id="motto" className="section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Our Motto</h2>
            <div className="divider" />
          </div>
          <DynamicContent
            section="motto"
            className="animate-fade-in"
            renderContent={(content) => (
              <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
                <ContentRendererFactory
                  section="motto"
                  content={content.content}
                  contentId={content._id}
                />
              </div>
            )}
          />
        </div>
      </section>

      {/* Leadership Section */}
      <section id="leadership" className="section bg-light">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Our Leadership</h2>
            <div className="divider" />
          </div>

          <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
            <Leadership />
          </div>
        </div>
      </section>

      {/* Beliefs Section */}
      <section id="beliefs" className="section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Our Beliefs</h2>
            <div className="divider" />
          </div>
          <div className="beliefs-content">
            <div className="beliefs-intro animate-fade-in" style={{animationDelay: '0.2s'}}>
              <p>Our church is rooted in the historic Christian faith, standing firmly within the Reformed tradition. We believe in the sovereign grace of God, the authority of His Word, and the power of the Gospel to transform lives and communities.</p>
            </div>
            <div className="beliefs-grid">
              <div className="belief-card animate-slide-bottom" style={{animationDelay: '0.1s'}}>
                <div className="belief-icon">
                  <FontAwesomeIcon icon="crown" />
                </div>
                <h3>The Supremacy of God</h3>
                <p>We believe God is sovereign over all creation, history, and salvation. His purposes cannot be stopped. (Psalm 115:3; Daniel 4:35; Romans 11:36)</p>
              </div>
              <div className="belief-card animate-slide-bottom" style={{animationDelay: '0.2s'}}>
                <div className="belief-icon">
                  <FontAwesomeIcon icon="bible" />
                </div>
                <h3>The Authority of Scripture</h3>
                <p>We believe the Bible is the inspired, inerrant, and complete Word of God—our final authority in all matters of faith and life. (2 Timothy 3:16–17; Matthew 4:4)</p>
              </div>
              <div className="belief-card animate-slide-bottom" style={{animationDelay: '0.3s'}}>
                <div className="belief-icon">
                  <FontAwesomeIcon icon="heart-broken" />
                </div>
                <h3>The Total Depravity of Humanity</h3>
                <p>We believe all people are born in sin and are spiritually dead, unable to save themselves apart from God's grace. (Romans 3:10–12; Ephesians 2:1–3)</p>
              </div>
              <div className="belief-card animate-slide-bottom" style={{animationDelay: '0.4s'}}>
                <div className="belief-icon">
                  <FontAwesomeIcon icon="gift" />
                </div>
                <h3>Salvation by Grace Alone</h3>
                <p>We believe that salvation is entirely a gift of God's grace—unearned and undeserved—purchased by the finished work of Christ. (Ephesians 2:8–9; Titus 3:4–7)</p>
              </div>
              <div className="belief-card animate-slide-bottom" style={{animationDelay: '0.5s'}}>
                <div className="belief-icon">
                  <FontAwesomeIcon icon="cross" />
                </div>
                <h3>Faith in Christ Alone</h3>
                <p>We believe that justification is through faith alone in Jesus Christ—who lived, died, and rose again for our salvation. (Romans 5:1; Galatians 2:16)</p>
              </div>
              <div className="belief-card animate-slide-bottom" style={{animationDelay: '0.6s'}}>
                <div className="belief-icon">
                  <FontAwesomeIcon icon="dove" />
                </div>
                <h3>The Work of the Holy Spirit</h3>
                <p>We believe that the Holy Spirit regenerates, sanctifies, empowers, and preserves all true believers. (John 3:5–8; Romans 8:9–17; Galatians 5:22–25)</p>
              </div>
              <div className="belief-card animate-slide-bottom" style={{animationDelay: '0.7s'}}>
                <div className="belief-icon">
                  <FontAwesomeIcon icon="users" />
                </div>
                <h3>The Church as God's Community</h3>
                <p>We believe the Church is the gathered people of God, called to worship, grow in the Word, celebrate the sacraments, and fulfill the Great Commission. (1 Peter 2:9–10; Acts 2:42–47)</p>
              </div>
              <div className="belief-card animate-slide-bottom" style={{animationDelay: '0.8s'}}>
                <div className="belief-icon">
                  <FontAwesomeIcon icon="star" />
                </div>
                <h3>The Glory of God</h3>
                <p>We believe that our highest purpose is to glorify God and enjoy Him forever in every aspect of life. (1 Corinthians 10:31; Romans 12:1–2)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Schedule Section */}
      <section id="schedule" className="section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Weekly Schedule</h2>
            <div className="divider" />
          </div>
          <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
            <WeeklySchedule />
          </div>
        </div>
      </section>

      {/* Featured Event Section */}
      <section id="featured-event" className="section bg-light">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Featured Event</h2>
            <div className="divider" />
          </div>
          <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
            <FeaturedEvent />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2 className="animate-fade-in">Join Us This Sunday</h2>
          <p className="animate-fade-in" style={{animationDelay: '0.2s'}}>Experience the presence of God and the fellowship of believers</p>
          <Link to="/contact" className="btn btn-primary btn-lg animate-slide-bottom" style={{animationDelay: '0.4s'}}>
            Plan Your Visit <FontAwesomeIcon icon="arrow-right" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default About;
