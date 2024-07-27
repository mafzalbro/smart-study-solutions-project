import { useEffect } from 'react';

const useGlobalEventListener = (callback, events = ['click'], element = window) => {
  useEffect(() => {
    // Ensure the element is a valid target
    if (!element || !element.addEventListener) {
      return;
    }

    // Define the event handler
    const eventHandler = (event) => {
      const target = event.target;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.tagName === 'SPAN') {
        callback(event);
      }
    };

    // Attach the event listeners for all specified events
    events.forEach(eventType => {
      element.addEventListener(eventType, eventHandler);
    });

    // Cleanup function to remove the event listeners
    return () => {
      events.forEach(eventType => {
        element.removeEventListener(eventType, eventHandler);
      });
    };
  }, [callback, events, element]);
};

export default useGlobalEventListener;
