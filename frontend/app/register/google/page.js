"use client";

import { useEffect } from 'react';

const GoogleLogin = () => {
  useEffect(() => {
    // Redirect to the backend's Google OAuth endpoint
    const googleAuthUrl = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/google`;
    window.location.href = googleAuthUrl;
  }, []);

  return <div className='flex h-screen justify-center items-center'>Redirecting to Google...</div>;
};

export default GoogleLogin;
