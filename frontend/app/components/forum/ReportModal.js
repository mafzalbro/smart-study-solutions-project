import React from 'react';

const ReportModal = ({ onClose, onSubmit, onChange, value }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-5">Report Question</h2>
        <textarea
          className="w-full h-40 border rounded-md p-2 mb-3 focus:ring-orange-500 focus:ring-2 focus:border-none outline-none max-h-80"
          placeholder="Describe why you are reporting this question..."
          onChange={onChange}
          value={value}
        ></textarea>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md mr-2"
            onClick={onSubmit}
          >
            Submit Report
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
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
