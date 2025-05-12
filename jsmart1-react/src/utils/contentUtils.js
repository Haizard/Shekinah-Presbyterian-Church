/**
 * Utility functions for handling content data
 */

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
