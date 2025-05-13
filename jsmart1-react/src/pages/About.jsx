import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DynamicContent from '../components/DynamicContent';
import WeeklySchedule from '../components/WeeklySchedule';
import FeaturedEvent from '../components/FeaturedEvent';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import '../styles/About.css';

const About = () => {
  return (
    <main className="about-page">
      {/* Page Banner */}
      <section className="page-banner">
        <div className="container">
          <h2>About Us</h2>
          <p>Learn about our church, our mission, and our vision</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Who We Are</h2>
            <div className="divider" />
          </div>
          <DynamicContent
            section="who_we_are"
            className="about-content"
            fallback={
              <div className="about-content">
                <div className="about-text">
                  <p><strong>Shekinah Presbyterian Church Tanzania</strong> is a Christ-centered community committed to proclaiming the Kingdom of God across Tanzania and beyond. We exist to raise up mature disciples of Jesus, build Gospel-driven communities, and extend the love and truth of Christ to every sphere of life.</p>
                  <p>We are not just building churches—we are cultivating a missional culture where every believer is equipped to live for Christ, serve others, and make disciples who make disciples.</p>
                  <p>We operate through prayer, sound teaching, strategic outreach, and compassionate service, believing that true transformation comes only through the power of the Gospel.</p>
                </div>
                <div className="about-image">
                  <img src="/images/SPCT/CHURCH BCND.jpg" alt="Shekinah Church Building" />
                </div>
              </div>
            }
            renderContent={(content) => (
              <div className="about-content">
                <div className="about-text">
                  <div dangerouslySetInnerHTML={{ __html: content.content }} />
                </div>
                <div className="about-image">
                  <img
                    src={getImageUrl(content.image)}
                    alt={content.title}
                    onError={(e) => handleImageError(e)}
                  />
                </div>
              </div>
            )}
          />
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Our Vision</h2>
            <div className="divider" />
          </div>
          <div className="vision-content">
            <div className="vision-image">
              <img src="/images/SPCT/CHURCH BCND.jpg" alt="Church Vision" />
            </div>
            <div className="vision-text">
              <p>To see a generation of disciples who are rooted in the truth, shaped by the Gospel, and released to transform communities for the glory of Christ.</p>
              <p>We envision believers who are spiritually mature, mission-minded, and actively involved in making Jesus known—locally and globally.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Mission</h2>
            <div className="divider" />
          </div>
          <div className="mission-content">
            <div className="mission-text">
              <p>We exist to:</p>
              <ul className="mission-list">
                <li>
                  <FontAwesomeIcon icon="book-open" />
                  <div>
                    <h3>Proclaim the true Word of God</h3>
                    <p>Teaching the uncompromised Word of God with clarity and conviction as the foundation of life, discipleship, and mission.</p>
                  </div>
                </li>
                <li>
                  <FontAwesomeIcon icon="cross" />
                  <div>
                    <h3>Spread the true Gospel of Jesus Christ</h3>
                    <p>Proclaiming the Good News of Jesus Christ clearly, boldly, and faithfully through disciple-making and church planting—calling all people to repentance, faith, and new life.</p>
                  </div>
                </li>
                <li>
                  <FontAwesomeIcon icon="dove" />
                  <div>
                    <h3>Lead people into true freedom</h3>
                    <p>Helping people experience the real freedom found in Christ alone—spiritual, emotional, and relational—through the power of the cross.</p>
                  </div>
                </li>
              </ul>
              <p>Our mission is lived out through teaching, training, prayer, community engagement, and empowering leaders who will carry the fire of the Gospel into every corner of society.</p>
            </div>
            <div className="mission-image">
              <img src="/images/SPCT/CHURCH.jpg" alt="Church Mission" />
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Our Story</h2>
            <div className="divider" />
          </div>
          <div className="story-content">
            <div className="story-text">
              <p>The history of Shekinah Presbyterian Church Tanzania is deeply rooted in mission. Although our name includes the word "church," we do not operate as a denomination, but as a Christ-centered, Reformed mission committed to discipleship, Gospel expansion, and leadership development.</p>

              <p>The mission began through the faithful obedience of Missionary Mwl. Boyeon Lee from South Korea, who first visited Tanzania in 1995. After training and language study, she began her ministry in Kolandoto in 1998, focusing on teaching, church planting, and discipleship.</p>

              <p>In 2006, Mwl. Lee moved to Dar es Salaam with a small team including Daniel Seni, establishing the Shekinah Mission Centre. The first official worship service of Shekinah Presbyterian Church Tanzania was held in May 2007.</p>

              <p>By 2008, the mission had purchased land in Madale to establish a permanent base, and in August 2010, the first Sunday service was held at the new site with Rev. Dr. Daniel John Seni preaching.</p>

              <div className="story-cta">
                <Link to="/full-story" className="btn btn-primary">Read Our Full Story</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motto Section */}
      <section id="motto" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Motto</h2>
            <div className="divider" />
          </div>
          <div className="motto-content">
            <div className="motto-quote">
              <h3>"The True Word, The True Gospel, and True Freedom"</h3>
              <p className="motto-verse">Matthew 9:35</p>
            </div>
            <div className="motto-explanation">
              <p>This motto shapes everything we do. Inspired by the ministry of Jesus—who went through towns and villages teaching, preaching the Gospel of the Kingdom, and healing—we are committed to:</p>
              <ul>
                <li><strong>The True Word</strong> - Teaching the uncompromised Word of God as the foundation of life, discipleship, and mission.</li>
                <li><strong>The True Gospel</strong> - Proclaiming the Good News of Jesus Christ clearly, boldly, and faithfully—calling all people to repentance, faith, and new life.</li>
                <li><strong>True Freedom</strong> - Helping people experience the real freedom found in Christ alone—freedom from sin, fear, brokenness, and spiritual darkness.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section id="leadership" className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Our Leadership</h2>
            <div className="divider" />
          </div>
          <DynamicContent
            section="leadership"
            className="leadership-content"
            fallback={
              <div className="leadership-content">
                <div className="leadership-intro">
                  <p>Our church is led by a team of dedicated pastors and elders who are committed to serving Christ and His people with integrity and compassion.</p>
                </div>
                <div className="leadership-grid">
                  <div className="leader-card">
                    <div className="leader-image">
                      <img src="/images/SPCT/Rev. Dr. Daniel John Seni (senior pastor, and one of the founder).jpg" alt="Senior Pastor" />
                    </div>
                    <div className="leader-details">
                      <h3>Dr. Daniel John</h3>
                      <p className="leader-title">Senior Pastor</p>
                      <p className="leader-bio">Dr. Daniel John Seni (senior pastor, and one of the founder).</p>
                      <div className="leader-social">
                        <a href="/" aria-label="Facebook"><FontAwesomeIcon icon={['fab', 'facebook-f']} /></a>
                        <a href="/" aria-label="Twitter"><FontAwesomeIcon icon={['fab', 'twitter']} /></a>
                        <a href="/" aria-label="Instagram"><FontAwesomeIcon icon={['fab', 'instagram']} /></a>
                      </div>
                    </div>
                  </div>

                  <div className="leader-card">
                    <div className="leader-image">
                      <img src="/images/SPCT/Mwl. Boyeon Lee (Missionary and one of the founder).jpg" alt="Associate Pastor" />
                    </div>
                    <div className="leader-details">
                      <h3>Mwl. Boyeon Lee </h3>
                      <p className="leader-title">MWALIMU LEE</p>
                      <p className="leader-bio">Mwl. Boyeon Lee (Missionary and one of the founder).</p>
                      <div className="leader-social">
                        <a href="/" aria-label="Facebook"><FontAwesomeIcon icon={['fab', 'facebook-f']} /></a>
                        <a href="/" aria-label="Instagram"><FontAwesomeIcon icon={['fab', 'instagram']} /></a>
                        <a href="/" aria-label="LinkedIn"><FontAwesomeIcon icon={['fab', 'linkedin-in']} /></a>
                      </div>
                    </div>
                  </div>

                  <div className="leader-card">
                    <div className="leader-image">
                      <img src="/images/SPCT/Rev. Emanuel Nzelah (deputy overseer).jpg" alt="Youth Pastor" />
                    </div>
                    <div className="leader-details">
                      <h3>Rev. Emanuel Nzelah</h3>
                      <p className="leader-title">REV</p>
                      <p className="leader-bio">Rev. Emanuel Nzelah (deputy overseer).</p>
                      <div className="leader-social">
                        <a href="/" aria-label="Facebook"><FontAwesomeIcon icon={['fab', 'facebook-f']} /></a>
                        <a href="/" aria-label="Twitter"><FontAwesomeIcon icon={['fab', 'twitter']} /></a>
                        <a href="/" aria-label="Instagram"><FontAwesomeIcon icon={['fab', 'instagram']} /></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* Beliefs Section */}
      <section id="beliefs" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Beliefs</h2>
            <div className="divider" />
          </div>
          <div className="beliefs-content">
            <div className="beliefs-intro">
              <p>Our church is rooted in the historic Christian faith, standing firmly within the Reformed tradition. We believe in the sovereign grace of God, the authority of His Word, and the power of the Gospel to transform lives and communities.</p>
            </div>
            <div className="beliefs-grid">
              <div className="belief-card">
                <div className="belief-icon">
                  <FontAwesomeIcon icon="crown" />
                </div>
                <h3>The Supremacy of God</h3>
                <p>We believe God is sovereign over all creation, history, and salvation. His purposes cannot be stopped. (Psalm 115:3; Daniel 4:35; Romans 11:36)</p>
              </div>
              <div className="belief-card">
                <div className="belief-icon">
                  <FontAwesomeIcon icon="bible" />
                </div>
                <h3>The Authority of Scripture</h3>
                <p>We believe the Bible is the inspired, inerrant, and complete Word of God—our final authority in all matters of faith and life. (2 Timothy 3:16–17; Matthew 4:4)</p>
              </div>
              <div className="belief-card">
                <div className="belief-icon">
                  <FontAwesomeIcon icon="heart-broken" />
                </div>
                <h3>The Total Depravity of Humanity</h3>
                <p>We believe all people are born in sin and are spiritually dead, unable to save themselves apart from God's grace. (Romans 3:10–12; Ephesians 2:1–3)</p>
              </div>
              <div className="belief-card">
                <div className="belief-icon">
                  <FontAwesomeIcon icon="gift" />
                </div>
                <h3>Salvation by Grace Alone</h3>
                <p>We believe that salvation is entirely a gift of God's grace—unearned and undeserved—purchased by the finished work of Christ. (Ephesians 2:8–9; Titus 3:4–7)</p>
              </div>
              <div className="belief-card">
                <div className="belief-icon">
                  <FontAwesomeIcon icon="cross" />
                </div>
                <h3>Faith in Christ Alone</h3>
                <p>We believe that justification is through faith alone in Jesus Christ—who lived, died, and rose again for our salvation. (Romans 5:1; Galatians 2:16)</p>
              </div>
              <div className="belief-card">
                <div className="belief-icon">
                  <FontAwesomeIcon icon="dove" />
                </div>
                <h3>The Work of the Holy Spirit</h3>
                <p>We believe that the Holy Spirit regenerates, sanctifies, empowers, and preserves all true believers. (John 3:5–8; Romans 8:9–17; Galatians 5:22–25)</p>
              </div>
              <div className="belief-card">
                <div className="belief-icon">
                  <FontAwesomeIcon icon="users" />
                </div>
                <h3>The Church as God's Community</h3>
                <p>We believe the Church is the gathered people of God, called to worship, grow in the Word, celebrate the sacraments, and fulfill the Great Commission. (1 Peter 2:9–10; Acts 2:42–47)</p>
              </div>
              <div className="belief-card">
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
          <div className="section-header">
            <h2>Weekly Schedule</h2>
            <div className="divider" />
          </div>
          <WeeklySchedule />
        </div>
      </section>

      {/* Featured Event Section */}
      <section id="featured-event" className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Featured Event</h2>
            <div className="divider" />
          </div>
          <FeaturedEvent />
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2>Join Us This Sunday</h2>
          <p>Experience the presence of God and the fellowship of believers</p>
          <Link to="/contact" className="btn btn-primary">Plan Your Visit</Link>
        </div>
      </section>
    </main>
  );
};

export default About;
