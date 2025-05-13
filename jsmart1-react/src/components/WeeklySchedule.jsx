import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import DynamicContent from './DynamicContent';
import '../styles/WeeklySchedule.css';

const WeeklySchedule = () => {
  // Default schedule data
  const defaultSchedule = [
    { day: 'Sunday', name: 'Worship Service', time: '9:00 AM - 12:00 PM', location: 'Main Sanctuary' },
    { day: 'Sunday', name: 'Sunday School', time: '2:00 PM - 3:30 PM', location: 'Education Building' },
    { day: 'Wednesday', name: 'Bible Study', time: '6:00 PM - 8:00 PM', location: 'Fellowship Hall' },
    { day: 'Friday', name: 'Youth Fellowship', time: '4:00 PM - 6:00 PM', location: 'Youth Center' },
    { day: 'Friday', name: 'Choir Practice', time: '6:30 PM - 8:30 PM', location: 'Main Sanctuary' },
    { day: 'Saturday', name: 'Prayer Meeting', time: '7:00 AM - 8:00 AM', location: 'Prayer Room' },
    { day: 'Saturday', name: 'Community Outreach', time: '10:00 AM - 1:00 PM', location: 'Various Locations' },
    { day: 'Monday', name: 'Men\'s Fellowship', time: '7:00 PM - 8:30 PM', location: 'Fellowship Hall' }
  ];

  return (
    <div className="weekly-schedule">
      <DynamicContent
        section="weekly_schedule"
        fallback={
          <div className="schedule-container">
            <h3>Weekly Schedule</h3>
            <div className="schedule-grid-wrapper">
              {defaultSchedule.map((event, index) => (
                <div className="schedule-item-card" key={index}>
                  <div className="schedule-item-day">{event.day}</div>
                  <div className="schedule-item-name">{event.name}</div>
                  <div className="schedule-item-details">
                    <p><FontAwesomeIcon icon={faClock} /> {event.time}</p>
                    <p><FontAwesomeIcon icon={faMapMarkerAlt} /> {event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      />
    </div>
  );
};

export default WeeklySchedule;
