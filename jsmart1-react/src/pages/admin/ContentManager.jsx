import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import ContentContext from '../../context/ContentContext';
import ContentFormSelector from '../../components/admin/forms/ContentFormSelector';
import api from '../../services/api';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';
import '../../styles/admin/DataManager.css';

const ContentManager = () => {
  const { refreshContent } = useContext(ContentContext);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    section: '',
    title: '',
    content: '',
    image: '',
    structuredData: []
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Predefined content sections
  const contentSections = [
    { value: 'hero', label: 'Hero Section' },
    { value: 'about', label: 'About Us' },
    { value: 'vision', label: 'Our Vision' },
    { value: 'mission', label: 'Our Mission' },
    { value: 'story', label: 'Our Story' },
    { value: 'motto', label: 'Our Motto' },
    { value: 'leadership', label: 'Our Leadership' },
    { value: 'weekly_schedule', label: 'Weekly Schedule' },
    { value: 'featured_event', label: 'Featured Event' },
    { value: 'special_events', label: 'Special Events' },
    { value: 'current_series', label: 'Current Series' },
    { value: 'sermon_series', label: 'Sermon Series' },
    { value: 'how_we_serve', label: 'How We Serve' },
    { value: 'video_gallery', label: 'Video Gallery' },
    { value: 'event_calendar', label: 'Event Calendar' },
    { value: 'latest_sermons', label: 'Latest Sermons' },
    { value: 'upcoming_events', label: 'Upcoming Events' },
    { value: 'who_we_are', label: 'Who We Are' }
  ];

  // Fetch content on component mount
  useEffect(() => {
    fetchContents();
  }, []);

  // Fetch contents from API
  const fetchContents = async () => {
    try {
      console.log('ContentManager: Fetching all content from API...');
      setLoading(true);
      const data = await api.content.getAll();
      console.log('ContentManager: Fetched content data:', data);

      // Log sections and timestamps
      const sections = data.map(item => ({
        section: item.section,
        updatedAt: new Date(item.updatedAt).toLocaleString(),
        _id: item._id
      }));
      console.log('ContentManager: Content sections and update times:', sections);

      setContents(data);
      setError(null);
    } catch (err) {
      console.error('ContentManager: Error fetching content:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
      console.log('ContentManager: Finished fetching content');
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Setting image preview from file upload');
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // If no file is selected, clear the preview
      setImagePreview(null);
      setImageFile(null);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      section: '',
      title: '',
      content: '',
      image: '',
      structuredData: []
    });
    setImageFile(null);
    setImagePreview(null);
    setEditMode(false);
    setCurrentContent(null);
    setFormError(null);
    setFormSuccess(null);
    setFormStep(1);
  };

  // Open form for creating new content
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Open form for editing existing content
  const handleEdit = (content) => {
    // Check if content.content is JSON for structured data
    let structuredData = [];
    let contentText = content.content;

    try {
      // Check if content is JSON array or object
      if ((content.content.startsWith('[') && content.content.endsWith(']')) ||
          (content.content.startsWith('{') && content.content.endsWith('}'))) {
        const parsedData = JSON.parse(content.content);
        if (Array.isArray(parsedData)) {
          structuredData = parsedData;
          contentText = JSON.stringify(parsedData, null, 2); // Pretty format for editing
        }
      }
    } catch (err) {
      console.error('Content is not valid JSON:', err);
      // Keep original content as is
    }

    setFormData({
      section: content.section,
      title: content.title,
      content: contentText,
      image: content.image,
      structuredData: structuredData
    });

    // Use the correct image URL for preview
    if (content.image) {
      console.log('Setting image preview for edit:', content.image);
      setImagePreview(getImageUrl(content.image));
    } else {
      setImagePreview(null);
    }

    setEditMode(true);
    setCurrentContent(content);
    setShowForm(true);
    setFormError(null);
    setFormSuccess(null);
    setFormStep(2); // Skip to the specialized form
  };

  // Upload image file
  const uploadImage = async () => {
    if (!imageFile) return null;

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await api.upload.uploadFile(formData);
      return response.filePath;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new Error('Failed to upload image. Please try again.');
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setFormError(null);
      setFormSuccess(null);

      // Validate form
      if (!formData.section || !formData.title || !formData.content) {
        setFormError('Please fill in all required fields.');
        return;
      }

      // Upload image if selected
      let imagePath = formData.image;
      if (imageFile) {
        imagePath = await uploadImage();
        if (!imagePath) {
          setFormError('Failed to upload image. Please try again.');
          return;
        }
      }

      // Process content based on section type
      let processedContent = formData.content;

      // For structured content sections, validate JSON
      if (['video_gallery', 'weekly_schedule', 'featured_event', 'special_events', 'sermon_series', 'event_calendar'].includes(formData.section)) {
        try {
          // Check if content is already valid JSON
          if ((formData.content.startsWith('[') && formData.content.endsWith(']')) ||
              (formData.content.startsWith('{') && formData.content.endsWith('}'))) {
            // Validate by parsing
            JSON.parse(formData.content);
            // If it parses successfully, use as is
            processedContent = formData.content;
          }
        } catch (jsonError) {
          setFormError('Invalid JSON format. Please check your content structure.');
          console.error('JSON validation error:', jsonError);
          return;
        }
      }

      const contentData = {
        ...formData,
        content: processedContent,
        image: imagePath
      };

      // Create or update content
      console.log('ContentManager: Saving content data:', contentData);
      const savedContent = await api.content.createOrUpdate(contentData);
      console.log('ContentManager: Content saved successfully:', savedContent);
      setFormSuccess('Content saved successfully!');

      // Refresh content list
      console.log('ContentManager: Refreshing content list...');
      await fetchContents();

      // Refresh the global content context to update all components
      console.log('ContentManager: Triggering global content refresh...');
      refreshContent();

      // Force refresh of specific section in all components
      console.log(`ContentManager: Forcing refresh of section "${contentData.section}" in all components`);
      if (typeof window !== 'undefined' && window.refreshDynamicContent && window.refreshDynamicContent[contentData.section]) {
        setTimeout(() => {
          console.log(`ContentManager: Executing manual refresh for section "${contentData.section}"`);
          window.refreshDynamicContent[contentData.section]();
        }, 500);
      }

      // Reset form after a short delay
      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 2000);

    } catch (err) {
      console.error('Error saving content:', err);
      setFormError('Failed to save content. Please try again.');
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (content) => {
    setConfirmDelete(content);
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  // Delete content
  const handleDelete = async (section) => {
    try {
      console.log(`ContentManager: Deleting content for section "${section}"...`);
      await api.content.delete(section);
      console.log(`ContentManager: Content for section "${section}" deleted successfully`);
      setConfirmDelete(null);

      // Refresh content list
      console.log('ContentManager: Refreshing content list after delete...');
      await fetchContents();

      // Refresh the global content context to update all components
      console.log('ContentManager: Triggering global content refresh after delete...');
      refreshContent();

      // Force refresh of specific section in all components
      console.log(`ContentManager: Forcing refresh of section "${section}" in all components after delete`);
      if (typeof window !== 'undefined' && window.refreshDynamicContent && window.refreshDynamicContent[section]) {
        setTimeout(() => {
          console.log(`ContentManager: Executing manual refresh for section "${section}" after delete`);
          window.refreshDynamicContent[section]();
        }, 500);
      }
    } catch (err) {
      console.error(`ContentManager: Error deleting content for section "${section}":`, err);
      setError('Failed to delete content. Please try again.');
    }
  };

  // Handle submission from specialized form
  const handleSpecializedFormSubmit = async (formData) => {
    try {
      setFormError(null);
      setFormSuccess(null);

      // Upload image if included in the form data
      let imagePath = formData.image;
      if (imageFile) {
        imagePath = await uploadImage();
        if (!imagePath) {
          setFormError('Failed to upload image. Please try again.');
          return;
        }
      }

      const contentData = {
        ...formData,
        image: imagePath
      };

      // Create or update content
      console.log('ContentManager: Saving specialized form content data:', contentData);
      const savedContent = await api.content.createOrUpdate(contentData);
      console.log('ContentManager: Specialized form content saved successfully:', savedContent);
      setFormSuccess('Content saved successfully!');

      // Refresh content list
      console.log('ContentManager: Refreshing content list after specialized form save...');
      await fetchContents();

      // Refresh the global content context to update all components
      console.log('ContentManager: Triggering global content refresh after specialized form save...');
      refreshContent();

      // Force refresh of specific section in all components
      console.log(`ContentManager: Forcing refresh of section "${contentData.section}" in all components after specialized form save`);
      if (typeof window !== 'undefined' && window.refreshDynamicContent && window.refreshDynamicContent[contentData.section]) {
        setTimeout(() => {
          console.log(`ContentManager: Executing manual refresh for section "${contentData.section}" after specialized form save`);
          window.refreshDynamicContent[contentData.section]();
        }, 500);
      }

      // Reset form after a short delay
      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 2000);

    } catch (err) {
      console.error('Error saving content:', err);
      setFormError('Failed to save content. Please try again.');
    }
  };

  // Get section label
  const getSectionLabel = (sectionValue) => {
    const section = contentSections.find(s => s.value === sectionValue);
    return section ? section.label : sectionValue;
  };

  // Get sample JSON template for structured content
  const getSampleTemplate = (section) => {
    switch(section) {
      case 'video_gallery':
        return JSON.stringify([
          {
            "title": "Sunday Worship Service",
            "thumbnail": "/images/SPCT/CHURCH.jpg",
            "url": "https://www.youtube.com/watch?v=example1",
            "date": "June 4, 2023"
          },
          {
            "title": "Wednesday Bible Study",
            "thumbnail": "/images/SPCT/CHURCH.jpg",
            "url": "https://www.youtube.com/watch?v=example2",
            "date": "May 31, 2023"
          }
        ], null, 2);

      case 'weekly_schedule':
        return JSON.stringify([
          {
            "day": "Sunday",
            "events": [
              {
                "name": "Worship Service",
                "time": "9:00 AM - 12:00 PM",
                "location": "Main Sanctuary"
              },
              {
                "name": "Sunday School",
                "time": "2:00 PM - 3:30 PM",
                "location": "Education Building"
              }
            ]
          },
          {
            "day": "Wednesday",
            "events": [
              {
                "name": "Bible Study",
                "time": "6:00 PM - 8:00 PM",
                "location": "Fellowship Hall"
              }
            ]
          }
        ], null, 2);

      case 'featured_event':
        return JSON.stringify({
          "title": "Annual Church Conference",
          "date": "June 15-17, 2023",
          "time": "9:00 AM - 4:00 PM",
          "location": "Main Sanctuary",
          "description": "Join us for our annual church conference with guest speakers and worship. This year's theme is \"Rooted in Christ, Growing in Faith.\"",
          "link": "/events"
        }, null, 2);

      case 'special_events':
        return JSON.stringify([
          {
            "title": "Annual Church Conference",
            "date": "June 15, 2023",
            "time": "9:00 AM - 4:00 PM",
            "location": "Main Sanctuary",
            "description": "Join us for our annual church conference with guest speakers and worship."
          },
          {
            "title": "Youth Camp",
            "date": "July 10-15, 2023",
            "time": "All Day",
            "location": "Camp Shekinah",
            "description": "A week of fun, fellowship, and spiritual growth for youth ages 12-18."
          }
        ], null, 2);

      case 'sermon_series':
        return JSON.stringify([
          {
            "title": "Faith That Works",
            "description": "A study through the book of James",
            "image": "/images/SPCT/CHURCH.jpg",
            "sermons": [
              {
                "title": "Faith and Trials",
                "scripture": "James 1:1-12",
                "date": "June 4, 2023"
              },
              {
                "title": "Faith and Temptation",
                "scripture": "James 1:13-18",
                "date": "June 11, 2023"
              }
            ]
          }
        ], null, 2);

      case 'event_calendar':
        return JSON.stringify([
          {
            "title": "Sunday Worship Service",
            "date": "2023-06-11",
            "time": "9:00 AM - 12:00 PM",
            "location": "Main Sanctuary"
          },
          {
            "title": "Bible Study",
            "date": "2023-06-14",
            "time": "6:00 PM - 8:00 PM",
            "location": "Fellowship Hall"
          },
          {
            "title": "Youth Fellowship",
            "date": "2023-06-16",
            "time": "4:00 PM - 6:00 PM",
            "location": "Youth Center"
          }
        ], null, 2);

      default:
        return '';
    }
  };

  return (
    <AdminLayout>
      <div className="data-manager">
        <div className="manager-header">
          <h1>Content Manager</h1>
          <div className="header-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                refreshContent();
                fetchContents();
              }}
            >
              <FontAwesomeIcon icon="sync" /> Refresh Content
            </button>
            <button type="button" className="btn btn-primary" onClick={handleAddNew}>
              <FontAwesomeIcon icon="plus" /> Add New Content
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            <FontAwesomeIcon icon="exclamation-circle" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="spinner-large" />
            <p>Loading content...</p>
          </div>
        ) : (
          <>
            {contents.length === 0 ? (
              <div className="no-data">
                <p>No content found. Click "Add New Content" to create one.</p>
              </div>
            ) : (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Section</th>
                      <th>Title</th>
                      <th>Last Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contents.map(content => (
                      <tr key={content._id}>
                        <td>{getSectionLabel(content.section)}</td>
                        <td>{content.title}</td>
                        <td>{new Date(content.updatedAt).toLocaleDateString()}</td>
                        <td className="actions">
                          <button
                            type="button"
                            className="btn btn-sm btn-edit"
                            onClick={() => handleEdit(content)}
                          >
                            <FontAwesomeIcon icon="edit" /> Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-delete"
                            onClick={() => handleDeleteConfirm(content)}
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

        {/* Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editMode ? 'Edit Content' : 'Add New Content'}</h2>
                <button type="button" className="close-btn" onClick={() => setShowForm(false)}>
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>

              {formError && (
                <div className="alert alert-danger">
                  <FontAwesomeIcon icon="exclamation-circle" />
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="alert alert-success">
                  <FontAwesomeIcon icon="check-circle" />
                  {formSuccess}
                </div>
              )}

              {formStep === 1 ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (formData.section) {
                    setFormStep(2);
                  }
                }}>
                  <div className="form-group">
                    <label htmlFor="section">Section <span className="required">*</span></label>
                    <select
                      id="section"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      disabled={editMode}
                      required
                    >
                      <option value="">Select a section</option>
                      {contentSections.map(section => (
                        <option key={section.value} value={section.value}>
                          {section.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!formData.section}
                    >
                      Next
                    </button>
                  </div>
                </form>
              ) : (
                <ContentFormSelector
                  section={formData.section}
                  initialData={currentContent}
                  onSubmit={handleSpecializedFormSubmit}
                />
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="modal-overlay">
            <div className="modal-content confirm-modal">
              <div className="modal-header">
                <h2>Confirm Delete</h2>
                <button type="button" className="close-btn" onClick={handleDeleteCancel}>
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>

              <div className="confirm-content">
                <p>Are you sure you want to delete the content <strong>{confirmDelete.title}</strong>?</p>
                <p className="warning">This action cannot be undone.</p>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleDeleteCancel}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={() => handleDelete(confirmDelete.section)}>
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

export default ContentManager;
