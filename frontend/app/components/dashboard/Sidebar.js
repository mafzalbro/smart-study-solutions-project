"use client"

import { useState, useEffect } from 'react';
import Spinner from '../Spinner';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    <div className={`w-1/4 h-${height} bg-gray-800 p-4 flex flex-col`}>
      <h2 className="text-xl mb-4 text-white">User Dashboard</h2>
      <Link href="/dashboard/profile">
        <span className='block md:inline-block py-2 px-4 bg-orange-600 text-black rounded-lg shadow-md hover:bg-orange-700 dark:hover:bg-orange-700 dark:bg-orange-600 my-8'>View Profile</span>
      </Link>
      <Link href='/dashboard/settings'>
        <span className='block md:inline-block py-2 px-4 bg-orange-600 text-black rounded-lg shadow-md hover:bg-orange-700 dark:hover:bg-orange-700 dark:bg-orange-600 my-8'>Settings</span>
      </Link>
      <Link href='/dashboard/orders'>
        <span className='block md:inline-block py-2 px-4 bg-orange-600 text-black rounded-lg shadow-md hover:bg-orange-700 dark:hover:bg-orange-700 dark:bg-orange-600 my-8'>Orders</span>
      </Link>
      <div className="flex-1 overflow-y-auto">
        {/* Replace this with your selected data display */}
        {/* <div className="p-4 bg-gray-700 rounded-lg text-white mb-4">
          {selectedData ? (
            <p>{selectedData}</p>
          ) : (
            <p className="text-center">No data selected.</p>
          )}
        </div> */}
      </div>
      {/* {loading && <Spinner />} */}
    </div>
  );
}
