// components/AlertMessage.js
import React, { useEffect } from 'react';

const AlertMessage = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  const alertClasses = {
    success: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className={`fixed top-50 right-10 bg-white border border-gray-300 shadow-lg rounded-lg p-4 z-50 ${alertClasses[type]}`}>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default AlertMessage;
