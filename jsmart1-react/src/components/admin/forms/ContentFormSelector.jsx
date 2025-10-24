import React from 'react';
import WeeklyScheduleForm from './WeeklyScheduleForm';
import VideoGalleryForm from './VideoGalleryForm';
import FeaturedEventForm from './FeaturedEventForm';
import LeadershipForm from './LeadershipForm';
import HowWeServeForm from './HowWeServeForm';
import SermonSeriesForm from './SermonSeriesForm';
import HeroSectionForm from './HeroSectionForm';
import AboutUsForm from './AboutUsForm';
import OurStoryForm from './OurStoryForm';
import OurMissionForm from './OurMissionForm';
import OurVisionForm from './OurVisionForm';
import OurMottoForm from './OurMottoForm';
import OurBeliefsForm from './OurBeliefsForm';
import CurrentSeriesForm from './CurrentSeriesForm';
import SpecialEventsForm from './SpecialEventsForm';
import EventCalendarForm from './EventCalendarForm';
import '../../../styles/admin/SpecializedForms.css';

const ContentFormSelector = ({ section, initialData, onSubmit }) => {
  // Render the appropriate form based on the section
  switch (section) {
    case 'hero':
      return <HeroSectionForm initialData={initialData} onSubmit={onSubmit} />;

    case 'about':
      return <AboutUsForm initialData={initialData} onSubmit={onSubmit} />;

    case 'story':
      return <OurStoryForm initialData={initialData} onSubmit={onSubmit} />;

    case 'mission':
      return <OurMissionForm initialData={initialData} onSubmit={onSubmit} />;

    case 'vision':
      return <OurVisionForm initialData={initialData} onSubmit={onSubmit} />;

    case 'motto':
      return <OurMottoForm initialData={initialData} onSubmit={onSubmit} />;

    case 'beliefs':
      return <OurBeliefsForm initialData={initialData} onSubmit={onSubmit} />;

    case 'weekly_schedule':
      return <WeeklyScheduleForm initialData={initialData} onSubmit={onSubmit} />;

    case 'video_gallery':
      return <VideoGalleryForm initialData={initialData} onSubmit={onSubmit} />;

    case 'featured_event':
      return <FeaturedEventForm initialData={initialData} onSubmit={onSubmit} />;

    case 'leadership':
      return <LeadershipForm initialData={initialData} onSubmit={onSubmit} />;

    case 'how_we_serve':
      return <HowWeServeForm initialData={initialData} onSubmit={onSubmit} />;

    case 'current_series':
      return <CurrentSeriesForm initialData={initialData} onSubmit={onSubmit} />;

    case 'special_events':
      return <SpecialEventsForm initialData={initialData} onSubmit={onSubmit} />;

    case 'event_calendar':
      return <EventCalendarForm initialData={initialData} onSubmit={onSubmit} />;

    case 'sermon_series':
      return <SermonSeriesForm initialData={initialData} onSubmit={onSubmit} />;

    // Default form for other content types
    default:
      return (
        <div className="default-content-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={initialData?.title || ''}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              defaultValue={initialData?.content || ''}
              rows="10"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
            />
            {initialData?.image && (
              <div className="image-preview">
                <img src={initialData.image} alt={initialData.title} />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Save Content
            </button>
          </div>
        </div>
      );
  }
};

export default ContentFormSelector;
