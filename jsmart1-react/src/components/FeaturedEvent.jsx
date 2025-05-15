import React, { lazy, Suspense } from 'react';
import DynamicContent from './DynamicContent';
import '../styles/FeaturedEvent.css';

// Import the FeaturedEventRenderer component
const FeaturedEventRenderer = lazy(() => import('./structured/FeaturedEventRenderer'));

const FeaturedEvent = () => {
  return (
    <div className="featured-event">
      <DynamicContent
        section="featured_event"
        fallback={null} // No fallback - show nothing if no data
        showContent={false} // Don't use the default content rendering
        renderContent={(content) => (
          <Suspense fallback={<div>Loading event...</div>}>
            <FeaturedEventRenderer
              content={content.content}
              image={content.image}
            />
          </Suspense>
        )}
      />
    </div>
  );
};

export default FeaturedEvent;
