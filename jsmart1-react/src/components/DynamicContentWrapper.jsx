import React from 'react';
import DynamicContent from './DynamicContent';
import DynamicContentOptimized from './DynamicContentOptimized';

/**
 * A wrapper component that decides whether to use the original DynamicContent
 * or the optimized version based on a feature flag.
 * 
 * This allows for an easy transition between implementations without changing
 * all component imports across the application.
 */
const DynamicContentWrapper = (props) => {
  // Feature flag to control which implementation to use
  // Set to true to use the optimized version
  const useOptimizedVersion = true;
  
  if (useOptimizedVersion) {
    return <DynamicContentOptimized {...props} />;
  } else {
    return <DynamicContent {...props} />;
  }
};

export default DynamicContentWrapper;
