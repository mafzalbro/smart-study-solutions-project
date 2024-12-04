"use client";

import Modal from "@/app/components/Modal";
import { useState } from "react";

export default function DeleteConfirmationModal({ userFullName, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const handleDelete = () => {
    if (confirmationText === userFullName) {
      onDelete();
      setIsOpen(false);
    } else {
      alert("Please type your full name correctly to confirm.");
    }
  };

  return (
    <div>
      {/* Delete Button */}
      <button
        className="px-4 py-2 bg-red-600 text-white  rounded-lg hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-700"
        onClick={() => setIsOpen(true)}
      >
        Delete Your Account
      </button>

      {/* Modal */}
      {isOpen && (
        <Modal>
          {/* <div className="fixed z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg text-wrap"> */}
          <div className="relative p-6">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl dark:hover:text-gray-300 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>

            {/* Modal Content */}
            <h2 className="text-lg font-semibold mb-4 dark:text-white">
              Are you absolutely sure?
            </h2>
            <p className="text-sm text-wrap text-red-500">
              This action <strong>cannot</strong> be undone. This will
              permanently delete your account and all associated data.
            </p>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Please type <strong>{userFullName}</strong> to confirm.
            </p>

            {/* Input for Confirmation */}
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="w-full mt-3 px-3 py-2 border dark:bg-neutral-900 dark:text-white dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-lg"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600  rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600  rounded-lg text-white hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
          {/* </div> */}
        </Modal>
      )}
    </div>
  );
}
