import React from 'react';
import { Link } from 'react-router-dom';
import HowWeServeRenderer from './HowWeServeRenderer';
import WeeklyScheduleRenderer from './WeeklyScheduleRenderer';
import VideoGalleryRenderer from './VideoGalleryRenderer';
import FeaturedEventRenderer from './FeaturedEventRenderer';
import LeadershipRenderer from './LeadershipRenderer';
import HeroSectionRenderer from './HeroSectionRenderer';
import CurrentSeriesRenderer from './CurrentSeriesRenderer';
import SpecialEventsRenderer from './SpecialEventsRenderer';
import CompactEventCalendarRenderer from './CompactEventCalendarRenderer';
import { parseContent, isHtmlContent, truncateHtmlContent } from '../../utils/contentUtils';

/**
 * Factory component that selects the appropriate renderer based on the section
 */
const ContentRendererFactory = ({ section, content, truncate = false, maxLength = 150, contentId = null }) => {
  // Always set truncate to false to display full content
  truncate = false;

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
    case 'hero':
      console.log(`ContentRendererFactory: Using HeroSectionRenderer for section "${section}"`);
      return <HeroSectionRenderer content={parsedContent} backgroundImage={content?.image} />;

    case 'how_we_serve':
      console.log(`ContentRendererFactory: Using HowWeServeRenderer for section "${section}"`);
      return <HowWeServeRenderer content={parsedContent} image={content?.image} />;

    case 'weekly_schedule':
      console.log(`ContentRendererFactory: Using WeeklyScheduleRenderer for section "${section}"`);
      return <WeeklyScheduleRenderer content={parsedContent} />;

    case 'video_gallery':
      console.log(`ContentRendererFactory: Using VideoGalleryRenderer for section "${section}"`);
      return <VideoGalleryRenderer content={parsedContent} />;

    case 'featured_event':
      console.log(`ContentRendererFactory: Using FeaturedEventRenderer for section "${section}"`);
      return <FeaturedEventRenderer content={parsedContent} image={content?.image} />;

    case 'leadership':
      console.log(`ContentRendererFactory: Using LeadershipRenderer for section "${section}"`);
      return <LeadershipRenderer content={parsedContent} />;

    case 'current_series':
    case 'sermon_series':
      console.log(`ContentRendererFactory: Using CurrentSeriesRenderer for section "${section}"`);
      return <CurrentSeriesRenderer content={parsedContent} image={content?.image} />;

    case 'special_events':
    case 'special_event':
      console.log(`ContentRendererFactory: Using SpecialEventsRenderer for section "${section}"`);
      return <SpecialEventsRenderer content={parsedContent} />;

    case 'event_calendar':
      console.log(`ContentRendererFactory: Using CompactEventCalendarRenderer for section "${section}"`);
      return <CompactEventCalendarRenderer content={parsedContent} image={content?.image} />;

    case 'our_story':
      console.log(`ContentRendererFactory: Rendering our_story content for section "${section}"`);
      // For our_story, we can use the default HTML renderer
      if (typeof parsedContent === 'string') {
        return (
          <div className="our-story-content">
            <div dangerouslySetInnerHTML={{ __html: parsedContent }} />
          </div>
        );
      }
      return (
        <div className="our-story-content">
          <p>{JSON.stringify(parsedContent)}</p>
        </div>
      );

    default: {
      // For HTML content, render with dangerouslySetInnerHTML
      if (typeof parsedContent === 'string' && isHtmlContent(parsedContent)) {
        console.log(`ContentRendererFactory: Rendering HTML content for section "${section}"`);

        // Always display full content
        return (
          <div className="html-content">
            <div dangerouslySetInnerHTML={{ __html: parsedContent }} />
          </div>
        );
      }

      // For JSON content that doesn't have a specialized renderer
      if (typeof parsedContent === 'object' && parsedContent !== null) {
        console.log(`ContentRendererFactory: Rendering JSON content for section "${section}"`);

        // Display full JSON content
        return (
          <div className="json-content">
            <pre>
              {JSON.stringify(parsedContent, null, 2)}
            </pre>
          </div>
        );
      }

      // Default case: render as plain text
      console.log(`ContentRendererFactory: Rendering text content for section "${section}"`);

      // Always display full text content
      return (
        <div className="text-content">
          <p>{String(parsedContent || 'Default content for ' + section)}</p>
        </div>
      );
    }
  }
};

export default ContentRendererFactory;
