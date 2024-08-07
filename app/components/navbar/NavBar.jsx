"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FiX, FiMoon, FiSun } from 'react-icons/fi';
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/customHooks/AuthContext';
import Skeleton from 'react-loading-skeleton';
import { ToastContainer } from 'react-toastify';

import 'react-loading-skeleton/dist/skeleton.css';
import StylishSpan from '../StylishSpan';

const NavBar = () => {
  let { isLoggedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState('dark');
  const pathname = usePathname();
  
  useEffect(() => {
    isLoggedIn = localStorage.getItem('isLoggedIn') || 'false';
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

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      localStorage.setItem('theme', 'dark')
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  if (loading) {
    return (
      <nav className="bg-secondary p-4 dark:bg-neutral-800 shadow-lg text-primary dark:text-secondary">
        <div className="container mx-auto flex justify-between items-center">
          <Skeleton width={200} height={30} />
          <div className="space-x-6 items-center hidden md:flex">
            <Skeleton width={80} height={30} />
            <Skeleton width={80} height={30} />
            <Skeleton width={80} height={30} />
            <Skeleton circle={true} height={40} width={40} />
            <Skeleton circle={true} height={30} width={30} />
          </div>
          <div className="md:hidden flex items-center gap-4">
            <Skeleton circle={true} height={40} width={40} />
            <Skeleton circle={true} height={30} width={30} />
            <Skeleton height={20} width={30} />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-secondary dark:bg-neutral-800 p-4 shadow-lg text-primary dark:text-secondary">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h2 className="text-2xl font-bold cursor-pointer">
            Code <StylishSpan>Boss</StylishSpan>
          </h2>
        </Link>
        <div className="flex items-center">
          <ul
            className={`${
              isMobileMenuOpen ? 'block z-50' : 'hidden'
            } md:flex md:space-x-6 p-6 md:p-0 md:items-center absolute md:static bg-secondary dark:bg-neutral-800 top-16 left-0 w-full md:w-auto shadow-lg md:shadow-none text-center`}
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
              <li>
                <Link href="/chat" passHref>
                  <span className="inline-block relative group py-2 md:py-0">
                    Ask AI
                    <span className="block h-0.5 bg-link-hover absolute left-0 bottom-0 w-0 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </Link>
              </li>
            )}
            {pathname.includes('/forum') && (
              <li>
                <Link href="/forum/submit" passHref>
                  <button className="my-4 md:my-0 py-2 px-4 bg-link text-white rounded-lg shadow-md hover:bg-link-hover dark:bg-link-hover dark:hover:bg-link">
                    Add Question
                  </button>
                </Link>
              </li>
            )}
          </ul>
          {isLoggedIn ? (
            <div className="relative ml-4">
              <div
                className="cursor-pointer w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-800"
                onClick={handleProfileClick}
              >
                <FaUserCircle size={40} />
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
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
            <Link href="/login" passHref>
              <button className="ml-4 py-2 px-4 bg-link text-white rounded-lg shadow-md hover:bg-link-hover dark:bg-link-hover dark:hover:bg-link">
                Log In
              </button>
            </Link>
          )}
          <button
            onClick={toggleDarkMode}
            className="ml-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg focus:outline-none"
          >
            {darkMode ? <FiSun className="text-yellow-500" /> : <FiMoon className="text-gray-800 dark:text-gray-200" />}
          </button>
          <button
            className="block md:hidden ml-4"
            onClick={handleMobileMenuToggle}
          >
            {isMobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <HiOutlineMenuAlt3 className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
