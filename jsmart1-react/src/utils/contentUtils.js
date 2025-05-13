/**
 * Utility functions for handling content data
 */
import api from '../services/api';

/**
 * Safely parse JSON content if it's in JSON format
 * @param {string} content - The content string that might be JSON
 * @returns {any} - Parsed JSON object or the original string
 */
export const parseContent = (content) => {
  if (!content) return null;

  // Check if content is already a non-string (like an object)
  if (typeof content !== 'string') return content;

  // Check if content looks like JSON (starts with [ or {)
  if ((content.trim().startsWith('{') && content.trim().endsWith('}')) ||
      (content.trim().startsWith('[') && content.trim().endsWith(']'))) {
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('Error parsing content as JSON:', error);
      return content; // Return original content if parsing fails
    }
  }

  // Return original content if it's not JSON
  return content;
};

/**
 * Determine if content is HTML
 * @param {string} content - The content string to check
 * @returns {boolean} - True if content contains HTML tags
 */
export const isHtmlContent = (content) => {
  if (!content || typeof content !== 'string') return false;

  // Simple check for HTML tags
  return /<[a-z][\s\S]*>/i.test(content);
};

/**
 * Render content based on its type
 * @param {any} content - The content to render
 * @param {object} options - Rendering options
 * @returns {JSX.Element|string} - Rendered content
 */
export const renderContent = (content, options = {}) => {
  const parsedContent = parseContent(content);

  if (!parsedContent) return null;

  // If it's HTML content, return it for dangerouslySetInnerHTML
  if (typeof parsedContent === 'string' && isHtmlContent(parsedContent)) {
    return parsedContent;
  }

  // If it's an object or array, stringify it for display
  if (typeof parsedContent === 'object') {
    return JSON.stringify(parsedContent, null, 2);
  }

  // Default case: return as is
  return parsedContent;
};

/**
 * Ensures that required content sections exist, creating them with default data if they don't
 * @param {Array} requiredSections - Array of section names that must exist
 * @returns {Promise<Object>} - Object with results of the operation
 */
export const ensureContentSectionsExist = async (requiredSections = []) => {
  try {
    console.log('Ensuring content sections exist:', requiredSections);

    // Get all existing content sections
    const allContent = await api.content.getAll();
    console.log('Existing content sections:', allContent.map(item => item.section));

    // Create a map of existing sections
    const existingSections = {};
    allContent.forEach(item => {
      existingSections[item.section] = true;
    });

    // Check which required sections are missing
    const missingSections = requiredSections.filter(section => !existingSections[section]);
    console.log('Missing content sections:', missingSections);

    // If no sections are missing, return early
    if (missingSections.length === 0) {
      console.log('All required content sections exist');
      return { success: true, message: 'All required content sections exist' };
    }

    // Create default content for missing sections
    console.log('Creating default content for missing sections:', missingSections);
    const creationResults = await Promise.all(
      missingSections.map(section => createDefaultContent(section))
    );

    console.log('Creation results:', creationResults);

    return {
      success: true,
      message: `Created ${missingSections.length} missing content sections`,
      created: missingSections,
      results: creationResults
    };
  } catch (error) {
    console.error('Error ensuring content sections exist:', error);
    return { success: false, message: error.message, error };
  }
};

/**
 * Creates default content for a specific section
 * @param {string} section - The section name
 * @returns {Promise<Object>} - The created content object
 */
const createDefaultContent = async (section) => {
  try {
    console.log(`Creating default content for section "${section}"`);
    let contentData;

    switch (section) {
      case 'leadership':
        const leadershipData = {
          introduction: 'Meet the dedicated leaders who guide our church.',
          leaders: [
            {
              name: 'Pastor John Doe',
              position: 'Senior Pastor',
              bio: 'Pastor John has been serving our church for over 10 years.',
              image: '/images/SPCT/CHURCH.jpg'
            },
            {
              name: 'Elder Jane Smith',
              position: 'Elder',
              bio: 'Elder Jane oversees our children\'s ministry.',
              image: '/images/SPCT/CHURCH.jpg'
            }
          ]
        };

        contentData = {
          section: 'leadership',
          title: 'Our Leadership',
          content: JSON.stringify(leadershipData)
        };

        console.log('Leadership content data:', contentData);
        console.log('Leadership JSON content:', contentData.content);
        break;

      case 'weekly_schedule':
        const scheduleData = [
          {
            day: 'Sunday',
            events: [
              {
                name: 'Sunday School',
                time: '9:00 AM - 10:00 AM',
                location: 'Education Building'
              },
              {
                name: 'Worship Service',
                time: '10:30 AM - 12:00 PM',
                location: 'Main Sanctuary'
              }
            ]
          },
          {
            day: 'Wednesday',
            events: [
              {
                name: 'Bible Study',
                time: '7:00 PM - 8:30 PM',
                location: 'Fellowship Hall'
              }
            ]
          }
        ];

        contentData = {
          section: 'weekly_schedule',
          title: 'Weekly Schedule',
          content: JSON.stringify(scheduleData)
        };

        console.log('Weekly schedule content data:', contentData);
        console.log('Weekly schedule JSON content:', contentData.content);
        break;

      default:
        contentData = {
          section,
          title: section.charAt(0).toUpperCase() + section.slice(1).replace(/_/g, ' '),
          content: 'Default content for ' + section
        };
        console.log(`Default content data for section "${section}":`, contentData);
    }

    // Create the content
    console.log(`Calling api.content.createOrUpdate for section "${section}"...`);
    try {
      const result = await api.content.createOrUpdate(contentData);
      console.log(`Successfully created content for section "${section}":`, result);
      return result;
    } catch (apiError) {
      console.error(`API error creating content for section "${section}":`, apiError);
      throw apiError;
    }
  } catch (error) {
    console.error(`Error creating default content for section "${section}":`, error);
    throw error;
  }
};
