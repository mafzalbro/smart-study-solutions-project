"use client";

import { removeUserCacheHistory } from '@/app/utils/caching';
import { useEffect } from 'react';

const GoogleLogin = () => {
  useEffect(() => {
    removeUserCacheHistory()
    // Redirect to the backend's Google OAuth endpoint
    const googleAuthUrl = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/google`;
    window.location.replace(googleAuthUrl)
  }, []);
  return <div className='flex h-screen justify-center items-center'>Redirecting to Google...</div>;
};

export default GoogleLogin;
