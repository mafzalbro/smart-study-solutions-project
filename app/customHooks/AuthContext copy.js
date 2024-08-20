"use client";

// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const path = usePathname(); // Ensure correct usage of usePathname
  const token = useSearchParams().get("token");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/check-auth`, {
          credentials: 'include',
          // cache: 'no-store'
        });
        const data = await res.json();


        if (res.status === 401 && !token && !path.includes('/resources') && !path.includes('/register') && !path.includes('/forgot-password') && !path.includes('/forum') && path !== new URL(process.env.NEXT_PUBLIC_FRONTEND_ORIGIN).pathname) {

          router.push(`${process.env.NEXT_PUBLIC_FRONTEND_ORIGIN}/login`);
          
        } else if ((res.status === 200 || isLoggedIn) && (path.includes('/login') || path.includes('/login/google') || path.includes('/register') || path.includes('/register/google') || path.includes('/register/google') || path.includes('/forgot-password') || path.includes('/verify-password'))) router.push(`${process.env.NEXT_PUBLIC_FRONTEND_ORIGIN}/`);
          
          if (res.status === 200 && data.auth) {
          setIsLoggedIn(true);
          localStorage.setItem('isLoggedIn', 'true');
        } else {
          setIsLoggedIn(false);
          localStorage.setItem('isLoggedIn', 'false');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
      }
    };

    checkAuth();
  }, [router, path, token]);

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    console.log(storedIsLoggedIn);
    
    if (storedIsLoggedIn) {
      setIsLoggedIn(storedIsLoggedIn === 'true');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export useContext directly
export const useAuth = () => useContext(AuthContext);
