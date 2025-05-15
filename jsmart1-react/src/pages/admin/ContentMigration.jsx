import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminLayout from '../../components/admin/AdminLayout';
import { migrateContentSection, migrateAllContent } from '../../utils/contentMigration';
import '../../styles/admin/ContentMigration.css';

const ContentMigration = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState('all');

  const sections = [
    { value: 'all', label: 'All Sections' },
    { value: 'motto', label: 'Our Motto' },
    { value: 'featured_event', label: 'Featured Event' },
    // Add other sections as needed
  ];

  const handleMigration = async () => {
    try {
      setLoading(true);
      setError(null);
      setResults(null);

      let result;
      if (selectedSection === 'all') {
        result = await migrateAllContent();
        setResults(result);
      } else {
        result = await migrateContentSection(selectedSection);
        setResults({ [selectedSection]: result });
      }

      setLoading(false);
    } catch (err) {
      console.error('Error during migration:', err);
      setError(err.message || 'An error occurred during migration');
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="content-migration-page">
        <div className="page-header">
          <h1>Content Migration Tool</h1>
          <p className="description">
            This tool helps migrate content from old formats to new structured formats.
            Use this if you're experiencing issues with content not displaying correctly.
          </p>
        </div>

        <div className="migration-controls">
          <div className="form-group">
            <label htmlFor="section-select">Select Section to Migrate:</label>
            <select
              id="section-select"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              disabled={loading}
            >
              {sections.map((section) => (
                <option key={section.value} value={section.value}>
                  {section.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleMigration}
            disabled={loading}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon="sync" spin /> Migrating...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon="sync" /> Run Migration
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            <FontAwesomeIcon icon="times" /> {error}
          </div>
        )}

        {results && (
          <div className="migration-results">
            <h2>Migration Results</h2>

            {Object.keys(results).map((section) => {
              const result = results[section];
              if (section === 'success' || section === 'message') return null;

              return (
                <div key={section} className="section-result">
                  <h3>{section}</h3>
                  <div className={`alert ${result.success ? 'alert-success' : 'alert-danger'}`}>
                    <FontAwesomeIcon icon={result.success ? "check" : "times"} /> {result.message}
                  </div>
                  {result.migrated > 0 && (
                    <p>
                      <FontAwesomeIcon icon="info-circle" /> {result.migrated} content items were migrated.
                    </p>
                  )}
                </div>
              );
            })}

            {results.message && (
              <div className="overall-result">
                <div className={`alert ${results.success ? 'alert-success' : 'alert-danger'}`}>
                  <FontAwesomeIcon icon={results.success ? "check" : "times"} /> {results.message}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="migration-info">
          <h3>What This Tool Does</h3>
          <p>
            This tool scans the content in your database and ensures it's in the proper structured format.
            It's useful when:
          </p>
          <ul>
            <li>Content is not displaying correctly on the website</li>
            <li>You see JSON parsing errors in the console</li>
            <li>You've recently updated the website code</li>
          </ul>
          <p>
            <strong>Note:</strong> This tool will not delete or remove any content. It only updates the format
            of existing content to ensure compatibility with the current website code.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContentMigration;
