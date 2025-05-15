import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt, faCalendarAlt, faChevronLeft, faChevronRight, faTimes, faExpand } from '@fortawesome/free-solid-svg-icons';
import '../../styles/CompactEventCalendar.css';

/**
 * Component for rendering a compact version of the event calendar
 * with an option to view the full calendar in a popup
 */
const CompactEventCalendarRenderer = ({ content, image }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Parse content if it's a string
  let calendarData;
  try {
    // Check if content is a string that looks like JSON
    if (typeof content === 'string' &&
        ((content.trim().startsWith('{') && content.trim().endsWith('}')) ||
         (content.trim().startsWith('[') && content.trim().endsWith(']')))) {
      calendarData = JSON.parse(content);
    } else if (typeof content === 'string') {
      // If it's a string but not JSON, create a simple calendar with one event
      calendarData = {
        introduction: 'Upcoming church events',
        events: [
          {
            title: 'Church Event',
            date: new Date().toISOString().split('T')[0], // Today's date
            startTime: '9:00 AM',
            endTime: '12:00 PM',
            location: 'Main Sanctuary',
            description: content // Use the content string as the description
          }
        ]
      };
    } else {
      // If it's already an object, use it directly
      calendarData = content;
    }

    // Validate the structure of calendarData
    if (!calendarData || typeof calendarData !== 'object') {
      console.error('Invalid calendar data structure:', calendarData);
      return null;
    }
  } catch (error) {
    console.error('Error parsing event calendar data:', error);
    // Return null to show nothing if parsing fails
    return null;
  }

  // If we have valid calendar data with events array, process it
  if (calendarData?.events && Array.isArray(calendarData.events) && calendarData.events.length > 0) {
    // Process events to add Date objects
    const processedEvents = calendarData.events.map(event => {
      let eventDate;
      try {
        eventDate = new Date(event.date);
        // Check if date is valid
        if (Number.isNaN(eventDate.getTime())) {
          eventDate = null;
        }
      } catch (e) {
        eventDate = null;
      }

      return {
        ...event,
        dateObj: eventDate
      };
    }).filter(event => event.dateObj !== null); // Filter out events with invalid dates

    // If no valid events after processing, return null
    if (processedEvents.length === 0) {
      return null;
    }

    // Get events for the current month
    const eventsForCurrentMonth = processedEvents.filter(event => {
      return event.dateObj.getMonth() === currentMonth &&
             event.dateObj.getFullYear() === currentYear;
    });

    // Navigate to previous month
    const goToPreviousMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };

    // Navigate to next month
    const goToNextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };

    // Get month name
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Generate calendar grid
    const generateCalendarGrid = () => {
      // Get first day of the month
      const firstDay = new Date(currentYear, currentMonth, 1);
      // Get last day of the month
      const lastDay = new Date(currentYear, currentMonth + 1, 0);

      // Get day of week for first day (0 = Sunday, 6 = Saturday)
      const firstDayOfWeek = firstDay.getDay();
      // Get total days in month
      const daysInMonth = lastDay.getDate();

      // Create array for calendar days
      const calendarDays = [];

      // Add empty cells for days before first day of month
      for (let i = 0; i < firstDayOfWeek; i++) {
        calendarDays.push(null);
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
      }

      return calendarDays;
    };

    // Get events for a specific day
    const getEventsForDay = (day) => {
      if (!day) return [];

      return eventsForCurrentMonth.filter(event => {
        return event.dateObj.getDate() === day;
      });
    };

    // Handle event click
    const handleEventClick = (event) => {
      setSelectedEvent(event);
    };

    // Close event details
    const closeEventDetails = () => {
      setSelectedEvent(null);
    };

    // Toggle full calendar popup
    const togglePopup = () => {
      setShowPopup(!showPopup);
    };

    // Render compact calendar
    return (
      <div className="compact-event-calendar">
        {calendarData.introduction && (
          <div className="calendar-intro">
            <p>{calendarData.introduction}</p>
          </div>
        )}

        <div className="compact-calendar-header">
          <button
            type="button"
            className="calendar-nav-btn"
            onClick={goToPreviousMonth}
            aria-label="Previous Month"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <h3 className="calendar-title">
            {monthNames[currentMonth]} {currentYear}
          </h3>

          <button
            type="button"
            className="calendar-nav-btn"
            onClick={goToNextMonth}
            aria-label="Next Month"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          
          <button
            type="button"
            className="calendar-expand-btn"
            onClick={togglePopup}
            aria-label="Expand Calendar"
          >
            <FontAwesomeIcon icon={faExpand} />
          </button>
        </div>

        {/* Compact Calendar View */}
        <div className="compact-calendar-grid">
          {/* Day headers */}
          <div className="calendar-day-header">S</div>
          <div className="calendar-day-header">M</div>
          <div className="calendar-day-header">T</div>
          <div className="calendar-day-header">W</div>
          <div className="calendar-day-header">T</div>
          <div className="calendar-day-header">F</div>
          <div className="calendar-day-header">S</div>

          {/* Calendar days */}
          {generateCalendarGrid().map((day, index) => {
            const eventsForDay = day ? getEventsForDay(day) : [];
            const hasEvents = eventsForDay.length > 0;

            return (
              <div
                key={`day-${day || `empty-${index}`}`}
                className={`compact-calendar-day ${!day ? 'empty-day' : ''} ${hasEvents ? 'has-events' : ''}`}
                onClick={() => hasEvents && handleEventClick(eventsForDay[0])}
              >
                {day && (
                  <>
                    <div className="day-number">{day}</div>
                    {hasEvents && <div className="event-indicator"></div>}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Upcoming Events List */}
        <div className="upcoming-events">
          <h4>Upcoming Events</h4>
          <div className="event-list">
            {eventsForCurrentMonth.slice(0, 3).map((event, index) => (
              <div 
                key={`list-event-${index}`} 
                className="event-list-item"
                onClick={() => handleEventClick(event)}
              >
                <div className="event-date-badge">
                  <span className="event-month">{event.dateObj.toLocaleString('default', { month: 'short' })}</span>
                  <span className="event-day">{event.dateObj.getDate()}</span>
                </div>
                <div className="event-list-details">
                  <h5>{event.title}</h5>
                  {event.location && (
                    <p className="event-location">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      {event.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {eventsForCurrentMonth.length > 3 && (
              <button className="view-all-btn" onClick={togglePopup}>
                View All Events
              </button>
            )}
          </div>
        </div>

        {/* Event Details Popup */}
        {selectedEvent && (
          <div className="event-details-popup">
            <div className="popup-content">
              <button className="close-btn" onClick={closeEventDetails}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h3>{selectedEvent.title}</h3>
              <div className="event-details-meta">
                <p>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  {selectedEvent.dateObj.toLocaleDateString()}
                </p>
                {selectedEvent.startTime && (
                  <p>
                    <FontAwesomeIcon icon={faClock} />
                    {selectedEvent.startTime}
                    {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                  </p>
                )}
                {selectedEvent.location && (
                  <p>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    {selectedEvent.location}
                  </p>
                )}
              </div>
              {selectedEvent.description && (
                <div className="event-description">
                  <p>{selectedEvent.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Calendar Popup */}
        {showPopup && (
          <div className="full-calendar-popup">
            <div className="popup-content">
              <div className="popup-header">
                <h3>Event Calendar</h3>
                <button className="close-btn" onClick={togglePopup}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              
              <div className="popup-calendar">
                {/* Full calendar content here - similar to original EventCalendarRenderer */}
                {/* This is a simplified version for brevity */}
                <div className="calendar-header">
                  <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={goToPreviousMonth}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>

                  <h3 className="calendar-title">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>

                  <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={goToNextMonth}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>

                <div className="full-calendar-grid">
                  {/* Day headers */}
                  <div className="calendar-day-header">Sun</div>
                  <div className="calendar-day-header">Mon</div>
                  <div className="calendar-day-header">Tue</div>
                  <div className="calendar-day-header">Wed</div>
                  <div className="calendar-day-header">Thu</div>
                  <div className="calendar-day-header">Fri</div>
                  <div className="calendar-day-header">Sat</div>

                  {/* Calendar days with events */}
                  {generateCalendarGrid().map((day, index) => {
                    const eventsForDay = day ? getEventsForDay(day) : [];
                    const hasEvents = eventsForDay.length > 0;

                    return (
                      <div
                        key={`popup-day-${day || `empty-${index}`}`}
                        className={`calendar-day ${!day ? 'empty-day' : ''} ${hasEvents ? 'has-events' : ''}`}
                      >
                        {day && (
                          <>
                            <div className="day-number">{day}</div>

                            {hasEvents && (
                              <div className="day-events">
                                {eventsForDay.map((event, eventIndex) => (
                                  <div 
                                    key={`popup-event-${day}-${eventIndex}`} 
                                    className="day-event"
                                    onClick={() => handleEventClick(event)}
                                  >
                                    <div className="event-title">{event.title}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* List of all events for the month */}
                {eventsForCurrentMonth.length > 0 && (
                  <div className="month-events-list">
                    <h4>Events This Month</h4>
                    {eventsForCurrentMonth.map((event, index) => (
                      <div 
                        key={`month-event-${index}`} 
                        className="month-event"
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="event-date">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                          {event.dateObj.toLocaleDateString()}
                        </div>
                        <div className="event-details">
                          <h5>{event.title}</h5>
                          <div className="event-meta">
                            {event.startTime && (
                              <p>
                                <FontAwesomeIcon icon={faClock} />
                                {event.startTime}
                                {event.endTime && ` - ${event.endTime}`}
                              </p>
                            )}
                            {event.location && (
                              <p>
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                                {event.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Return null if no valid data
  return null;
};

export default CompactEventCalendarRenderer;
