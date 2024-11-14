"use client";

import { useState } from "react";
import Link from "next/link";

const AnnouncementStripe = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    isVisible && (
      <div className="bg-gradient-to-r from-accent-600 to-accent-500 dark:bg-gradient-to-r dark:from-accent-600 dark:to-accent-800 text-center md:text-left text-white p-5 md:p-6 md:rounded-lg shadow-lg mt-8 relative">
        <div className="flex flex-col my-10 md:gap-10 items-center justify-between">
          <div className="flex flex-col items-start md:items-center">
            <h2 className="text-2xl font-semibold mb-2 md:mb-0">
              📢 Hey Students! Need help or have materials to upload?
            </h2>
            <p className="text-lg mt-2 md:mt-0 ml-0 md:ml-4">
              If you have any queries or wish to upload study material, feel
              free to reach out to us.
            </p>
          </div>
          <Link
            href="/contact"
            className="mt-4 md:mt-0 text-lg font-semibold text-secondary bg-accent-900 dark:bg-accent-500 hover:bg-accent-800 py-2 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Contact Us
          </Link>
        </div>
        <div className="mt-4 text-sm text-center">
          <p>We are here to help you, always!</p>
        </div>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-white bg-transparent hover:bg-accent-800 rounded-full p-2 transition-all duration-300"
          aria-label="Close announcement"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    )
  );
};

export default AnnouncementStripe;
