import React from 'react';
import HowWeServeRenderer from './HowWeServeRenderer';
import WeeklyScheduleRenderer from './WeeklyScheduleRenderer';
import VideoGalleryRenderer from './VideoGalleryRenderer';
import FeaturedEventRenderer from './FeaturedEventRenderer';
import LeadershipRenderer from './LeadershipRenderer';
import { parseContent, isHtmlContent } from '../../utils/contentUtils';

/**
 * Factory component that selects the appropriate renderer based on the section
 */
const ContentRendererFactory = ({ section, content }) => {
  console.log(`ContentRendererFactory: Rendering content for section "${section}"`, {
    contentType: typeof content,
    contentLength: content ? (typeof content === 'string' ? content.length : JSON.stringify(content).length) : 0,
    content: content
  });

  // Parse the content if needed, but only if it's a string
  // This prevents double-parsing issues
  let parsedContent;
  if (typeof content === 'string') {
    parsedContent = parseContent(content);
    console.log(`ContentRendererFactory: Parsed string content for section "${section}"`, {
      parsedType: typeof parsedContent,
      parsedContent: parsedContent
    });
  } else {
    // If it's already an object, use it directly
    parsedContent = content;
    console.log(`ContentRendererFactory: Using object content directly for section "${section}"`, {
      parsedType: typeof parsedContent,
      parsedContent: parsedContent
    });
  }

  // Log the section and content before rendering
  console.log(`ContentRendererFactory: Rendering section "${section}" with content type ${typeof parsedContent}`);

  // Select the appropriate renderer based on the section
  switch (section) {
    case 'how_we_serve':
      console.log(`ContentRendererFactory: Using HowWeServeRenderer for section "${section}"`);
      return <HowWeServeRenderer content={parsedContent} />;

    case 'weekly_schedule':
      console.log(`ContentRendererFactory: Using WeeklyScheduleRenderer for section "${section}"`);
      return <WeeklyScheduleRenderer content={parsedContent} />;

    case 'video_gallery':
      console.log(`ContentRendererFactory: Using VideoGalleryRenderer for section "${section}"`);
      return <VideoGalleryRenderer content={parsedContent} />;

    case 'featured_event':
      console.log(`ContentRendererFactory: Using FeaturedEventRenderer for section "${section}"`);
      return <FeaturedEventRenderer content={parsedContent} />;

    case 'leadership':
      console.log(`ContentRendererFactory: Using LeadershipRenderer for section "${section}"`);
      return <LeadershipRenderer content={parsedContent} />;

    default:
      // For HTML content, render with dangerouslySetInnerHTML
      if (typeof parsedContent === 'string' && isHtmlContent(parsedContent)) {
        console.log(`ContentRendererFactory: Rendering HTML content for section "${section}"`);
        return <div className="html-content" dangerouslySetInnerHTML={{ __html: parsedContent }} />;
      }

      // For JSON content that doesn't have a specialized renderer
      if (typeof parsedContent === 'object' && parsedContent !== null) {
        console.log(`ContentRendererFactory: Rendering JSON content for section "${section}"`);
        return (
          <div className="json-content">
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9em' }}>
              {JSON.stringify(parsedContent, null, 2)}
            </pre>
          </div>
        );
      }

      // Default case: render as plain text
      console.log(`ContentRendererFactory: Rendering text content for section "${section}"`);
      return <div className="text-content">{String(parsedContent)}</div>;
  }
};

export default ContentRendererFactory;
