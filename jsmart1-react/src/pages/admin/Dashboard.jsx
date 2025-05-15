import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
// Import our modern design system
import '../../styles/main.css';

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
      <div className="dashboard animate-fade-in">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="date-filter">
            <span>Today: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card animate-slide-bottom" style={{animationDelay: '0.1s'}}>
            <div className="stat-icon primary">
              <FontAwesomeIcon icon="church" />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.ministries}</h3>
              <p className="stat-label">Ministries</p>
              <div className="stat-trend trend-up">
                <FontAwesomeIcon icon="arrow-up" /> Active
              </div>
            </div>
          </div>

          <div className="stat-card animate-slide-bottom" style={{animationDelay: '0.2s'}}>
            <div className="stat-icon info">
              <FontAwesomeIcon icon="bible" />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.sermons}</h3>
              <p className="stat-label">Sermons</p>
              <div className="stat-trend trend-up">
                <FontAwesomeIcon icon="arrow-up" /> Growing
              </div>
            </div>
          </div>

          <div className="stat-card animate-slide-bottom" style={{animationDelay: '0.3s'}}>
            <div className="stat-icon warning">
              <FontAwesomeIcon icon="calendar-alt" />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.events}</h3>
              <p className="stat-label">Events</p>
              <div className="stat-trend trend-up">
                <FontAwesomeIcon icon="arrow-up" /> Upcoming
              </div>
            </div>
          </div>

          <div className="stat-card animate-slide-bottom" style={{animationDelay: '0.4s'}}>
            <div className="stat-icon success">
              <FontAwesomeIcon icon="images" />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.gallery}</h3>
              <p className="stat-label">Gallery Items</p>
              <div className="stat-trend trend-up">
                <FontAwesomeIcon icon="arrow-up" /> Growing
              </div>
            </div>
          </div>

          <div className="stat-card animate-slide-bottom" style={{animationDelay: '0.5s'}}>
            <div className="stat-icon primary">
              <FontAwesomeIcon icon="envelope" />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.contacts}</h3>
              <p className="stat-label">Contact Messages</p>
              <div className="stat-trend trend-up">
                <FontAwesomeIcon icon="arrow-up" /> New
              </div>
            </div>
          </div>

          <div className="stat-card animate-slide-bottom" style={{animationDelay: '0.6s'}}>
            <div className="stat-icon info">
              <FontAwesomeIcon icon="file-alt" />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.content}</h3>
              <p className="stat-label">Content Items</p>
              <div className="stat-trend trend-up">
                <FontAwesomeIcon icon="arrow-up" /> Updated
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card shadow-md animate-slide-bottom" style={{animationDelay: '0.7s'}}>
          <div className="card-header">
            <h2 className="card-title">Quick Actions</h2>
          </div>
          <div className="card-body">
            <div className="finance-menu-row">
              <Link to="/admin/ministries/new" className="finance-menu-item hover-lift">
                <FontAwesomeIcon icon="plus-circle" />
                <span>Add Ministry</span>
              </Link>
              <Link to="/admin/sermons/new" className="finance-menu-item hover-lift">
                <FontAwesomeIcon icon="plus-circle" />
                <span>Add Sermon</span>
              </Link>
              <Link to="/admin/events/new" className="finance-menu-item hover-lift">
                <FontAwesomeIcon icon="plus-circle" />
                <span>Add Event</span>
              </Link>
              <Link to="/admin/gallery/new" className="finance-menu-item hover-lift">
                <FontAwesomeIcon icon="plus-circle" />
                <span>Add Gallery</span>
              </Link>
              <Link to="/admin/content" className="finance-menu-item hover-lift">
                <FontAwesomeIcon icon="file-alt" />
                <span>Manage Content</span>
              </Link>
              <Link to="/admin/image-debugger" className="finance-menu-item hover-lift">
                <FontAwesomeIcon icon="tools" />
                <span>Image Debugger</span>
              </Link>
              <Link to="/admin/image-verifier" className="finance-menu-item hover-lift">
                <FontAwesomeIcon icon="images" />
                <span>Image Verifier</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="card shadow-md animate-slide-bottom" style={{animationDelay: '0.8s'}}>
            <div className="card-header">
              <h2 className="card-title">Recent Contact Messages</h2>
              <Link to="/admin/contact" className="btn btn-sm btn-outline">View All</Link>
            </div>

            <div className="card-body">
              {recentContacts.length > 0 ? (
                <div className="table-container">
                  <table className="table table-striped">
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
                          <td className="cell-highlight">{contact.name}</td>
                          <td>{contact.email}</td>
                          <td>{contact.subject}</td>
                          <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge badge-${contact.status === 'new' ? 'primary' : contact.status === 'read' ? 'success' : 'warning'}`}>
                              {contact.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <FontAwesomeIcon icon="envelope" className="empty-state-icon" />
                  <p className="empty-state-title">No recent contact messages</p>
                </div>
              )}
            </div>
          </div>

          <div className="card shadow-md animate-slide-bottom" style={{animationDelay: '0.9s'}}>
            <div className="card-header">
              <h2 className="card-title">Upcoming Events</h2>
              <Link to="/admin/events" className="btn btn-sm btn-outline">View All</Link>
            </div>

            <div className="card-body">
              {upcomingEvents.length > 0 ? (
                <div className="table-container">
                  <table className="table table-striped">
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
                          <td className="cell-highlight">{event.title}</td>
                          <td>{event.date}</td>
                          <td>{event.time}</td>
                          <td>{event.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <FontAwesomeIcon icon="calendar-alt" className="empty-state-icon" />
                  <p className="empty-state-title">No upcoming events</p>
                </div>
              )}
            </div>
          </div>

          <div className="card shadow-md animate-slide-bottom lg:col-span-2" style={{animationDelay: '1s'}}>
            <div className="card-header">
              <h2 className="card-title">Recent Content Updates</h2>
              <Link to="/admin/content" className="btn btn-sm btn-outline">View All</Link>
            </div>

            <div className="card-body">
              {recentContent.length > 0 ? (
                <div className="table-container">
                  <table className="table table-striped">
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
                          <td className="cell-highlight">{content.title}</td>
                          <td><span className="badge badge-primary">{content.section}</span></td>
                          <td>{new Date(content.updatedAt || content.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="table-actions">
                              <Link to={`/admin/content?edit=${content._id}`} className="action-btn action-btn-edit">
                                <FontAwesomeIcon icon="edit" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <FontAwesomeIcon icon="file-alt" className="empty-state-icon" />
                  <p className="empty-state-title">No content updates</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
