// hooks/useAlert.js
import { useState, useEffect } from 'react';

const useAlert = (initialMessage = '', duration = 5000) => {
  const [alertMessage, setAlertMessage] = useState(initialMessage);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage('');
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [alertMessage, duration]);

  return [alertMessage, setAlertMessage];
};

export default useAlert;
