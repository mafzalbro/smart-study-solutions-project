// components/SubmitButton.js

import React from 'react';
import { SyncLoader, BounceLoader, PuffLoader } from 'react-spinners';

const SubmitButton = ({ onClick, disabled, processing, width}) => {
  return (
    <button
      onClick={onClick}
      className={`${width ? width : 'w-full'} py-2.5 px-4 rounded-lg shadow-md transition-colors duration-300 ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent-600 text-white hover:bg-accent-700'} ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
      disabled={disabled || processing}
    >
      {processing ? <PuffLoader color="#ffffff" size={18} className='disabled:text-white opacity-100'/> : 'Submit'}
    </button>
  );
};

export default SubmitButton;
