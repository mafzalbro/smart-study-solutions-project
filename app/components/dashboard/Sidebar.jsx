"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import LinkButton from '../LinkButton';
import { usePathname } from 'next/navigation';
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from 'react-icons/md';

export default function Sidebar({ height }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); 
  const [loading, setLoading] = useState(true);
  const path = usePathname()

  const selectedData = path.split('dashboard/')[1]

  // Simulating fetching data
  useEffect(() => {
    setLoading(true);
    // Simulate fetch or other async operations
    setTimeout(() => {
      setLoading(false);
    }, 100); // Simulating loading time
    // toggleSidebar()
  }, [path]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };


  return (
    // <div className={`w-1/4 min-h-screen bg-black p-4 flex flex-col gap-10`}>
    // -ml-96
    // -translate-x-96
    <>
    <div className={`w-0 overflow-hidden p-0 md:w-1/3 bg-neutral-50 md:bg-transparent dark:bg-accent-800 dark:md:bg-transparent ${!isSidebarVisible ? 'w-0 overflow-hidden p-0 ': 'overflow-auto p-4 fixed md:relative h-full md:h-[100vh] md:w-1/3 w-full z-20'} md:w-1/4 md:border-r-2 md:dark:border-accent-900 md:p-4 flex flex-col gap-10 transition-all ease-in-out duration-100`}>
      {(loading && isSidebarVisible) ? (
        <>
          <Skeleton height={40} width={120} />
          <Skeleton height={40} count={6} className='mb-10'/>
        </>
      ) : (
        <>
          <h2 className="text-xl p-4"><Link href='/dashboard'>User Dashboard</Link></h2>
          <Link href="/dashboard/profile">
            <span className={`block py-2 px-4 rounded-lg ${selectedData === 'profile' ? 'bg-accent-500 text-white' : 'text-neutral-400 hover:bg-neutral-50 dark:hover:bg-accent-900'}`}>
              Update Profile
            </span>
          </Link>
          <Link href="/dashboard/change-password">
            <span className={`block py-2 px-4 rounded-lg ${selectedData === 'change-password' ? 'bg-accent-500 text-white' : 'text-neutral-400 hover:bg-neutral-50 dark:hover:bg-accent-900'}`}>
              Change Password
            </span>
          </Link>
          <Link href='/dashboard'>
            <span className={`block py-2 px-4 rounded-lg ${selectedData === '' ? 'bg-accent-500 text-white' : 'text-neutral-400 hover:bg-neutral-50 dark:hover:bg-accent-900'}`}>
              Liked Resources
            </span>
          </Link>
          <Link href='/dashboard'>
            <span className={`block py-2 px-4 rounded-lg ${selectedData === '' ? 'bg-accent-500 text-white' : 'text-neutral-400 hover:bg-neutral-50 dark:hover:bg-accent-900'}`}>
              Your Questions
            </span>
          </Link>
          <Link href='/dashboard'>
            <span className={`block py-2 px-4 rounded-lg ${selectedData === '' ? 'bg-accent-500 text-white' : 'text-neutral-400 hover:bg-neutral-50 dark:hover:bg-accent-900'}`}>
              Your Answers
            </span>
          </Link>
          <Link href='/dashboard/catagories'>
            <span className={`block py-2 px-4 rounded-lg ${selectedData === 'catagories' ? 'bg-accent-500 text-white' : 'text-neutral-400 hover:bg-neutral-50 dark:hover:bg-accent-900'}`}>
              Your Categories
            </span>
          </Link>
          <LinkButton link='/logout' text='Logout'/>
        </>
      )}
    </div>
    <button onClick={toggleSidebar} className={`fixed transition-all ease-in-out duration-100 rounded-full m-4 p-2 bg-accent-50 z-20 text-primary ${!isSidebarVisible ? 'left-1' : 'left-[45%]'} md:hidden`}>
      {isSidebarVisible ? <MdOutlineArrowBackIosNew /> : <MdOutlineArrowForwardIos />}
    </button>

    </>
  );
}
