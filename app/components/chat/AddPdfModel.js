import React from 'react';
import { FaTimes } from 'react-icons/fa'; // Importing an icon for the cancel button
import NewChatButton from './NewChatButton';

const AddPdfModel = ({ isOpen, onClose, onCreateNewChat }) => {
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-50">
      <div className="bg-neutral-900 text-secondary p-6 rounded-lg shadow-lg w-full max-w-sm mx-4 dark:bg-neutral-800">
        <p className="text-lg">Please create a new chat to add a PDF.</p>
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-lg ring-1 ring-neutral-700 focus:ring-accent-200 flex items-center"
          >
            <FaTimes className="mr-2" /> Cancel
          </button>
          <NewChatButton />
        </div>
      </div>
    </div>
  );
};

export default AddPdfModel;
