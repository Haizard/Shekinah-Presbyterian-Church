/**
 * Utility functions for handling animations
 */

/**
 * Initialize scroll reveal animations
 * This function adds the 'active' class to elements with the 'reveal' class
 * when they come into view during scrolling
 */
export const initScrollReveal = () => {
  // Get all elements with the 'reveal' class
  const revealElements = document.querySelectorAll('.reveal');
  
  // If IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If the element is in view
        if (entry.isIntersecting) {
          // Add the 'active' class
          entry.target.classList.add('active');
          // Stop observing the element once it's been revealed
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1, // Trigger when at least 10% of the element is visible
      rootMargin: '0px 0px -50px 0px' // Adjust the trigger point
    });
    
    // Observe each reveal element
    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    // Just add the 'active' class to all reveal elements
    revealElements.forEach(element => {
      element.classList.add('active');
    });
  }
};

/**
 * Initialize all animations
 * This function should be called when the page loads
 */
export const initAnimations = () => {
  // Initialize scroll reveal animations
  initScrollReveal();
  
  // Add more animation initializations here as needed
};
