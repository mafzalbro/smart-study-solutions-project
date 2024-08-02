"use client";

import { useState } from 'react';

const NavBarClient = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div>
      <button
        className="block md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>
      { isMobileMenuOpen && children }
  <span className="hidden md:block">
    { children }
  </span>
    
    </div>
  );
};

export default NavBarClient;
