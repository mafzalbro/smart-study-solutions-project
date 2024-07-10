"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../customHooks/AuthContext';


const NavBar = () => {
  
  const { isLoggedIn } = useAuth()
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();


  return (
    <nav className="bg-background-start dark:bg-gray-900 p-4 shadow-lg text-white font-sans">
      <div className="container mx-auto flex justify-between items-center text-base">
        <Link href='/'>
          <h2 className="text-2xl font-bold cursor-pointer">Code Innovators</h2>
        </Link>
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
        <ul
          className={`${
            isMobileMenuOpen ? 'block' : 'hidden'
          } md:flex md:space-x-4 md:items-center absolute md:static bg-background-start dark:bg-gray-900 top-16 left-0 w-full md:w-auto shadow-lg md:shadow-none p-4 md:p-0`}
        >
          <li>
            <Link href="/" passHref>
              <span className="block md:inline-block hover:text-blue-500 dark:hover:text-blue-300 py-2 md:py-0">Home</span>
            </Link>
          </li>
          <li>
            <Link href="/resources" passHref>
              <span className="block md:inline-block hover:text-blue-500 dark:hover:text-blue-300 py-2 md:py-0">Resources</span>
            </Link>
          </li>
          {isLoggedIn && (
            <>
          <li>
            <Link href="/chat" passHref>
              <span className="block md:inline-block hover:text-blue-500 dark:hover:text-blue-300 py-2 md:py-0">Ask AI</span>
            </Link>
          </li>
            <li>
              <Link href="/dashboard" passHref>
                <span className="block md:inline-block hover:text-blue-500 dark:hover:text-blue-300 py-2 md:py-0">Profile</span>
              </Link>
            </li>
          <li>
            <Link href="/forum" passHref>
              <span className="block md:inline-block hover:text-blue-500 dark:hover:text-blue-300 py-2 md:py-0">Forum</span>
            </Link>
          </li>
            </>
          )}
              {
                pathname.includes('/forum') && <Link href="/forum/submit" passHref>
                <button className="my-8 md:my-0 block md:inline-block py-2 px-4 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600">
                  Add Question
                </button>
              </Link>
              }
          {isLoggedIn ? (
            <li>
              <Link href="/logout" passHref>
                <button className="my-8 md:my-0 block md:inline-block py-2 px-4 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600">
                  Log Out
                </button>
              </Link>
            </li>
          ) : (
            <li>
              <Link href="/login" passHref>
                <button className="my-8 md:my-0 block md:inline-block py-2 px-4 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600">
                  Log In
                </button>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
