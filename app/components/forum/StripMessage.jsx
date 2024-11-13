import React, { useState } from "react";
import Link from "next/link";
import { AiOutlineClose } from "react-icons/ai";

const StripeMessage = () => {
  const [isVisible, setIsVisible] = useState(true); // State to control visibility

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 w-full bg-red-700 dark:bg-red-900 text-white py-0 md:py-2 px-4 md:px-6 z-50 flex justify-between items-center shadow-lg rounded-t-xl transition-opacity duration-500 ease-in-out opacity-100"
      style={{ animation: "fadeIn 0.5s ease-in-out" }}
    >
      <span className="text-sm md:text-base font-semibold">
        Teacher's answers are excluded in the free version.
      </span>
      <div className="flex items-center">
        <Link
          href="/pricing"
          className="ml-4 text-blue-200 hover:text-blue-500 hover:underline font-medium transition-all duration-300"
        >
          Buy Membership
        </Link>
        <button
          onClick={handleClose}
          className="ml-4 text-white hover:text-gray-200 transition-all duration-300"
        >
          <AiOutlineClose size={20} /> {/* Close Icon */}
        </button>
      </div>
    </div>
  );
};

export default StripeMessage;
