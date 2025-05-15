import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import ContentContext from '../../context/ContentContext';
import ContentFormSelector from '../../components/admin/forms/ContentFormSelector';
import api from '../../services/api';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';
import '../../styles/admin/DataManager.css';
// Import our new modern styles
import '../../styles/main.css';

const ContentManager = () => {
  const { refreshContent } = useContext(ContentContext);
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortField, setSortField] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showViewModal, setShowViewModal] = useState(false);

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

  // Apply filters and search when contents, searchTerm, or filterSection changes
  useEffect(() => {
    applyFiltersAndSort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contents, searchTerm, filterSection, sortField, sortDirection]);

  // Apply filters, search, and sorting to contents
  const applyFiltersAndSort = () => {
    let result = [...contents];

    // Apply section filter
    if (filterSection) {
      result = result.filter(item => item.section === filterSection);
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.title?.toLowerCase().includes(term) ||
        item.section?.toLowerCase().includes(term) ||
        item.content?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];

      // Handle date fields
      if (sortField === 'updatedAt' || sortField === 'createdAt') {
        fieldA = new Date(fieldA).getTime();
        fieldB = new Date(fieldB).getTime();
      }

      // Handle string fields
      if (typeof fieldA === 'string') {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
      }

      // Apply sort direction
      if (sortDirection === 'asc') {
        return fieldA > fieldB ? 1 : -1;
      }
      return fieldA < fieldB ? 1 : -1;
    });

    setFilteredContents(result);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilterSection(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle sort key press for accessibility
  const handleSortKeyPress = (e, field) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSortChange(field);
    }
  };

  // Fetch contents from API
  const fetchContents = async () => {
    try {
      setLoading(true);
      const data = await api.content.getAll();

      setContents(data);
      setFilteredContents(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
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

  // Handle view content
  const handleViewContent = (content) => {
    // Create a modal to view the content details
    setCurrentContent(content);
    setShowViewModal(true);
  };

  // Close view modal
  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setCurrentContent(null);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (content) => {
    setConfirmDelete(content);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;

    // Confirm before deleting multiple items
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected items? This action cannot be undone.`)) {
      // We'll implement the actual bulk delete functionality later
      alert(`Bulk delete ${selectedItems.length} items`);
    }
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

      // Special handling for leadership content
      if (formData.section === 'leadership') {
        console.log('ContentManager: Processing leadership content submission');

        try {
          // Parse the content to check the leaders
          const contentObj = JSON.parse(formData.content);
          if (contentObj.leaders && Array.isArray(contentObj.leaders)) {
            console.log(`ContentManager: Leadership submission contains ${contentObj.leaders.length} leaders`);
          }
        } catch (e) {
          console.error('ContentManager: Error parsing leadership content:', e);
        }
      }

      // Create or update content
      console.log('ContentManager: Saving specialized form content data:', contentData.section);
      const savedContent = await api.content.createOrUpdate(contentData);
      console.log('ContentManager: Specialized form content saved successfully:', savedContent.title);
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
      <div className="data-manager animate-fade-in">
        <div className="dashboard-header">
          <h1>Content Manager</h1>
          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-outline"
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

        <div className="card shadow-md mb-6">
          <div className="card-body">
            <div className="table-filters">
              <div className="filter-group">
                <div className="header-search">
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="filter-control"
                  />
                  <FontAwesomeIcon icon="search" />
                  {searchTerm && (
                    <button
                      type="button"
                      className="action-btn"
                      onClick={() => setSearchTerm('')}
                      title="Clear search"
                      style={{ position: 'absolute', right: '10px' }}
                    >
                      <FontAwesomeIcon icon="times" />
                    </button>
                  )}
                </div>
              </div>

              <div className="filter-group">
                <label htmlFor="filter-section" className="filter-label">Filter by section:</label>
                <select
                  id="filter-section"
                  value={filterSection}
                  onChange={handleFilterChange}
                  className="filter-control"
                >
                  <option value="">All Sections</option>
                  {contentSections.map(section => (
                    <option key={section.value} value={section.value}>
                      {section.label}
                    </option>
                  ))}
                </select>
              </div>

              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2 bg-error bg-opacity-10 text-error p-2 rounded-md">
                  <span className="badge badge-danger">{selectedItems.length} items selected</span>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleBulkDelete()}
                  >
                    <FontAwesomeIcon icon="trash-alt" /> Delete Selected
                  </button>
                </div>
              )}
            </div>
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
            <div className="table-loading-spinner" />
            <p className="mt-4 text-lg">Loading content...</p>
          </div>
        ) : (
          <>
            {contents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FontAwesomeIcon icon="file-alt" />
                </div>
                <h3 className="empty-state-title">No Content Found</h3>
                <p className="empty-state-description">Click "Add New Content" to create your first content item.</p>
                <button type="button" className="btn btn-primary" onClick={handleAddNew}>
                  <FontAwesomeIcon icon="plus" /> Add New Content
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th className="text-center" style={{width: '40px'}}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(filteredContents.map(item => item._id));
                            } else {
                              setSelectedItems([]);
                            }
                          }}
                          checked={selectedItems.length === filteredContents.length && filteredContents.length > 0}
                        />
                      </th>
                      <th className={sortField === 'section' ? `sorted-${sortDirection}` : ''} style={{width: '25%'}}>
                        <div className="flex items-center gap-2">
                          <span>Section</span>
                          <button
                            type="button"
                            className="action-btn"
                            onClick={() => handleSortChange('section')}
                            aria-label={`Sort by section ${sortField === 'section' && sortDirection === 'asc' ? 'descending' : 'ascending'}`}
                          >
                            <FontAwesomeIcon icon={sortField === 'section' ? (sortDirection === 'asc' ? 'sort-up' : 'sort-down') : 'sort'} />
                          </button>
                        </div>
                      </th>
                      <th className={sortField === 'title' ? `sorted-${sortDirection}` : ''} style={{width: '35%'}}>
                        <div className="flex items-center gap-2">
                          <span>Title</span>
                          <button
                            type="button"
                            className="action-btn"
                            onClick={() => handleSortChange('title')}
                            aria-label={`Sort by title ${sortField === 'title' && sortDirection === 'asc' ? 'descending' : 'ascending'}`}
                          >
                            <FontAwesomeIcon icon={sortField === 'title' ? (sortDirection === 'asc' ? 'sort-up' : 'sort-down') : 'sort'} />
                          </button>
                        </div>
                      </th>
                      <th className={sortField === 'updatedAt' ? `sorted-${sortDirection}` : ''} style={{width: '20%'}}>
                        <div className="flex items-center gap-2">
                          <span>Last Updated</span>
                          <button
                            type="button"
                            className="action-btn"
                            onClick={() => handleSortChange('updatedAt')}
                            aria-label={`Sort by last updated ${sortField === 'updatedAt' && sortDirection === 'asc' ? 'descending' : 'ascending'}`}
                          >
                            <FontAwesomeIcon icon={sortField === 'updatedAt' ? (sortDirection === 'asc' ? 'sort-up' : 'sort-down') : 'sort'} />
                          </button>
                        </div>
                      </th>
                      <th style={{width: '120px'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContents.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8">
                          <div className="table-empty">
                            <FontAwesomeIcon icon="search" className="table-empty-icon" />
                            <p className="table-empty-message">No content found matching your search criteria.</p>
                            <button type="button" className="btn btn-outline" onClick={() => {
                              setSearchTerm('');
                              setFilterSection('');
                            }}>
                              Clear Filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredContents.map(content => (
                        <tr
                          key={content._id}
                          className={selectedItems.includes(content._id) ? 'table-row-active' : ''}
                        >
                          <td className="text-center">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedItems.includes(content._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedItems([...selectedItems, content._id]);
                                } else {
                                  setSelectedItems(selectedItems.filter(id => id !== content._id));
                                }
                              }}
                            />
                          </td>
                          <td><span className="badge bg-primary text-white">{getSectionLabel(content.section)}</span></td>
                          <td className="cell-highlight">{content.title}</td>
                          <td>{new Date(content.updatedAt).toLocaleDateString()}</td>
                          <td>
                            <div className="table-actions">
                              <button
                                type="button"
                                className="action-btn action-btn-view"
                                onClick={() => handleViewContent(content)}
                                title="View Content"
                              >
                                <FontAwesomeIcon icon="eye" />
                              </button>
                              <button
                                type="button"
                                className="action-btn action-btn-edit"
                                onClick={() => handleEdit(content)}
                                title="Edit Content"
                              >
                                <FontAwesomeIcon icon="edit" />
                              </button>
                              <button
                                type="button"
                                className="action-btn action-btn-delete"
                                onClick={() => handleDeleteConfirm(content)}
                                title="Delete Content"
                              >
                                <FontAwesomeIcon icon="trash-alt" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="modal-overlay animate-fade-in">
            <div className="modal-content card shadow-xl animate-slide-bottom">
              <div className="card-header">
                <h2 className="card-title">{editMode ? 'Edit Content' : 'Add New Content'}</h2>
                <button type="button" className="action-btn" onClick={() => setShowForm(false)}>
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>

              <div className="card-body">
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
                    <label htmlFor="section" className="form-label form-label-required">Section</label>
                    <select
                      id="section"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      disabled={editMode}
                      required
                      className="form-select"
                    >
                      <option value="">Select a section</option>
                      {contentSections.map(section => (
                        <option key={section.value} value={section.value}>
                          {section.label}
                        </option>
                      ))}
                    </select>
                    <span className="form-help-text">Select the section of the website where this content will appear.</span>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!formData.section}
                    >
                      <FontAwesomeIcon icon="arrow-right" /> Next
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
          </div>
        )}

        {/* View Content Modal */}
        {showViewModal && currentContent && (
          <div className="modal-overlay animate-fade-in">
            <div className="modal-content card shadow-xl animate-slide-bottom">
              <div className="card-header">
                <h2 className="card-title">{currentContent.title}</h2>
                <button type="button" className="action-btn" onClick={handleCloseViewModal}>
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>

              <div className="card-body">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h3 className="text-sm text-tertiary mb-1">Section</h3>
                      <p className="text-lg font-semibold">
                        <span className="badge badge-primary">{getSectionLabel(currentContent.section)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h3 className="text-sm text-tertiary mb-1">Last Updated</h3>
                      <p className="text-lg font-semibold">{new Date(currentContent.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="content-body">
                  <h3>Content Preview</h3>
                  {(() => {
                    // Try to parse as JSON for structured content
                    try {
                      if (currentContent.content &&
                          (currentContent.content.startsWith('{') || currentContent.content.startsWith('['))) {
                        const parsedContent = JSON.parse(currentContent.content);

                        // For leadership content, render a more user-friendly view
                        if (currentContent.section === 'leadership' && parsedContent.leaders) {
                          return (
                            <div className="structured-content-preview">
                              {parsedContent.introduction && (
                                <div className="content-introduction">
                                  <p>{parsedContent.introduction}</p>
                                </div>
                              )}

                              <div className="leadership-preview">
                                {parsedContent.leaders.map((leader, index) => (
                                  <div key={`leader-${leader.name}-${index}`} className="leader-preview-card">
                                    {leader.image && (
                                      <div className="leader-preview-image">
                                        <img
                                          src={getImageUrl(leader.image)}
                                          alt={leader.name}
                                          onError={handleImageError}
                                        />
                                      </div>
                                    )}
                                    <div className="leader-preview-details">
                                      <h4>{leader.name}</h4>
                                      <p className="leader-position">{leader.position}</p>
                                      {leader.bio && <p className="leader-bio">{leader.bio}</p>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        // For weekly schedule content, render a more user-friendly view
                        if (currentContent.section === 'weekly_schedule' && Array.isArray(parsedContent)) {
                          return (
                            <div className="structured-content-preview">
                              <div className="schedule-preview">
                                {parsedContent.map((day, dayIndex) => (
                                  <div key={`day-${day.day}-${dayIndex}`} className="schedule-day">
                                    <h4>{day.day}</h4>
                                    <div className="schedule-events">
                                      {day.events.map((event, eventIndex) => (
                                        <div key={`event-${day.day}-${event.name}-${eventIndex}`} className="schedule-event">
                                          <p className="event-name">{event.name}</p>
                                          <p className="event-time">{event.time}</p>
                                          <p className="event-location">{event.location}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        // For featured event content, render a more user-friendly view
                        if (currentContent.section === 'featured_event') {
                          return (
                            <div className="structured-content-preview">
                              <div className="featured-event-preview">
                                <h4>{parsedContent.title}</h4>
                                <p className="event-date-time">
                                  {parsedContent.date} {parsedContent.time && `• ${parsedContent.time}`}
                                </p>
                                {parsedContent.location && (
                                  <p className="event-location">{parsedContent.location}</p>
                                )}
                                {parsedContent.description && (
                                  <p className="event-description">{parsedContent.description}</p>
                                )}
                              </div>
                            </div>
                          );
                        }

                        // For other structured content, show a simplified view
                        return (
                          <div className="structured-content-preview">
                            <div className="structured-data-summary">
                              {Object.keys(parsedContent).map((key) => {
                                const value = parsedContent[key];
                                if (typeof value === 'string' || typeof value === 'number') {
                                  return (
                                    <div key={`data-${key}`} className="data-item">
                                      <span className="data-key">{key}:</span>
                                      <span className="data-value">{value}</span>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                              {Array.isArray(parsedContent) && (
                                <p className="data-summary">
                                  This content contains {parsedContent.length} items.
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      }
                    } catch (e) {
                      // Not valid JSON, continue to default rendering
                    }

                    // Default content rendering - use a sanitized approach
                    // For plain text or HTML content, display it in a readable format
                    const contentText = currentContent.content || '';

                    // Simple HTML tag detection
                    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(contentText);

                    // Process content based on whether it has HTML tags
                    const processedContent = hasHtmlTags ?
                      contentText.replace(/<[^>]*>/g, '') : contentText;

                    // Display the processed content with line breaks
                    return (
                      <div className="text-content formatted-content">
                        {processedContent.split('\n')
                          .filter(line => line.trim() !== '')
                          .map((line, i) => (
                            <p key={`content-line-${currentContent._id}-${i}`}>{line}</p>
                          ))
                        }
                      </div>
                    );
                  })()}
                </div>

                {currentContent.image && (
                  <div className="content-image">
                    <h3>Image</h3>
                    <div className="image-preview">
                      <img
                        src={getImageUrl(currentContent.image)}
                        alt={currentContent.title}
                        onError={handleImageError}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <button type="button" className="btn btn-ghost" onClick={handleCloseViewModal}>
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    handleCloseViewModal();
                    handleEdit(currentContent);
                  }}
                >
                  <FontAwesomeIcon icon="edit" /> Edit Content
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="modal-overlay animate-fade-in">
            <div className="modal-content card shadow-xl animate-slide-bottom" style={{maxWidth: '500px'}}>
              <div className="card-header">
                <h2 className="card-title">Confirm Delete</h2>
                <button type="button" className="action-btn" onClick={handleDeleteCancel}>
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>

              <div className="card-body">
                <div className="text-center p-6">
                  <div className="text-error mb-4">
                    <FontAwesomeIcon icon="exclamation-triangle" size="3x" />
                  </div>
                  <h3 className="text-xl mb-2">Delete Confirmation</h3>
                  <p className="mb-4">Are you sure you want to delete the content <strong>{confirmDelete.title}</strong>?</p>
                  <p className="text-error text-sm mb-6">This action cannot be undone.</p>
                </div>
              </div>

              <div className="card-footer">
                <button type="button" className="btn btn-ghost" onClick={handleDeleteCancel}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={() => handleDelete(confirmDelete.section)}>
                  <FontAwesomeIcon icon="trash-alt" /> Delete
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
