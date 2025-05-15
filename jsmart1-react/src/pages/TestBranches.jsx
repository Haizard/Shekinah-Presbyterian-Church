import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

const TestBranches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        console.log('TestBranches: Fetching branches...');
        const data = await api.branches.getAll();
        console.log('TestBranches: Fetched branches:', data);
        setBranches(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Failed to load branches');
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h1>Test Branches Page</h1>
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading branches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>Test Branches Page</h1>
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Test Branches Page</h1>
      <p>Total branches: {branches.length}</p>

      {branches.length === 0 ? (
        <div className="alert alert-warning">
          <p>No branches found. Please add branches in the admin panel.</p>
        </div>
      ) : (
        <div className="branches-list">
          {branches.map(branch => (
            <div key={branch._id} className="branch-card">
              <h3>{branch.name}</h3>
              <p><strong>Location:</strong> {branch.location}</p>
              <p><strong>Pastor:</strong> {branch.pastor}</p>
              <p><strong>Contact:</strong> {branch.contactInfo}</p>
              {branch.description && (
                <p><strong>Description:</strong> {branch.description}</p>
              )}
              {branch.image && (
                <div className="branch-image">
                  <img
                    src={getImageUrl(branch.image)}
                    alt={branch.name}
                    onError={handleImageError}
                    style={{ maxWidth: '200px' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestBranches;
