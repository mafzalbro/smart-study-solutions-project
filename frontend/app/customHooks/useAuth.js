// components/AuthCheck.js
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const AuthCheck = () => {
  const router = useRouter();
  const token = useSearchParams().get("token")

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/check-auth`, {
          credentials: 'include'
        });
        console.log(await res.json());
        if (res.status === 401 && !token) {
            router.push('/login');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return <></>;
};

export default AuthCheck;
