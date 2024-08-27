import React from 'react';

const ReportModal = ({ onClose, onSubmit, onChange, value }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-neutral-800 p-5 rounded-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3">
        <h2 className="text-xl font-bold text-secondary mb-5">Report Question</h2>
        <textarea
          className="w-full h-40 border-none rounded-md p-2 mb-3 bg-neutral-900 text-secondary focus:ring-accent-500 focus:ring-2 focus:border-none outline-none max-h-80"
          placeholder="Describe why you are reporting this question..."
          onChange={onChange}
          value={value}
        ></textarea>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-red-600 text-secondary rounded-full hover:bg-red-700 disabled:bg-red-400"
            disabled={value === ''}
            onClick={onSubmit}
          >
            Submit Report
          </button>
          <button
            className="px-4 py-2 bg-neutral-700 text-secondary rounded-full hover:bg-neutral-600"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
