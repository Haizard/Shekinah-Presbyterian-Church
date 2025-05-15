/**
 * Utility functions for migrating content from old formats to new formats
 * These functions can be used to update content in the database
 */

import api from '../services/api';

/**
 * Migrates all content of a specific section to ensure it's in the proper JSON format
 * @param {string} section - The section to migrate (e.g., 'motto', 'featured_event')
 * @returns {Promise<{success: boolean, message: string, migrated: number}>} - Result of the migration
 */
export const migrateContentSection = async (section) => {
  try {
    // Fetch all content for the specified section
    const contents = await api.content.getAllBySection(section);

    if (!contents || contents.length === 0) {
      return {
        success: true,
        message: `No content found for section "${section}"`,
        migrated: 0
      };
    }

    let migratedCount = 0;

    // Process each content item
    for (const content of contents) {
      const migrated = await migrateContentItem(content);
      if (migrated) {
        migratedCount++;
      }
    }

    return {
      success: true,
      message: `Successfully migrated ${migratedCount} of ${contents.length} content items for section "${section}"`,
      migrated: migratedCount
    };
  } catch (error) {
    console.error(`Error migrating content for section "${section}":`, error);
    return {
      success: false,
      message: `Error migrating content: ${error.message}`,
      migrated: 0
    };
  }
};

/**
 * Migrates a single content item to ensure it's in the proper JSON format
 * @param {Object} content - The content item to migrate
 * @returns {Promise<boolean>} - Whether the content was migrated
 */
export const migrateContentItem = async (content) => {
  try {
    // Skip if content is null or undefined
    if (!content || !content.content) {
      return false;
    }

    // Skip if content is already a valid JSON object
    try {
      const parsed = JSON.parse(content.content);
      if (typeof parsed === 'object' && parsed !== null) {
        // Content is already valid JSON, no need to migrate
        return false;
      }
    } catch (e) {
      // Content is not valid JSON, proceed with migration
    }

    // Migrate based on section type
    let migratedContent;

    switch (content.section) {
      case 'motto':
        migratedContent = migrateMottoContent(content.content);
        break;
      case 'featured_event':
        migratedContent = migrateFeaturedEventContent(content.content);
        break;
      default:
        // For other sections, just wrap the content in a simple object
        migratedContent = JSON.stringify({
          content: content.content
        });
    }

    // Update the content in the database
    if (migratedContent) {
      await api.content.update(content._id, {
        ...content,
        content: migratedContent
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error migrating content item ${content._id}:`, error);
    return false;
  }
};

/**
 * Migrates motto content to the proper JSON format
 * @param {string} content - The content to migrate
 * @returns {string} - The migrated content as a JSON string
 */
const migrateMottoContent = (content) => {
  // Default motto data
  const defaultMottoData = {
    mottoText: 'The True Word, The True Gospel, and True Freedom',
    verseReference: 'Matthew 9:35',
    explanation: `
      <p>This motto shapes everything we do. Inspired by the ministry of Jesus—who went through towns and villages teaching, preaching the Gospel of the Kingdom, and healing—we are committed to:</p>
      <ul>
        <li><strong>The True Word</strong> - Teaching the uncompromised Word of God as the foundation of life, discipleship, and mission.</li>
        <li><strong>The True Gospel</strong> - Proclaiming the Good News of Jesus Christ clearly, boldly, and faithfully—calling all people to repentance, faith, and new life.</li>
        <li><strong>True Freedom</strong> - Helping people experience the real freedom found in Christ alone—freedom from sin, fear, brokenness, and spiritual darkness.</li>
      </ul>
    `
  };

  // If content is "Default content for motto", use default data
  if (content === 'Default content for motto') {
    return JSON.stringify(defaultMottoData);
  }

  // Try to extract motto text from the content
  let mottoText = content;
  let explanation = '';

  // If content contains HTML, try to extract the motto text using regex
  if (content.includes('<') && content.includes('>')) {
    // Try to extract heading content
    const headingMatch = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
    if (headingMatch?.[1]) {
      mottoText = headingMatch[1].replace(/<[^>]*>/g, ''); // Remove any nested HTML tags
      explanation = content.replace(headingMatch[0], ''); // Remove the heading from the content
    } else {
      // Try to extract first paragraph content
      const paragraphMatch = content.match(/<p[^>]*>(.*?)<\/p>/i);
      if (paragraphMatch?.[1]) {
        mottoText = paragraphMatch[1].replace(/<[^>]*>/g, ''); // Remove any nested HTML tags
        explanation = content.replace(paragraphMatch[0], ''); // Remove the paragraph from the content
      }
    }
  }

  return JSON.stringify({
    mottoText: mottoText || defaultMottoData.mottoText,
    verseReference: '',
    explanation: explanation || content
  });
};

/**
 * Migrates featured event content to the proper JSON format
 * @param {string} content - The content to migrate
 * @returns {string} - The migrated content as a JSON string
 */
const migrateFeaturedEventContent = (content) => {
  // Get next Sunday for default date
  const getNextSunday = () => {
    const today = new Date();
    const daysUntilSunday = 7 - today.getDay();
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + (daysUntilSunday === 7 ? 0 : daysUntilSunday));
    return nextSunday;
  };

  // Default event data
  const defaultEvent = {
    title: 'Sunday Worship Service',
    description: 'Join us for our weekly worship service with praise, prayer, and powerful teaching from God\'s Word.',
    date: getNextSunday(),
    time: '10:00 AM - 12:00 PM',
    location: 'Main Sanctuary',
    link: '/events',
    buttonText: 'Learn More'
  };

  // If content is "Default content for featured_event", use default data
  if (content === 'Default content for featured_event') {
    return JSON.stringify(defaultEvent);
  }

  // Try to extract event details from the content
  let title = 'Featured Event';
  let description = content;

  // If content contains HTML, try to extract the title and description using regex
  if (content.includes('<') && content.includes('>')) {
    // Try to extract heading content for title
    const headingMatch = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
    if (headingMatch?.[1]) {
      title = headingMatch[1].replace(/<[^>]*>/g, ''); // Remove any nested HTML tags
      description = content.replace(headingMatch[0], ''); // Remove the heading from the content
    } else {
      // Try to extract first paragraph content for description
      const paragraphMatch = content.match(/<p[^>]*>(.*?)<\/p>/i);
      if (paragraphMatch?.[1]) {
        description = paragraphMatch[1].replace(/<[^>]*>/g, ''); // Remove any nested HTML tags
      }
    }
  }

  return JSON.stringify({
    title: title,
    description: description,
    date: defaultEvent.date,
    time: defaultEvent.time,
    location: defaultEvent.location,
    link: '/events',
    buttonText: 'Learn More'
  });
};

/**
 * Migrates all content sections that need migration
 * @returns {Promise<{success: boolean, message: string, results: Object}>} - Results of all migrations
 */
export const migrateAllContent = async () => {
  const sectionsToMigrate = [
    'motto',
    'featured_event',
    // Add other sections that need migration here
  ];

  const results = {};
  let totalMigrated = 0;

  for (const section of sectionsToMigrate) {
    const result = await migrateContentSection(section);
    results[section] = result;
    if (result.success) {
      totalMigrated += result.migrated;
    }
  }

  return {
    success: true,
    message: `Migration completed. Migrated ${totalMigrated} content items across ${sectionsToMigrate.length} sections.`,
    results
  };
};

export default {
  migrateContentSection,
  migrateContentItem,
  migrateAllContent
};
