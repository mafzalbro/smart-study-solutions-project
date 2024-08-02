"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/customHooks/AuthContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const NavBar = () => {
  const { isLoggedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const loadAuth = async () => {
      if (attempts < 3) {
        try {
          // Simulate an async call to check authentication
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setLoading(false);
        } catch (error) {
          setAttempts((prev) => prev + 1);
        }
      } else {
        setLoading(false);
      }
    };

    loadAuth();
  }, [attempts]);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (loading) {
    return (
      <nav className="bg-secondary dark:bg-neutral-800 p-4 shadow-lg text-primary dark:text-secondary">
        <div className="container mx-auto flex justify-between items-center">
          <Skeleton width={200} height={30} />
          <div className="flex space-x-6 items-center">
            <Skeleton width={80} height={30} />
            <Skeleton width={80} height={30} />
            <Skeleton width={80} height={30} />
            <Skeleton circle={true} height={40} width={40} />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-secondary dark:bg-neutral-800 p-4 shadow-lg text-primary dark:text-secondary">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h2 className="text-2xl font-bold cursor-pointer">Code <span className='text-accent-500'>Innovators</span></h2>
        </Link>
        <div className="flex items-center">
        <ul
            className={`${
              isMobileMenuOpen ? 'block' : 'hidden'
            } md:flex md:space-x-6 md:items-center absolute md:static bg-secondary dark:bg-neutral-800 top-16 left-0 w-full md:w-auto shadow-lg md:shadow-none`}
          >
            <li>
              <Link href="/" passHref>
                <span className="inline-block relative group py-2 md:py-0">
                  Home
                  <span className="block h-0.5 bg-link-hover absolute left-0 bottom-0 w-0 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </li>
            <li>
              <Link href="/resources" passHref>
                <span className="inline-block relative group py-2 md:py-0">
                  Resources
                  <span className="block h-0.5 bg-link-hover absolute left-0 bottom-0 w-0 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </li>
            <li>
              <Link href="/forum" passHref>
                <span className="inline-block relative group py-2 md:py-0">
                  Forum
                  <span className="block h-0.5 bg-link-hover absolute left-0 bottom-0 w-0 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </li>
            {isLoggedIn && (
              <>
                <li>
                  <Link href="/chat" passHref>
                    <span className="inline-block relative group py-2 md:py-0">
                      Ask AI
                      <span className="block h-0.5 bg-link-hover absolute left-0 bottom-0 w-0 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </li>
              </>
            )}
            {pathname.includes('/forum') && (
              <Link href="/forum/submit" passHref>
                <button className="my-4 md:my-0 py-2 px-4 bg-link text-white rounded-lg shadow-md hover:bg-link-hover dark:bg-link-hover dark:hover:bg-link">
                  Add Question
                </button>
              </Link>
            )}
          </ul>
          
          {isLoggedIn ? (
            <div className="relative ml-4">
              <div
                className="cursor-pointer w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-800"
                onClick={handleProfileClick}
              >
                <img
                  src="/next.svg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2">
                  <Link href="/dashboard" passHref>
                    <span className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Dashboard
                    </span>
                  </Link>
                  <Link href="/logout" passHref>
                    <span className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Logout
                    </span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" passHref className='ml-6'>
              <button className="my-4 md:my-0 py-2 px-4 bg-link text-white rounded-lg shadow-md hover:bg-link-hover dark:bg-link-hover dark:hover:bg-link">
                Log In
              </button>
            </Link>
          )}
          <button
        className="block md:hidden ml-4"
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
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
