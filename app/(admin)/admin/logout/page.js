"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import handleLogout from '@/app/(admin)/api/handleLogout';
import Spinner from '@/app/components/Spinner';
import WideLinkButton from '@/app/(admin)/components/admin/WhiteContainer';

const LogoutPage = () => {

  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await handleLogout(router);
        toast.success('You have been logged out successfully.');
      } catch (error) {
        toast.error('Failed to log out. Please try again.');
        console.error('Logout failed:', error.message);
      }
    };

    performLogout();
  }, [router]);

  return (
    // <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 px-4 sm:px-6 lg:px-8">
      // <div className="w-full max-w-md p-6 bg-secondary dark:bg-neutral-800 rounded-lg shadow-lg text-center">
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-6 text-center">
        <h2 className="text-2xl font-bold mb-6 text-primary dark:text-secondary">Redirecting to login page</h2>
        <Spinner />
        <WideLinkButton link='/login' text='Try Login Button'/>
        <ToastContainer />
      </div>
    </div>
  );
};

export default LogoutPage;
