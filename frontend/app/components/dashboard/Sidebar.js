"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Sidebar({ height, selectedData }) {
  const [loading, setLoading] = useState(true);

  // Simulating fetching data
  useEffect(() => {
    setLoading(true);
    // Simulate fetch or other async operations
    setTimeout(() => {
      setLoading(false);
    }, 100); // Simulating loading time
  }, []);

  document.title = 'User Dashboard'
  return (
    <div className={`w-1/4 h-screen bg-gray-800 p-4 flex flex-col`}>
      <h2 className="text-xl mb-4 text-white">User Dashboard</h2>
      <Link href="/dashboard/profile">
        <span className='block md:inline-block py-2 px-4 bg-orange-600 text-black rounded-lg shadow-md hover:bg-orange-700 dark:hover:bg-orange-700 dark:bg-orange-600 my-8 w-full text-center'>Update Profile</span>
      </Link>
      <Link href="/dashboard/change-password">
        <span className='block md:inline-block py-2 px-4 bg-orange-600 text-black rounded-lg shadow-md hover:bg-orange-700 dark:hover:bg-orange-700 dark:bg-orange-600 my-8 w-full text-center'>Change Password</span>
      </Link>

      <Link href='/dashboard/liked-resources'>
        <span className='block md:inline-block py-2 px-4 bg-orange-600 text-black rounded-lg shadow-md hover:bg-orange-700 dark:hover:bg-orange-700 dark:bg-orange-600 my-8 w-full text-center'>Liked Resources</span>
      </Link>
      <Link href='/logout'>
        <span className='block md:inline-block py-2 px-4 bg-orange-600 text-black rounded-lg shadow-md hover:bg-orange-700 dark:hover:bg-orange-700 dark:bg-orange-600 my-8 w-full text-center'>Logout</span>
      </Link>
    </div>
  );
}
