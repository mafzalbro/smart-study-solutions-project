"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/check-auth`, {
          credentials: 'include',
        });
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        setIsLoggedIn(false);
        router.push('/login');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-background-start dark:bg-gray-900 p-4 shadow-lg text-white font-sans">
      <div className="container mx-auto flex justify-between items-center">
        <h2 className="text-2xl font-bold">NavBar</h2>
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
              <span className="block md:inline-block text-lg hover:text-blue-500 dark:hover:text-blue-300 py-2 md:py-0">Home</span>
            </Link>
          </li>
          <li>
            <Link href="/resources" passHref>
              <span className="block md:inline-block text-lg hover:text-blue-500 dark:hover:text-blue-300 py-2 md:py-0">Resources</span>
            </Link>
          </li>
          <li>
            <Link href="/update-profile" passHref>
              <span className="block md:inline-block text-lg hover:text-blue-500 dark:hover:text-blue-300 py-2 md:py-0">Profile</span>
            </Link>
          </li>
          <li>
            <Link href="/chat" passHref>
              <span className="block md:inline-block text-lg hover:text-blue-500 dark:hover:text-blue-300 py-2 md:py-0">Chat Home</span>
            </Link>
          </li>
          <li>
            <Link href="/chat/test" passHref>
              <span className="block md:inline-block text-lg hover:text-blue-500 dark:hover:text-blue-300 py-2 md:py-0">Test API</span>
            </Link>
          </li>
          {isLoggedIn ? (
            <li>
              <button
                onClick={handleLogout}
                className="block md:inline-block py-2 px-4 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
              >
                Log Out
              </button>
            </li>
          ) : (
            <li>
              <Link href="/login" passHref>
                <button className="block md:inline-block py-2 px-4 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600">
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
