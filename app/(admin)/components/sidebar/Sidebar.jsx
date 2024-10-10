"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { usePathname } from 'next/navigation';

export default function Sidebar({ height }) {
  const [loading, setLoading] = useState(true);
  const path = usePathname();
  const selectedData = path.split('admin/')[1] ? path.split('admin/')[1] : 'admin';
  const restrictedPaths = ['/login', '/logout']
  const isRestrictedPath = () => restrictedPaths.some(restrictedPath => path.includes(restrictedPath))

  // Ref for the scroll container
  // const scrollRef = useRef(null);
  // let isDragging = false;
  // let startPos = 0;
  // let scrollLeft = 0;

  // Simulating fetching data
  useEffect(() => {
    setLoading(true);
    // Simulate fetch or other async operations
    setTimeout(() => {
      setLoading(false);
    }, 100); // Simulating loading time
  }, [path]);

  const sidebarItems = [
    { label: 'Home', href: '/admin', key: 'admin' },
    { label: 'Users', href: '/admin/users', key: 'users' },
    { label: 'Contacts', href: '/admin/contacts', key: 'contacts' },
    { label: 'Resources', href: '/admin/resources', key: 'resources' },
    { label: 'Forum', href: '/admin/forum', key: 'forum' },
  ];


  // // Handle mouse down event for drag
  // const handleMouseDown = (e) => {
  //   isDragging = true;
  //   startPos = e.pageX - scrollRef.current.offsetLeft;
  //   scrollLeft = scrollRef.current.scrollLeft;
  // };

  // // Handle mouse leave event to stop drag
  // const handleMouseLeave = () => {
  //   isDragging = false;
  // };

  // // Handle mouse up event to stop drag
  // const handleMouseUp = () => {
  //   isDragging = false;
  // };

  // // Handle mouse move event to scroll
  // const handleMouseMove = (e) => {
  //   if (!isDragging) return;
  //   e.preventDefault();
  //   const x = e.pageX - scrollRef.current.offsetLeft;
  //   const walk = (x - startPos) * 2; // Adjust scrolling speed
  //   scrollRef.current.scrollLeft = scrollLeft - walk;
  // };

  if(!isRestrictedPath())
  return (
    <>
      <div
        // ref={scrollRef}
        className={`md:sticky md:top-0 md:h-screen md:flex-col md:gap-4 flex flex-row gap-2 md:p-4 md:w-1/4 overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide rounded-lg bg-neutral-200 dark:bg-neutral-800 md:bg-transparent md:dark:bg-transparent my-8 w-[90vw] mx-auto md:mx-0 md:my-0 pl-2 py-2`}
        // onMouseDown={handleMouseDown}
        // onMouseLeave={handleMouseLeave}
        // onMouseUp={handleMouseUp}
        // onMouseMove={handleMouseMove}
      >
        {(loading) ? (
          <>
          <div className='hidden md:block'>
            {/* <Skeleton height={40} width={'80vw'} className='mx-auto mr-1' /> */}
            <Skeleton height={40} count={6} className='mb-10' />
          </div>
          <div className='md:hidden flex flex-row'>
            <Skeleton height={40} width={80} />
            <Skeleton height={40} width={100} />
            <Skeleton height={40} width={120} />
          </div>
          </>
        ) : (
          <div className='flex md:flex-col'>
            {/* <h2>Admin Dashbaord</h2> */}
            {sidebarItems.map((item) => (
              <Link key={item.key} href={item.href}>
                <span className={`block py-2 px-4 mr-2 md:mr-0 md:my-2 rounded-lg ${selectedData.includes(item.key) ? 'bg-accent-500 text-secondary' : 'bg-secondary dark:bg-neutral-700 text-neutral-400 hover:bg-neutral-50 dark:hover:text-secondary dark:hover:bg-accent-700 md:bg-transparent md:dark:bg-transparent'}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
