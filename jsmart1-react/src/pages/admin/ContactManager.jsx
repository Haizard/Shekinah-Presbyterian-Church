import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import '../../styles/admin/DataManager.css';

const ContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await api.contact.getAll();
      setContacts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contact submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // View contact details
  const handleViewDetails = async (contact) => {
    try {
      // If the contact is unread, mark it as read
      if (contact.status === 'unread') {
        await api.contact.updateStatus(contact._id, { status: 'read' });
        // Update the contact in the list
        setContacts(contacts.map(c => 
          c._id === contact._id ? { ...c, status: 'read' } : c
        ));
      }
      
      setCurrentContact(contact);
      setShowDetails(true);
    } catch (err) {
      console.error('Error updating contact status:', err);
      // Still show the details even if status update fails
      setCurrentContact(contact);
      setShowDetails(true);
    }
  };

  // Close details modal
  const handleCloseDetails = () => {
    setShowDetails(false);
    setCurrentContact(null);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (contact) => {
    setConfirmDelete(contact);
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  // Delete contact
  const handleDelete = async (id) => {
    try {
      await api.contact.delete(id);
      setConfirmDelete(null);
      
      // If the deleted contact is currently being viewed, close the details modal
      if (currentContact && currentContact._id === id) {
        setShowDetails(false);
        setCurrentContact(null);
      }
      
      // Update the contacts list
      setContacts(contacts.filter(contact => contact._id !== id));
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError('Failed to delete contact. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="data-manager">
        <div className="manager-header">
          <h1>Contact Messages</h1>
        </div>
        
        {error && (
          <div className="alert alert-danger">
            <FontAwesomeIcon icon="exclamation-circle" />
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="loading-container">
            <div className="spinner-large"></div>
            <p>Loading contact messages...</p>
          </div>
        ) : (
          <>
            {contacts.length === 0 ? (
              <div className="no-data">
                <p>No contact messages found.</p>
              </div>
            ) : (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Subject</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map(contact => (
                      <tr key={contact._id} className={contact.status === 'unread' ? 'unread-row' : ''}>
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td>{contact.subject}</td>
                        <td>{formatDate(contact.createdAt)}</td>
                        <td>
                          <span className={`status-badge ${contact.status}`}>
                            {contact.status}
                          </span>
                        </td>
                        <td className="actions">
                          <button 
                            className="btn btn-sm btn-view"
                            onClick={() => handleViewDetails(contact)}
                          >
                            <FontAwesomeIcon icon="eye" /> View
                          </button>
                          <button 
                            className="btn btn-sm btn-delete"
                            onClick={() => handleDeleteConfirm(contact)}
                          >
                            <FontAwesomeIcon icon="trash-alt" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        
        {/* Contact Details Modal */}
        {showDetails && currentContact && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Contact Message</h2>
                <button className="close-btn" onClick={handleCloseDetails}>
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>
              
              <div className="contact-details">
                <div className="contact-info">
                  <div className="contact-field">
                    <span className="field-label">From:</span>
                    <span className="field-value">{currentContact.name} ({currentContact.email})</span>
                  </div>
                  
                  <div className="contact-field">
                    <span className="field-label">Subject:</span>
                    <span className="field-value">{currentContact.subject}</span>
                  </div>
                  
                  <div className="contact-field">
                    <span className="field-label">Date:</span>
                    <span className="field-value">{formatDate(currentContact.createdAt)}</span>
                  </div>
                  
                  <div className="contact-field">
                    <span className="field-label">Status:</span>
                    <span className={`status-badge ${currentContact.status}`}>
                      {currentContact.status}
                    </span>
                  </div>
                </div>
                
                <div className="contact-message">
                  <h3>Message:</h3>
                  <div className="message-content">
                    {currentContact.message}
                  </div>
                </div>
                
                <div className="contact-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={handleCloseDetails}
                  >
                    Close
                  </button>
                  <a 
                    href={`mailto:${currentContact.email}?subject=Re: ${currentContact.subject}`}
                    className="btn btn-primary"
                  >
                    <FontAwesomeIcon icon="reply" /> Reply via Email
                  </a>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteConfirm(currentContact)}
                  >
                    <FontAwesomeIcon icon="trash-alt" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="modal-overlay">
            <div className="modal-content confirm-modal">
              <div className="modal-header">
                <h2>Confirm Delete</h2>
                <button className="close-btn" onClick={handleDeleteCancel}>
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>
              
              <div className="confirm-content">
                <p>Are you sure you want to delete the message from <strong>{confirmDelete.name}</strong>?</p>
                <p className="warning">This action cannot be undone.</p>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleDeleteCancel}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={() => handleDelete(confirmDelete._id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContactManager;
