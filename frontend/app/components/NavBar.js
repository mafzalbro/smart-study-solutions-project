"use client"
import Link from 'next/link';
import { useState } from 'react';

const NavBar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <nav className="bg-background-start dark:bg-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h2 className="text-2xl font-bold">NavBar</h2>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-lg hover:text-blue-500 dark:hover:text-blue-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="/chat" className="text-lg hover:text-blue-500 dark:hover:text-blue-300">
              Chat Home
            </Link>
          </li>
          <li>
            <Link href="/chat/test" className="text-lg hover:text-blue-500 dark:hover:text-blue-300">
              Test API
            </Link>
          </li>
          <li>
            <Link href="/login" className="text-lg hover:text-blue-500 dark:hover:text-blue-300">
              Log In
            </Link>
          </li>
        </ul>
        <button
          onClick={toggleDarkMode}
          className="ml-4 py-2 px-4 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
