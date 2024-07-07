"use client";

import { useEffect } from 'react';

const GoogleLogin = () => {
  useEffect(() => {
    // Redirect to the backend's Google OAuth endpoint
    const googleAuthUrl = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/google`;
    window.location.href = googleAuthUrl;
  }, []);

  return <div>Redirecting to Google Login...</div>;
};

export default GoogleLogin;
