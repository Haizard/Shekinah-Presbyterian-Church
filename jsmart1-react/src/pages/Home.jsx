import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock, 
  faMapMarkerAlt, 
  faBookOpen, 
  faCross, 
  faDove,
  faPlay,
  faHeadphones,
  faDownload,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Home.css';

const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h2>Welcome to Shekinah Presbyterian Church Tanzania</h2>
          <p>"The True Word, The True Gospel, and True Freedom"</p>
          <div className="hero-buttons">
            <a href="#about" className="btn btn-primary">Learn More</a>
            <Link to="/contact" className="btn btn-secondary">Plan Your Visit</Link>
          </div>
          <div className="service-times">
            <p><FontAwesomeIcon icon={faClock} /> Sunday Service: 9:00 AM</p>
            <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Dar es Salaam, Tanzania</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <div className="section-header">
            <h2>About Us</h2>
            <div className="divider"></div>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p><strong>Shekinah Presbyterian Church Tanzania</strong> is a Christ-centered community committed to proclaiming the Kingdom of God across Tanzania and beyond. We exist to raise up mature disciples of Jesus, build Gospel-driven communities, and extend the love and truth of Christ to every sphere of life.</p>
              <p>We are not just building churches—we are cultivating a missional culture where every believer is equipped to live for Christ, serve others, and make disciples who make disciples.</p>
            </div>
            <div className="about-image">
              <img src="/images/SPCT/CHURCH.jpg" alt="Shekinah Church Building" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Our Vision</h2>
            <div className="divider"></div>
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
            <div className="divider"></div>
          </div>
          <div className="mission-content">
            <div className="mission-text">
              <p>We exist to:</p>
              <ul className="mission-list">
                <li>
                  <FontAwesomeIcon icon={faBookOpen} />
                  <div>
                    <h3>Proclaim the true Word of God</h3>
                    <p>Teaching the uncompromised Word of God with clarity and conviction</p>
                  </div>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCross} />
                  <div>
                    <h3>Spread the true Gospel of Jesus Christ</h3>
                    <p>Proclaiming the Good News through disciple-making and church planting</p>
                  </div>
                </li>
                <li>
                  <FontAwesomeIcon icon={faDove} />
                  <div>
                    <h3>Lead people into true freedom</h3>
                    <p>Helping people experience the real freedom found in Christ alone</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="mission-image">
              <img src="/images/SPCT/CHURCH.jpg" alt="Church Mission" />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Upcoming Events</h2>
            <div className="divider"></div>
          </div>
          <div className="events-grid">
            <div className="event-card">
              <div className="event-date">
                <span className="day">12</span>
                <span className="month">JUN</span>
              </div>
              <div className="event-details">
                <h3>Sunday Worship Service</h3>
                <p><FontAwesomeIcon icon={faClock} /> 9:00 AM - 12:00 PM</p>
                <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Main Sanctuary</p>
                <Link to="/events" className="btn btn-sm">Learn More</Link>
              </div>
            </div>
            <div className="event-card">
              <div className="event-date">
                <span className="day">15</span>
                <span className="month">JUN</span>
              </div>
              <div className="event-details">
                <h3>Bible Study</h3>
                <p><FontAwesomeIcon icon={faClock} /> 6:00 PM - 8:00 PM</p>
                <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Fellowship Hall</p>
                <Link to="/events" className="btn btn-sm">Learn More</Link>
              </div>
            </div>
            <div className="event-card">
              <div className="event-date">
                <span className="day">20</span>
                <span className="month">JUN</span>
              </div>
              <div className="event-details">
                <h3>Youth Fellowship</h3>
                <p><FontAwesomeIcon icon={faClock} /> 4:00 PM - 6:00 PM</p>
                <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Youth Center</p>
                <Link to="/events" className="btn btn-sm">Learn More</Link>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <Link to="/events" className="btn btn-primary">View All Events</Link>
          </div>
        </div>
      </section>

      {/* Sermons Section */}
      <section id="sermons" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Latest Sermons</h2>
            <div className="divider"></div>
          </div>
          <div className="sermons-grid">
            <div className="sermon-card">
              <div className="sermon-thumbnail">
                <img src="/images/SPCT/CHURCH.jpg" alt="Sermon Thumbnail" />
                <div className="play-button">
                  <FontAwesomeIcon icon={faPlay} />
                </div>
              </div>
              <div className="sermon-details">
                <h3>Walking in Faith</h3>
                <p className="sermon-meta">Pastor John Doe | June 5, 2025</p>
                <p className="sermon-verse">Hebrews 11:1-6</p>
                <div className="sermon-links">
                  <a href="#"><FontAwesomeIcon icon={faHeadphones} /> Listen</a>
                  <a href="#"><FontAwesomeIcon icon={faDownload} /> Download</a>
                  <a href="#"><FontAwesomeIcon icon={faFileAlt} /> Notes</a>
                </div>
              </div>
            </div>
            <div className="sermon-card">
              <div className="sermon-thumbnail">
                <img src="/images/SPCT/CHURCH.jpg" alt="Sermon Thumbnail" />
                <div className="play-button">
                  <FontAwesomeIcon icon={faPlay} />
                </div>
              </div>
              <div className="sermon-details">
                <h3>The Power of Prayer</h3>
                <p className="sermon-meta">Pastor John Doe | May 29, 2025</p>
                <p className="sermon-verse">James 5:13-18</p>
                <div className="sermon-links">
                  <a href="#"><FontAwesomeIcon icon={faHeadphones} /> Listen</a>
                  <a href="#"><FontAwesomeIcon icon={faDownload} /> Download</a>
                  <a href="#"><FontAwesomeIcon icon={faFileAlt} /> Notes</a>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <Link to="/sermons" className="btn btn-primary">View All Sermons</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
