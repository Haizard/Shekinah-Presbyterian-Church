/**
 * Utility functions for handling content data
 */
import api from '../services/api';

/**
 * Truncate HTML content to a specified length and add ellipsis
 * @param {string} htmlContent - The HTML content to truncate
 * @param {number} maxLength - Maximum length of the truncated content
 * @returns {string} - Truncated HTML content with ellipsis
 */
export const truncateHtmlContent = (htmlContent, maxLength = 150) => {
  if (!htmlContent || typeof htmlContent !== 'string') return '';

  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Get the text content
  const textContent = tempDiv.textContent || tempDiv.innerText || '';

  // Truncate the text content
  if (textContent.length <= maxLength) {
    return htmlContent;
  }

  // Truncate to the specified length
  const truncatedText = `${textContent.substring(0, maxLength).trim()}...`;

  // Return the truncated text as a paragraph
  return `<p>${truncatedText}</p>`;
};

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

      case 'how_we_serve':
        const howWeServeData = {
          areas: [
            {
              title: 'Service Area 1',
              description: 'Describe your first area of ministry and service.',
              icon: 'faHandsHelping'
            },
            {
              title: 'Service Area 2',
              description: 'Describe your second area of ministry and service.',
              icon: 'faUsers'
            },
            {
              title: 'Service Area 3',
              description: 'Describe your third area of ministry and service.',
              icon: 'faChurch'
            },
            {
              title: 'Service Area 4',
              description: 'Describe your fourth area of ministry and service.',
              icon: 'faBookOpen'
            }
          ]
        };

        contentData = {
          section: 'how_we_serve',
          title: 'How We Serve',
          content: JSON.stringify(howWeServeData),
          image: '/images/SPCT/CHURCH.jpg'
        };

        console.log('How We Serve content data:', contentData);
        console.log('How We Serve JSON content:', contentData.content);
        break;

      case 'featured_event':
        const featuredEventData = {
          title: 'Sunday Worship Service',
          date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
          time: '9:00 AM - 12:00 PM',
          location: 'Main Sanctuary',
          description: 'Join us for our weekly worship service. Everyone is welcome!',
          image: '/images/SPCT/CHURCH.jpg'
        };

        contentData = {
          section: 'featured_event',
          title: 'Featured Event',
          content: JSON.stringify(featuredEventData),
          image: '/images/SPCT/CHURCH.jpg'
        };

        console.log('Featured Event content data:', contentData);
        console.log('Featured Event JSON content:', contentData.content);
        break;

      case 'event_calendar':
        const eventCalendarData = {
          introduction: 'Join us for these upcoming events at our church.',
          events: [
            {
              title: 'Sunday Worship Service',
              date: new Date().toISOString().split('T')[0], // Today's date
              startTime: '9:00 AM',
              endTime: '12:00 PM',
              location: 'Main Sanctuary',
              description: 'Weekly worship service'
            },
            {
              title: 'Bible Study',
              date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
              startTime: '6:00 PM',
              endTime: '8:00 PM',
              location: 'Fellowship Hall',
              description: 'Weekly Bible study'
            },
            {
              title: 'Youth Fellowship',
              date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
              startTime: '4:00 PM',
              endTime: '6:00 PM',
              location: 'Youth Center',
              description: 'Youth fellowship meeting'
            }
          ]
        };

        contentData = {
          section: 'event_calendar',
          title: 'Event Calendar',
          content: JSON.stringify(eventCalendarData),
          image: '/images/SPCT/CHURCH.jpg'
        };

        console.log('Event Calendar content data:', contentData);
        console.log('Event Calendar JSON content:', contentData.content);
        break;

      default:
        contentData = {
          section,
          title: section.charAt(0).toUpperCase() + section.slice(1).replace(/_/g, ' '),
          content: `Default content for ${section}`
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
