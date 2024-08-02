// components/SubmitButton.js

import React from 'react';

const SubmitButton = ({ onClick, disabled, processing }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-2.5 px-4 rounded-lg shadow-md transition-colors duration-300 ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent-600 text-white hover:bg-accent-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || processing}
    >
      {processing ? 'Processing...' : 'Submit'}
    </button>
  );
};

export default SubmitButton;
