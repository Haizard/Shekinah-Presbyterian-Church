import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Ministries.css';
import api from '../services/api';

const Ministries = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ministries from API
  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        setLoading(true);
        const data = await api.ministries.getAll();
        setMinistries(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching ministries:', err);
        setError('Failed to load ministries. Please try again.');

        // Fallback to sample data if API fails
        setMinistries([
          {
            _id: '1',
            title: 'Worship Ministry',
            category: 'worship',
            description: 'Our worship ministry leads the congregation in praise and worship, creating an atmosphere for encountering God through music, prayer, and the arts.',
            image: '/images/SPCT/CHURCH.jpg',
            leader: 'John Doe',
            meetingTime: 'Rehearsals: Saturdays at 4:00 PM'
          },
          {
            _id: '2',
            title: 'Children\'s Ministry',
            category: 'children',
            description: 'We provide a safe, fun, and Bible-based environment where children can learn about Jesus and grow in their faith through age-appropriate activities.',
            image: '/images/SPCT/CHURCH.jpg',
            leader: 'Jane Smith',
            meetingTime: 'Sundays during service'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMinistries();
  }, []);

  // Filter ministries based on category
  const filteredMinistries = activeCategory === 'all'
    ? ministries
    : ministries.filter(ministry => ministry.category === activeCategory);

  return (
    <main className="ministries-page">
      {/* Page Banner */}
      <section className="page-banner">
        <div className="container">
          <h2>Ministries</h2>
          <p>Serving God and others through various areas of ministry</p>
        </div>
      </section>

      {/* Ministries Introduction */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>How We Serve</h2>
            <div className="divider" />
          </div>
          <div className="ministries-intro">
            <p>At Shekinah Presbyterian Mission Tanzania, ministry is not just what we do — it's who we are. We serve with the conviction that the Gospel of Christ transforms lives, families, communities, and nations.</p>
            <p>Whether you're called to pray, serve, give, or spread the word — there's a place for you in this mission. We invite you to explore our ministries and find where God is calling you to get involved.</p>
            <div className="ministry-buttons">
              <a href="#worship" className="btn btn-sm">Worship</a>
              <a href="#discipleship" className="btn btn-sm">Discipleship</a>
              <a href="#children" className="btn btn-sm">Children</a>
              <a href="#youth" className="btn btn-sm">Youth</a>
              <a href="#outreach" className="btn btn-sm">Outreach</a>
              <a href="#missions" className="btn btn-sm">Missions</a>
              <a href="#prayer" className="btn btn-sm">Prayer</a>
            </div>
          </div>
        </div>
      </section>

      {/* Ministries Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Ministries</h2>
            <div className="divider" />
          </div>
          <div className="ministries-intro">
            <p>At Shekinah Presbyterian Church Tanzania, we believe that every believer is called to serve. Our ministries provide opportunities for you to use your gifts, grow in your faith, and make a difference in the lives of others.</p>
            <p>Explore our ministries below and find where you can connect and serve.</p>
          </div>

          {/* Ministry Categories */}
          <div className="ministry-categories">
            <button
              type="button"
              className={activeCategory === 'all' ? 'active' : ''}
              onClick={() => setActiveCategory('all')}
            >
              All Ministries
            </button>
            <button
              type="button"
              className={activeCategory === 'worship' ? 'active' : ''}
              onClick={() => setActiveCategory('worship')}
            >
              Worship
            </button>
            <button
              type="button"
              className={activeCategory === 'children' ? 'active' : ''}
              onClick={() => setActiveCategory('children')}
            >
              Children
            </button>
            <button
              type="button"
              className={activeCategory === 'youth' ? 'active' : ''}
              onClick={() => setActiveCategory('youth')}
            >
              Youth
            </button>
            <button
              type="button"
              className={activeCategory === 'adults' ? 'active' : ''}
              onClick={() => setActiveCategory('adults')}
            >
              Adults
            </button>
            <button
              type="button"
              className={activeCategory === 'prayer' ? 'active' : ''}
              onClick={() => setActiveCategory('prayer')}
            >
              Prayer
            </button>
            <button
              type="button"
              className={activeCategory === 'outreach' ? 'active' : ''}
              onClick={() => setActiveCategory('outreach')}
            >
              Outreach
            </button>
            <button
              type="button"
              className={activeCategory === 'discipleship' ? 'active' : ''}
              onClick={() => setActiveCategory('discipleship')}
            >
              Discipleship
            </button>
          </div>

          {/* Ministries Grid */}
          {loading ? (
            <div className="loading-container">
              <div className="spinner" />
              <p>Loading ministries...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
            </div>
          ) : (
            <div className="ministries-grid">
              {filteredMinistries.length > 0 ? (
                filteredMinistries.map(ministry => (
                  <div className="ministry-card" key={ministry._id}>
                    <div className="ministry-image">
                      <img src={ministry.image} alt={ministry.title} />
                    </div>
                    <div className="ministry-details">
                      <h3>{ministry.title}</h3>
                      <p className="ministry-leader"><strong>Leader:</strong> {ministry.leader}</p>
                      <p className="ministry-time"><strong>Meeting Time:</strong> {ministry.meetingTime}</p>
                      <p className="ministry-description">{ministry.description}</p>
                      <Link to={`/ministries/${ministry._id}`} className="btn btn-sm">Learn More</Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>No ministries found in this category.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Get Involved</h2>
            <div className="divider" />
          </div>
          <div className="get-involved-content">
            <div className="get-involved-text">
              <p>We believe that every member of the body of Christ has been gifted by God to serve others and build up the church. Whether you're interested in working with children, leading worship, serving the community, or using your administrative skills, there's a place for you to serve at Shekinah Presbyterian Church Tanzania.</p>
              <p>Not sure where to start? Take our spiritual gifts assessment to discover how God has uniquely equipped you to serve.</p>
              <div className="get-involved-buttons">
                <Link to="/spiritual-gifts" className="btn btn-primary">Take Spiritual Gifts Assessment</Link>
                <Link to="/volunteer" className="btn btn-secondary">Volunteer Application</Link>
              </div>
            </div>
            <div className="get-involved-steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Discover Your Gifts</h3>
                <p>Take our spiritual gifts assessment to identify your God-given abilities and passions.</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Explore Opportunities</h3>
                <p>Learn about our various ministries and find where your gifts can be best utilized.</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Connect with Leaders</h3>
                <p>Meet with ministry leaders to discuss how you can get involved and make a difference.</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h3>Serve with Purpose</h3>
                <p>Begin serving in a ministry that aligns with your gifts, passions, and availability.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Ministry Sections */}

      {/* Discipleship Ministry */}
      <section id="discipleship" className="section">
        <div className="container">
          <div className="ministry-content reverse">
            <div className="ministry-image">
              <img src="/images/SPCT/CHURCH.jpg" alt="Discipleship Ministry" />
            </div>
            <div className="ministry-details">
              <h2>Church Planting & Gospel Expansion</h2>
              <div className="divider" />
              <p>We are actively planting Christ-centered, Word-driven churches in unreached and under-served communities—especially in districts and wards across Tanzania. We believe the local church is God's strategy for transforming society.</p>
              <h3>Focus Areas:</h3>
              <ul className="ministry-list">
                <li><FontAwesomeIcon icon="church" /> Church Planting</li>
                <li><FontAwesomeIcon icon="map-marker-alt" /> Unreached Communities</li>
                <li><FontAwesomeIcon icon="book-open" /> Bible Translation</li>
                <li><FontAwesomeIcon icon="hands-helping" /> Community Development</li>
              </ul>
              <Link to="/ministries/discipleship" className="btn btn-primary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Children's Ministry */}
      <section id="children" className="section bg-light">
        <div className="container">
          <div className="ministry-content">
            <div className="ministry-image">
              <img src="/images/SPCT/CHURCH.jpg" alt="Children's Ministry" />
            </div>
            <div className="ministry-details">
              <h2>Leadership Development</h2>
              <div className="divider" />
              <p>We mentor and train emerging leaders — both lay and vocational — to serve faithfully in ministry, missions, and the marketplace, grounded in sound doctrine and godly character.</p>
              <h3>Training Areas:</h3>
              <ul className="ministry-list">
                <li><FontAwesomeIcon icon="user-tie" /> Pastoral Training</li>
                <li><FontAwesomeIcon icon="chalkboard-teacher" /> Teaching & Preaching</li>
                <li><FontAwesomeIcon icon="briefcase" /> Marketplace Leadership</li>
                <li><FontAwesomeIcon icon="graduation-cap" /> Theological Education</li>
              </ul>
              <Link to="/ministries/leadership" className="btn btn-primary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Youth Ministry */}
      <section id="youth" className="section">
        <div className="container">
          <div className="ministry-content reverse">
            <div className="ministry-image">
              <img src="/images/SPCT/CHURCH.jpg" alt="Youth Ministry" />
            </div>
            <div className="ministry-details">
              <h2>Youth & Next Generation Ministry</h2>
              <div className="divider" />
              <p>We invest intentionally in young people, helping them discover their identity in Christ, engage with Scripture, and rise as Gospel influencers in their schools, communities, and future callings.</p>
              <h3>Activities:</h3>
              <ul className="ministry-list">
                <li><FontAwesomeIcon icon="bible" /> Youth Discipleship</li>
                <li><FontAwesomeIcon icon="school" /> School Outreach</li>
                <li><FontAwesomeIcon icon="users" /> Youth Fellowship</li>
                <li><FontAwesomeIcon icon="music" /> Worship Training</li>
              </ul>
              <Link to="/ministries/youth" className="btn btn-primary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Outreach Ministry */}
      <section id="outreach" className="section bg-light">
        <div className="container">
          <div className="ministry-content">
            <div className="ministry-image">
              <img src="/images/SPCT/CHURCH.jpg" alt="Outreach Ministry" />
            </div>
            <div className="ministry-details">
              <h2>Community Impact & Mercy Ministry</h2>
              <div className="divider" />
              <p>We serve the practical needs of the vulnerable through acts of compassion, health outreach, education, and empowerment initiatives—motivated by the love of Christ.</p>
              <h3>Outreach Programs:</h3>
              <ul className="ministry-list">
                <li><FontAwesomeIcon icon="utensils" /> Food Distribution</li>
                <li><FontAwesomeIcon icon="heartbeat" /> Health Outreach</li>
                <li><FontAwesomeIcon icon="graduation-cap" /> Education Support</li>
                <li><FontAwesomeIcon icon="hands-helping" /> Community Development</li>
              </ul>
              <Link to="/ministries/outreach" className="btn btn-primary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Missions Ministry */}
      <section id="missions" className="section">
        <div className="container">
          <div className="ministry-content reverse">
            <div className="ministry-image">
              <img src="/images/SPCT/CHURCH.jpg" alt="Missions Ministry" />
            </div>
            <div className="ministry-details">
              <h2>Missions & Evangelism</h2>
              <div className="divider" />
              <p>We go beyond our walls, engaging in local and cross-cultural missions, house-to-house evangelism, school outreach, and regional Gospel campaigns.</p>
              <h3>Mission Focus:</h3>
              <ul className="ministry-list">
                <li><FontAwesomeIcon icon="home" /> House-to-House Evangelism</li>
                <li><FontAwesomeIcon icon="school" /> School Outreach</li>
                <li><FontAwesomeIcon icon="bullhorn" /> Gospel Campaigns</li>
                <li><FontAwesomeIcon icon="globe-africa" /> Cross-Cultural Missions</li>
              </ul>
              <Link to="/ministries/missions" className="btn btn-primary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Prayer Ministry */}
      <section id="prayer" className="section bg-light">
        <div className="container">
          <div className="ministry-content">
            <div className="ministry-image">
              <img src="/images/SPCT/CHURCH.jpg" alt="Prayer Ministry" />
            </div>
            <div className="ministry-details">
              <h2>Prayer Ministry</h2>
              <div className="divider" />
              <p>Prayer fuels everything we do. We stand together in intercession as we plant churches, train leaders, and reach new communities. You can receive regular prayer updates and join our prayer network.</p>
              <h3>Prayer Opportunities:</h3>
              <ul className="ministry-list">
                <li><FontAwesomeIcon icon="users" /> Corporate Prayer Meetings</li>
                <li><FontAwesomeIcon icon="network-wired" /> Prayer Network</li>
                <li><FontAwesomeIcon icon="hands" /> Prayer Team</li>
                <li><FontAwesomeIcon icon="envelope" /> Prayer Updates</li>
              </ul>
              <Link to="/ministries/prayer" className="btn btn-primary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Ministry Testimonials</h2>
            <div className="divider" />
          </div>
          <div className="testimonials-slider">
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"Serving in the children's ministry has been such a blessing. Seeing the children grow in their understanding of God's love brings me so much joy. I've also grown in my own faith as I prepare lessons and share God's Word with these little ones."</p>
              </div>
              <div className="testimonial-author">
                <img src="/images/SPCT/CHURCH.jpg" alt="Testimonial Author" />
                <div>
                  <h4>Mary Johnson</h4>
                  <p>Children's Ministry Volunteer</p>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"Being part of the worship team has deepened my relationship with God. Leading others in worship is not just about music—it's about creating an atmosphere where people can encounter God's presence. I'm grateful for the opportunity to use my musical gifts to glorify Him."</p>
              </div>
              <div className="testimonial-author">
                <img src="/images/SPCT/CHURCH.jpg" alt="Testimonial Author" />
                <div>
                  <h4>David Wilson</h4>
                  <p>Worship Team Member</p>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"The outreach ministry has opened my eyes to the needs in our community. It's one thing to talk about loving your neighbor, but it's another to actually go out and serve them. Through this ministry, I've seen how practical acts of service can open doors for sharing the Gospel."</p>
              </div>
              <div className="testimonial-author">
                <img src="/images/SPCT/CHURCH.jpg" alt="Testimonial Author" />
                <div>
                  <h4>Sarah Thompson</h4>
                  <p>Outreach Volunteer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Make a Difference?</h2>
          <p>Join one of our ministry teams and use your gifts to serve God and others</p>
          <Link to="/contact" className="btn btn-primary">Contact Us to Get Started</Link>
        </div>
      </section>
    </main>
  );
};

export default Ministries;
