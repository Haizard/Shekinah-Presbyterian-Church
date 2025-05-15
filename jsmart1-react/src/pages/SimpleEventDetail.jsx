import React from 'react';
import { Link } from 'react-router-dom';

const SimpleEventDetail = () => {
  // Mock event data
  const event = {
    title: "Annual Church Conference",
    date: "June 25, 2023",
    time: "9:00 AM - 4:00 PM",
    location: "Main Sanctuary",
    description: "Join us for our annual church conference as we explore what it means to be rooted in Christ. This full-day event will feature inspiring speakers, powerful worship, and practical workshops to help you grow in your faith.",
    category: "Conference"
  };

  return (
    <div style={{ padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/events" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          color: '#333', 
          textDecoration: 'none', 
          fontWeight: '500' 
        }}>
          ← Back to Events
        </Link>
      </div>

      <div style={{ 
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '30px',
          backgroundColor: '#3B82F6',
          color: 'white'
        }}>
          <h1 style={{ margin: '0 0 15px 0', fontSize: '2.2rem' }}>{event.title}</h1>
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            fontSize: '1rem'
          }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              📅 {event.date}
            </span>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              🕒 {event.time}
            </span>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              📍 {event.location}
            </span>
          </div>
        </div>

        <div style={{ padding: '30px' }}>
          <div style={{ marginBottom: '30px', lineHeight: '1.6', fontSize: '1.1rem' }}>
            <p>{event.description}</p>
          </div>

          {event.category && (
            <div style={{ 
              marginBottom: '30px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '5px'
            }}>
              <span style={{ fontWeight: '600', marginRight: '10px' }}>Category:</span>
              <span>{event.category}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            <Link to="/contact" style={{ 
              display: 'inline-block', 
              padding: '10px 20px', 
              backgroundColor: '#3B82F6', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '5px' 
            }}>
              Register Now
            </Link>
            <Link to="/contact" style={{ 
              display: 'inline-block', 
              padding: '10px 20px', 
              backgroundColor: 'transparent', 
              color: '#3B82F6', 
              textDecoration: 'none', 
              borderRadius: '5px',
              border: '1px solid #3B82F6'
            }}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleEventDetail;
