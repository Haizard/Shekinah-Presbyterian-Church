import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DirectSidebar = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{
        width: '300px',
        backgroundColor: '#2c3e50',
        color: '#ecf0f1',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        overflowY: 'auto',
        height: '100vh'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem 1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Admin Panel</h2>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/admin" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: '#ecf0f1',
                textDecoration: 'none'
              }}>
                <FontAwesomeIcon icon="tachometer-alt" style={{ marginRight: '1rem' }} />
                <span>Dashboard</span>
              </Link>
            </li>

            {/* Church Management */}
            <li style={{
              padding: '1rem 1.5rem 0.5rem',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 600,
              letterSpacing: '0.05rem',
              marginTop: '0.5rem'
            }}>
              <span>Church Management</span>
            </li>
            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/admin/branches" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: '#ecf0f1',
                textDecoration: 'none'
              }}>
                <FontAwesomeIcon icon="building" style={{ marginRight: '1rem' }} />
                <span>Branches</span>
              </Link>
            </li>
            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/admin/members" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: '#ecf0f1',
                textDecoration: 'none'
              }}>
                <FontAwesomeIcon icon="users" style={{ marginRight: '1rem' }} />
                <span>Members</span>
              </Link>
            </li>
            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/admin/groups" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: '#ecf0f1',
                textDecoration: 'none'
              }}>
                <FontAwesomeIcon icon="user-friends" style={{ marginRight: '1rem' }} />
                <span>Groups</span>
              </Link>
            </li>

            {/* Finance */}
            <li style={{
              padding: '1rem 1.5rem 0.5rem',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 600,
              letterSpacing: '0.05rem',
              marginTop: '0.5rem'
            }}>
              <span>Finance</span>
            </li>
            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/admin/finances" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: '#ecf0f1',
                textDecoration: 'none'
              }}>
                <FontAwesomeIcon icon="money-bill-alt" style={{ marginRight: '1rem' }} />
                <span>Income & Expenses</span>
              </Link>
            </li>

            {/* Content Management */}
            <li style={{
              padding: '1rem 1.5rem 0.5rem',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 600,
              letterSpacing: '0.05rem',
              marginTop: '0.5rem'
            }}>
              <span>Content Management</span>
            </li>
            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/admin/ministries" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: '#ecf0f1',
                textDecoration: 'none'
              }}>
                <FontAwesomeIcon icon="church" style={{ marginRight: '1rem' }} />
                <span>Ministries</span>
              </Link>
            </li>
            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/admin/sermons" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: '#ecf0f1',
                textDecoration: 'none'
              }}>
                <FontAwesomeIcon icon="bible" style={{ marginRight: '1rem' }} />
                <span>Sermons</span>
              </Link>
            </li>
            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/admin/events" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: '#ecf0f1',
                textDecoration: 'none'
              }}>
                <FontAwesomeIcon icon="calendar-alt" style={{ marginRight: '1rem' }} />
                <span>Events</span>
              </Link>
            </li>
            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/admin/gallery" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: '#ecf0f1',
                textDecoration: 'none'
              }}>
                <FontAwesomeIcon icon="images" style={{ marginRight: '1rem' }} />
                <span>Gallery</span>
              </Link>
            </li>
            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/admin/content" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: '#ecf0f1',
                textDecoration: 'none'
              }}>
                <FontAwesomeIcon icon="file-alt" style={{ marginRight: '1rem' }} />
                <span>Content</span>
              </Link>
            </li>

            {/* Communication */}
            <li style={{
              padding: '1rem 1.5rem 0.5rem',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 600,
              letterSpacing: '0.05rem',
              marginTop: '0.5rem'
            }}>
              <span>Communication</span>
            </li>
            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/admin/contact" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: '#ecf0f1',
                textDecoration: 'none'
              }}>
                <FontAwesomeIcon icon="envelope" style={{ marginRight: '1rem' }} />
                <span>Contact Messages</span>
              </Link>
            </li>

            {/* System */}
            <li style={{
              padding: '1rem 1.5rem 0.5rem',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 600,
              letterSpacing: '0.05rem',
              marginTop: '0.5rem'
            }}>
              <span>System</span>
            </li>
            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/admin/settings" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: '#ecf0f1',
                textDecoration: 'none'
              }}>
                <FontAwesomeIcon icon="cog" style={{ marginRight: '1rem' }} />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Direct Sidebar Test</h1>
        <p>This is a test page with a directly implemented sidebar.</p>
      </div>
    </div>
  );
};

export default DirectSidebar;
