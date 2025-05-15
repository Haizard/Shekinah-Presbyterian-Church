import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import '../../styles/admin/MemberDetail.css';

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch member data on component mount
  useEffect(() => {
    fetchMemberData();
  }, [id]);

  // Fetch member data from API
  const fetchMemberData = async () => {
    try {
      setLoading(true);
      const memberData = await api.members.getById(id);
      setMember(memberData);

      // If member has a branch, fetch branch details
      if (memberData.branchId) {
        const branchData = await api.branches.getById(memberData.branchId);
        setBranch(branchData);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching member data:', err);
      setError('Failed to load member data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    return `status-badge ${status}`;
  };

  // Handle back button click
  const handleBack = () => {
    navigate('/admin/members');
  };

  // Handle edit button click
  const handleEdit = () => {
    navigate('/admin/members', { state: { editMemberId: id } });
  };

  return (
    <AdminLayout>
      <div className="member-detail-container">
        <div className="detail-header">
          <button type="button" className="btn btn-back" onClick={handleBack}>
            <FontAwesomeIcon icon="arrow-left" /> Back to Members
          </button>
          <h1>Member Details</h1>
        </div>

        {error && (
          <div className="alert alert-danger">
            <FontAwesomeIcon icon="exclamation-circle" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">
            <FontAwesomeIcon icon="spinner" spin />
            <span>Loading member details...</span>
          </div>
        ) : member ? (
          <div className="member-detail-content">
            <div className="member-profile">
              <div className="profile-header">
                <div className="profile-image">
                  {member.image ? (
                    <img 
                      src={member.image.startsWith('http') ? member.image : `/${member.image}`} 
                      alt={`${member.firstName} ${member.lastName}`} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/default-profile.png';
                      }}
                    />
                  ) : (
                    <div className="default-profile">
                      <FontAwesomeIcon icon="user" />
                    </div>
                  )}
                </div>
                <div className="profile-info">
                  <h2>{member.firstName} {member.lastName}</h2>
                  <span className={getStatusBadgeClass(member.membershipStatus)}>
                    {member.membershipStatus.charAt(0).toUpperCase() + member.membershipStatus.slice(1)}
                  </span>
                  <p className="member-since">Member since: {formatDate(member.joinDate)}</p>
                </div>
                <div className="profile-actions">
                  <button type="button" className="btn btn-primary" onClick={handleEdit}>
                    <FontAwesomeIcon icon="edit" /> Edit Member
                  </button>
                </div>
              </div>

              <div className="profile-details">
                <div className="detail-section">
                  <h3>Contact Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{member.email || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{member.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Address:</span>
                      <span className="detail-value">{member.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Personal Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Date of Birth:</span>
                      <span className="detail-value">{member.dateOfBirth ? formatDate(member.dateOfBirth) : 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Baptism Date:</span>
                      <span className="detail-value">{member.baptismDate ? formatDate(member.baptismDate) : 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Branch:</span>
                      <span className="detail-value">{branch ? branch.name : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {member.notes && (
                  <div className="detail-section">
                    <h3>Notes</h3>
                    <div className="notes-content">
                      <p>{member.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <FontAwesomeIcon icon="user-slash" />
            <p>Member not found. The member may have been deleted or you don't have permission to view it.</p>
            <button type="button" className="btn btn-primary" onClick={handleBack}>
              Return to Members List
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MemberDetail;
