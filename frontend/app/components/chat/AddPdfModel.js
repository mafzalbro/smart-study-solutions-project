import React from 'react';
import NewChatButton from './NewChatButton';

const AddPdfModel = ({ isOpen, onClose, onCreateNewChat }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg">
        <p>Please create a new chat to add a PDF.</p>
        <div className="mt-4 flex justify-between">
          <NewChatButton />
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPdfModel;
