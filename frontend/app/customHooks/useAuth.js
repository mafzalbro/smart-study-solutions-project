// components/AuthCheck.js
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const AuthCheck = () => {
  const router = useRouter();
  const path = usePathname();
  const token = useSearchParams().get("token")
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/check-auth`, {
          credentials: 'include'
        });
        if (res.status === 401 && !token && !path.includes('/resources') && !path.includes('')) {
            router.push('/login');
        } else if (path.includes('/login') || path.includes('/login/google') || path.includes('/register') || path.includes('/register/google')) router.push('/')
          
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
