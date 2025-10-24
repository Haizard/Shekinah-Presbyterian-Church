import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import ChurchSettingsContext from '../../context/ChurchSettingsContext';
import api from '../../services/api';
import '../../styles/admin/DataManager.css';

const ChurchSettingsManager = () => {
  const { settings, updateSettings, loading: contextLoading } = useContext(ChurchSettingsContext);
  const [formData, setFormData] = useState({
    churchName: '',
    churchDescription: '',
    logo: '',
    favicon: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    phone: '',
    email: '',
    serviceTimes: [],
    socialMedia: {},
    bankDetails: {},
    mapCoordinates: {},
    timezone: 'UTC',
    currency: 'USD',
    language: 'en',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Initialize form with settings
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle nested object changes (socialMedia, bankDetails, etc.)
  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateSettings(formData);
      setSuccess('Church settings updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating church settings:', err);
      setError('Failed to update church settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (contextLoading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading church settings...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="data-manager">
        <div className="manager-header">
          <h1>Church Settings</h1>
          <p>Configure your church's basic information, contact details, and branding</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <FontAwesomeIcon icon="exclamation-circle" />
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <FontAwesomeIcon icon="check-circle" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="settings-form">
          {/* Basic Information */}
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label htmlFor="churchName">Church Name</label>
              <input
                type="text"
                id="churchName"
                name="churchName"
                value={formData.churchName}
                onChange={handleInputChange}
                placeholder="Enter your church name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="churchDescription">Church Description</label>
              <textarea
                id="churchDescription"
                name="churchDescription"
                value={formData.churchDescription}
                onChange={handleInputChange}
                placeholder="Enter a brief description of your church"
                rows="4"
              />
            </div>
          </div>

          {/* Branding */}
          <div className="form-section">
            <h2>Branding</h2>
            <div className="form-group">
              <label htmlFor="logo">Logo URL</label>
              <input
                type="text"
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
                placeholder="Enter logo image URL"
              />
            </div>

            <div className="form-group">
              <label htmlFor="favicon">Favicon URL</label>
              <input
                type="text"
                id="favicon"
                name="favicon"
                value={formData.favicon}
                onChange={handleInputChange}
                placeholder="Enter favicon image URL"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h2>Contact Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                />
              </div>
              <div className="form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Postal code"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="form-section">
            <h2>Social Media Links</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="facebook">Facebook</label>
                <input
                  type="url"
                  id="facebook"
                  value={formData.socialMedia?.facebook || ''}
                  onChange={(e) => handleNestedChange('socialMedia', 'facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="twitter">Twitter</label>
                <input
                  type="url"
                  id="twitter"
                  value={formData.socialMedia?.twitter || ''}
                  onChange={(e) => handleNestedChange('socialMedia', 'twitter', e.target.value)}
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="instagram">Instagram</label>
                <input
                  type="url"
                  id="instagram"
                  value={formData.socialMedia?.instagram || ''}
                  onChange={(e) => handleNestedChange('socialMedia', 'instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="youtube">YouTube</label>
                <input
                  type="url"
                  id="youtube"
                  value={formData.socialMedia?.youtube || ''}
                  onChange={(e) => handleNestedChange('socialMedia', 'youtube', e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="form-section">
            <h2>Bank Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bankName">Bank Name</label>
                <input
                  type="text"
                  id="bankName"
                  value={formData.bankDetails?.bankName || ''}
                  onChange={(e) => handleNestedChange('bankDetails', 'bankName', e.target.value)}
                  placeholder="Bank name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="accountName">Account Name</label>
                <input
                  type="text"
                  id="accountName"
                  value={formData.bankDetails?.accountName || ''}
                  onChange={(e) => handleNestedChange('bankDetails', 'accountName', e.target.value)}
                  placeholder="Account name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="accountNumber">Account Number</label>
                <input
                  type="text"
                  id="accountNumber"
                  value={formData.bankDetails?.accountNumber || ''}
                  onChange={(e) => handleNestedChange('bankDetails', 'accountNumber', e.target.value)}
                  placeholder="Account number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="swiftCode">Swift Code</label>
                <input
                  type="text"
                  id="swiftCode"
                  value={formData.bankDetails?.swiftCode || ''}
                  onChange={(e) => handleNestedChange('bankDetails', 'swiftCode', e.target.value)}
                  placeholder="Swift code"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="form-section">
            <h2>Settings</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="timezone">Timezone</label>
                <input
                  type="text"
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  placeholder="UTC"
                />
              </div>
              <div className="form-group">
                <label htmlFor="currency">Currency</label>
                <input
                  type="text"
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  placeholder="USD"
                />
              </div>
              <div className="form-group">
                <label htmlFor="language">Language</label>
                <input
                  type="text"
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  placeholder="en"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <FontAwesomeIcon icon="spinner" spin />
                  Saving...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon="save" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ChurchSettingsManager;

