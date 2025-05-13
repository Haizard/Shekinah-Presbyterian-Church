import React from 'react';
import DynamicContent from './DynamicContent';
import '../styles/Leadership.css';

const Leadership = () => {
  // Default leadership content for fallback
  const defaultLeadershipContent = {
    title: 'Our Leadership',
    content: JSON.stringify({
      introduction: 'Meet the dedicated leaders who guide our church.',
      leaders: [
        {
          name: 'Pastor John Doe',
          position: 'Senior Pastor',
          bio: 'Pastor John has been serving our church for over 10 years.',
          image: '/images/SPCT/CHURCH.jpg'
        },
        {
          name: 'Elder Jane Smith',
          position: 'Elder',
          bio: 'Elder Jane oversees our children\'s ministry.',
          image: '/images/SPCT/CHURCH.jpg'
        }
      ]
    })
  };

  return (
    <div className="leadership-section">
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
                </div>
              </div>

              <div className="leader-card">
                <div className="leader-image">
                  <img src="/images/SPCT/Mwl. Boyeon Lee (Missionary and one of the founder).jpg" alt="Associate Pastor" />
                </div>
                <div className="leader-details">
                  <h3>Mwl. Boyeon Lee</h3>
                  <p className="leader-title">MWALIMU LEE</p>
                  <p className="leader-bio">Mwl. Boyeon Lee (Missionary and one of the founder).</p>
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
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default Leadership;
