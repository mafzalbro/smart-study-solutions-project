"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
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
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const { isLoggedIn, user } = useAuth(); // Get isLoggedIn and user from AuthContext
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState('light');
  const pathname = usePathname();
  
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

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

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setDarkMode(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDarkMode ? 'dark' : 'light';
      setDarkMode(defaultTheme);
      document.documentElement.classList.toggle('dark', prefersDarkMode);
      localStorage.setItem('theme', defaultTheme);
    }
  }, []);
  

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDarkMode = () => {
    const newDarkMode = darkMode === 'dark' ? 'light' : 'dark';
    
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode === 'dark');
    localStorage.setItem('theme', newDarkMode);
  };

  const getActiveLinkClass = (linkPath) => {
    return pathname === linkPath ? 'text-blue-500 dark:text-blue-300 font-semibold' : '';
  };

    useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Only update scroll direction if scroll position is greater than 300 pixels
      if (currentScrollTop > 300) {
        if (currentScrollTop > lastScrollTop) {
          setScrollDirection('down');
        } else {
          setScrollDirection('up');
        }
      }

      // Update lastScrollTop, ensuring it's never negative
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop]);


  
    useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Only update scroll direction if scroll position is greater than 300 pixels
      if (currentScrollTop > 300) {
        if (currentScrollTop > lastScrollTop) {
          setScrollDirection('down');
        } else {
          setScrollDirection('up');
        }
      }

      // Update lastScrollTop, ensuring it's never negative
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop]);



  if (loading) {
    return (
      <nav
      className={`sticky top-0 z-50 backdrop-blur-sm bg-secondary dark:bg-neutral-800 p-4 shadow-lg text-primary dark:text-secondary bg-opacity-80 transition-transform ${
        scrollDirection === 'down' ? 'translate-y-[-100%]' : 'translate-y-0'
      }`}
    >
        <div className="container mx-auto flex justify-between items-center">
          <Skeleton width={100} height={30} />
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
    <nav
      className={`sticky top-0 z-50 backdrop-blur-sm bg-secondary dark:bg-neutral-800 p-4 shadow-lg text-primary dark:text-secondary bg-opacity-80 transition-transform ${
        scrollDirection === 'down' ? 'translate-y-[-100%]' : 'translate-y-0'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h2 className="text-2xl font-bold cursor-pointer">
            <StylishSpan>PU</StylishSpan> Verse
          </h2>
        </Link>
        <div className="flex items-center">
          <ul
            ref={mobileMenuRef}
            className={`${
              isMobileMenuOpen ? 'block z-0' : 'hidden'
            } md:flex md:space-x-6 p-6 md:p-0 md:items-center absolute md:static bg-secondary dark:bg-neutral-800 top-16 left-0 w-full md:w-auto shadow-lg md:shadow-none text-center`}
          >
            <li>
              <Link href="/" passHref>
                <span className={`inline-block relative group py-2 md:py-0 ${getActiveLinkClass('/')}`}>
                  Home
                  <span className="block h-0.5 bg-link-hover absolute left-0 bottom-0 w-0 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </li>
            <li>
              <Link href="/resources" passHref>
                <span className={`inline-block relative group py-2 md:py-0 ${getActiveLinkClass('/resources')}`}>
                  Resources
                  <span className="block h-0.5 bg-link-hover absolute left-0 bottom-0 w-0 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </li>
            <li>
              <Link href="/forum" passHref>
                <span className={`inline-block relative group py-2 md:py-0 ${getActiveLinkClass('/forum')}`}>
                  Forum
                  <span className="block h-0.5 bg-link-hover absolute left-0 bottom-0 w-0 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </li>
            {isLoggedIn && (
              <li>
                <Link href="/chat" passHref>
                  <span className={`inline-block relative group py-2 md:py-0 ${getActiveLinkClass('/chat')}`}>
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
            <div ref={dropdownRef} className="relative ml-4">
              <div
                className="cursor-pointer w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-neutral-800"
                onClick={handleProfileClick}
              >
                {user && user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle size={40} />
                )}
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg py-2 z-50">
                  <Link href="/dashboard" passHref>
                    <span className="block px-4 py-2 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                      Dashboard
                    </span>
                  </Link>
                  <Link href="/logout" passHref>
                    <span className="block px-4 py-2 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700">
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
            className="ml-4 p-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg focus:outline-none"
          >
            {darkMode === 'dark' ? <FiSun className="text-yellow-500" /> : <FiMoon className="text-neutral-800 dark:text-neutral-200" />}
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
