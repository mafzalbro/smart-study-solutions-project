"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SubmitButton from '../SubmitButton';
import LinkButton from '../LinkButton';

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

  return (
    // <div className={`w-1/4 min-h-screen bg-black p-4 flex flex-col gap-10`}>
    <div className={`w-1/4 border-r-2 border p-4 flex flex-col gap-10`}>
      {loading ? (
        <>
          <Skeleton height={40} width={120} />
          <Skeleton height={20} count={6} />
        </>
      ) : (
        <>
          <h2 className="text-xl mb-4">User Dashboard</h2>
          <Link href="/dashboard/profile">
            <span className={`block py-2 px-4 rounded-lg ${selectedData === 'profile' ? 'bg-blue-500 text-white' : 'text-neutral-400 hover:bg-neutral-200'}`}>
              Update Profile
            </span>
          </Link>
          <Link href="/dashboard/change-password">
            <span className={`block py-2 px-4 rounded-lg ${selectedData === 'change-password' ? 'bg-blue-500 text-white' : 'text-neutral-400 hover:bg-neutral-200'}`}>
              Change Password
            </span>
          </Link>
          <Link href='/dashboard/liked-resources'>
            <span className={`block py-2 px-4 rounded-lg ${selectedData === 'liked-resources' ? 'bg-blue-500 text-white' : 'text-neutral-400 hover:bg-neutral-200'}`}>
              Liked Resources
            </span>
          </Link>
          <Link href='/dashboard/questions'>
            <span className={`block py-2 px-4 rounded-lg ${selectedData === 'questions' ? 'bg-blue-500 text-white' : 'text-neutral-400 hover:bg-neutral-200'}`}>
              Your Questions
            </span>
          </Link>
          <Link href='/dashboard/answers'>
            <span className={`block py-2 px-4 rounded-lg ${selectedData === 'answers' ? 'bg-blue-500 text-white' : 'text-neutral-400 hover:bg-neutral-200'}`}>
              Your Answers
            </span>
          </Link>
          <Link href='/dashboard/catagories'>
            <span className={`block py-2 px-4 rounded-lg ${selectedData === 'catagories' ? 'bg-blue-500 text-white' : 'text-neutral-400 hover:bg-neutral-200'}`}>
              Your Categories
            </span>
          </Link>
          <LinkButton link='/logout' text='Logout'/>
        </>
      )}
    </div>
  );
}
