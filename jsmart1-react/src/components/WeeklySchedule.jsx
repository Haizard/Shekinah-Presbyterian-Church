import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import DynamicContent from './DynamicContent';
import '../styles/WeeklySchedule.css';

const WeeklySchedule = () => {
  return (
    <div className="weekly-schedule">
      <DynamicContent
        section="weekly_schedule"
        fallback={
          <div className="schedule-container">
            <h3>Weekly Schedule</h3>
            <div className="schedule-grid">
              <div className="schedule-item">
                <div className="day">Sunday</div>
                <div className="events">
                  <div className="event">
                    <div className="event-name">Worship Service</div>
                    <div className="event-details">
                      <p><FontAwesomeIcon icon={faClock} /> 9:00 AM - 12:00 PM</p>
                      <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Main Sanctuary</p>
                    </div>
                  </div>
                  <div className="event">
                    <div className="event-name">Sunday School</div>
                    <div className="event-details">
                      <p><FontAwesomeIcon icon={faClock} /> 2:00 PM - 3:30 PM</p>
                      <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Education Building</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="schedule-item">
                <div className="day">Wednesday</div>
                <div className="events">
                  <div className="event">
                    <div className="event-name">Bible Study</div>
                    <div className="event-details">
                      <p><FontAwesomeIcon icon={faClock} /> 6:00 PM - 8:00 PM</p>
                      <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Fellowship Hall</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="schedule-item">
                <div className="day">Friday</div>
                <div className="events">
                  <div className="event">
                    <div className="event-name">Youth Fellowship</div>
                    <div className="event-details">
                      <p><FontAwesomeIcon icon={faClock} /> 4:00 PM - 6:00 PM</p>
                      <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Youth Center</p>
                    </div>
                  </div>
                  <div className="event">
                    <div className="event-name">Choir Practice</div>
                    <div className="event-details">
                      <p><FontAwesomeIcon icon={faClock} /> 6:30 PM - 8:30 PM</p>
                      <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Main Sanctuary</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        renderContent={(content) => (
          <div className="schedule-container">
            <h3>{content.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          </div>
        )}
      />
    </div>
  );
};

export default WeeklySchedule;
