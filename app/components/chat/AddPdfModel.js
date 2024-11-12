import React from "react";
import { FaTimes } from "react-icons/fa"; // Importing an icon for the cancel button
import NewChatButton from "./NewChatButton";
import Link from "next/link";
import { BiSolidHappyHeartEyes } from "react-icons/bi";

const AddPdfModel = ({ isOpen, onClose, onCreateNewChat, userChatInfo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-50 backdrop-blur-sm">
      <div className="bg-secondary p-6 rounded-lg shadow-lg w-full max-w-sm mx-4 dark:bg-neutral-800">
        <p className="text-lg text-center">
          <BiSolidHappyHeartEyes
            size={100}
            className="my-2 mb-4 fixed opacity-10 dark:opacity-20"
          />
          Please create a new chat to add a PDF or buy a{" "}
          <Link
            href={"/pricing"}
            className="text-accent-600 dark:text-accent-300 mx-1 hover:underline hover:underline-offset-2"
          >
            membership plan
          </Link>{" "}
          on reasonable price!
        </p>
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-lg ring-1 ring-neutral-300 focus:ring-accent-400 dark:ring-neutral-700 dark:focus:ring-accent-200 flex items-center"
          >
            <FaTimes className="mr-2" /> Cancel
          </button>
          {/* {userChatInfo?.chatOptionsUsed !==2 && <NewChatButton />} */}
          <NewChatButton />
        </div>
      </div>
    </div>
  );
};

export default AddPdfModel;
