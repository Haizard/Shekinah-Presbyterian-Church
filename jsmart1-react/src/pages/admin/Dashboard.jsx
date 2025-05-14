import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import '../../styles/admin/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    ministries: 0,
    sermons: 0,
    events: 0,
    gallery: 0,
    contacts: 0,
    content: 0,
  });

  const [recentContacts, setRecentContacts] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch counts
        const [ministries, sermons, events, gallery, contacts, content] = await Promise.all([
          api.ministries.getAll(),
          api.sermons.getAll(),
          api.events.getAll(),
          api.gallery.getAll(),
          api.contact.getAll(),
          api.content.getAll(),
        ]);

        setStats({
          ministries: ministries.length,
          sermons: sermons.length,
          events: events.length,
          gallery: gallery.length,
          contacts: contacts.length,
          content: content.length,
        });

        // Set recent contacts (latest 5)
        setRecentContacts(contacts.slice(0, 5));

        // Set upcoming events (next 5)
        setUpcomingEvents(events.slice(0, 5));

        // Set recent content (latest 5)
        setRecentContent(content.slice(0, 5));

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading dashboard data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="error-container">
          <FontAwesomeIcon icon="exclamation-circle" />
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard">
        <h1>Dashboard</h1>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon="church" />
            </div>
            <div className="stat-details">
              <h3>{stats.ministries}</h3>
              <p>Ministries</p>
            </div>
            <Link to="/admin/ministries" className="stat-link">
              <FontAwesomeIcon icon="arrow-right" />
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon="bible" />
            </div>
            <div className="stat-details">
              <h3>{stats.sermons}</h3>
              <p>Sermons</p>
            </div>
            <Link to="/admin/sermons" className="stat-link">
              <FontAwesomeIcon icon="arrow-right" />
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon="calendar-alt" />
            </div>
            <div className="stat-details">
              <h3>{stats.events}</h3>
              <p>Events</p>
            </div>
            <Link to="/admin/events" className="stat-link">
              <FontAwesomeIcon icon="arrow-right" />
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon="images" />
            </div>
            <div className="stat-details">
              <h3>{stats.gallery}</h3>
              <p>Gallery Items</p>
            </div>
            <Link to="/admin/gallery" className="stat-link">
              <FontAwesomeIcon icon="arrow-right" />
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon="envelope" />
            </div>
            <div className="stat-details">
              <h3>{stats.contacts}</h3>
              <p>Contact Messages</p>
            </div>
            <Link to="/admin/contact" className="stat-link">
              <FontAwesomeIcon icon="arrow-right" />
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon="file-alt" />
            </div>
            <div className="stat-details">
              <h3>{stats.content}</h3>
              <p>Content Items</p>
            </div>
            <Link to="/admin/content" className="stat-link">
              <FontAwesomeIcon icon="arrow-right" />
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/admin/ministries/new" className="quick-action">
              <FontAwesomeIcon icon="plus-circle" />
              <span>Add Ministry</span>
            </Link>
            <Link to="/admin/sermons/new" className="quick-action">
              <FontAwesomeIcon icon="plus-circle" />
              <span>Add Sermon</span>
            </Link>
            <Link to="/admin/events/new" className="quick-action">
              <FontAwesomeIcon icon="plus-circle" />
              <span>Add Event</span>
            </Link>
            <Link to="/admin/gallery/new" className="quick-action">
              <FontAwesomeIcon icon="plus-circle" />
              <span>Add Gallery</span>
            </Link>
            <Link to="/admin/content" className="quick-action">
              <FontAwesomeIcon icon="file-alt" />
              <span>Manage Content</span>
            </Link>
            <Link to="/admin/image-debugger" className="quick-action">
              <FontAwesomeIcon icon="tools" />
              <span>Image Debugger</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-sections">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Contact Messages</h2>
              <Link to="/admin/contact" className="view-all">View All</Link>
            </div>

            <div className="section-content">
              {recentContacts.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Subject</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentContacts.map((contact) => (
                      <tr key={contact._id}>
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td>{contact.subject}</td>
                        <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge ${contact.status}`}>
                            {contact.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No recent contact messages</p>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Upcoming Events</h2>
              <Link to="/admin/events" className="view-all">View All</Link>
            </div>

            <div className="section-content">
              {upcomingEvents.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingEvents.map((event) => (
                      <tr key={event._id}>
                        <td>{event.title}</td>
                        <td>{event.date}</td>
                        <td>{event.time}</td>
                        <td>{event.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No upcoming events</p>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Content Updates</h2>
              <Link to="/admin/content" className="view-all">View All</Link>
            </div>

            <div className="section-content">
              {recentContent.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Section</th>
                      <th>Last Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentContent.map((content) => (
                      <tr key={content._id}>
                        <td>{content.title}</td>
                        <td>{content.section}</td>
                        <td>{new Date(content.updatedAt || content.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Link to={`/admin/content?edit=${content._id}`} className="action-link">
                            <FontAwesomeIcon icon="edit" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No content updates</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
