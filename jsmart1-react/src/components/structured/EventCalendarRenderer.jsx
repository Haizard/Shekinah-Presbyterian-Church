import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt, faCalendarAlt, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

/**
 * Component for rendering the "event_calendar" structured content
 * Follows the same pattern as LeadershipRenderer
 */
const EventCalendarRenderer = ({ content }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Parse content if it's a string
  let calendarData;
  try {
    calendarData = typeof content === 'string' ? JSON.parse(content) : content;
  } catch (error) {
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
        if (isNaN(eventDate.getTime())) {
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
    
    // Render calendar
    return (
      <div className="event-calendar">
        {calendarData.introduction && (
          <div className="calendar-intro">
            <p>{calendarData.introduction}</p>
          </div>
        )}
        
        <div className="calendar-header">
          <button 
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
            className="calendar-nav-btn" 
            onClick={goToNextMonth}
            aria-label="Next Month"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
        
        <div className="calendar-grid">
          {/* Day headers */}
          <div className="calendar-day-header">Sun</div>
          <div className="calendar-day-header">Mon</div>
          <div className="calendar-day-header">Tue</div>
          <div className="calendar-day-header">Wed</div>
          <div className="calendar-day-header">Thu</div>
          <div className="calendar-day-header">Fri</div>
          <div className="calendar-day-header">Sat</div>
          
          {/* Calendar days */}
          {generateCalendarGrid().map((day, index) => {
            const eventsForDay = day ? getEventsForDay(day) : [];
            const hasEvents = eventsForDay.length > 0;
            
            return (
              <div 
                key={`day-${index}`} 
                className={`calendar-day ${!day ? 'empty-day' : ''} ${hasEvents ? 'has-events' : ''}`}
              >
                {day && (
                  <>
                    <div className="day-number">{day}</div>
                    
                    {hasEvents && (
                      <div className="day-events">
                        {eventsForDay.map((event, eventIndex) => (
                          <div key={`event-${day}-${eventIndex}`} className="day-event">
                            <div className="event-title">{event.title}</div>
                            
                            {event.startTime && (
                              <div className="event-time">
                                <FontAwesomeIcon icon={faClock} />
                                {event.startTime}
                                {event.endTime && ` - ${event.endTime}`}
                              </div>
                            )}
                            
                            {event.location && (
                              <div className="event-location">
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                                {event.location}
                              </div>
                            )}
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
        
        {/* List of events for the month */}
        {eventsForCurrentMonth.length > 0 && (
          <div className="month-events-list">
            <h4>Events This Month</h4>
            
            {eventsForCurrentMonth.sort((a, b) => a.dateObj - b.dateObj).map((event, index) => (
              <div key={`month-event-${index}`} className="month-event">
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
                  
                  {event.description && (
                    <p className="event-description">{event.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Return null if no valid data
  return null;
};

export default EventCalendarRenderer;
