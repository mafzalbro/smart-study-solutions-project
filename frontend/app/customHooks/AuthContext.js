"use client"

// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation'; // Adjust import based on Next.js version
import next from 'next';

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
          cache: 'no-store'
        });
        const data = await res.json();
        
        if (res.status === 401 && !token && !path.includes('/resources') && path.includes('/submit') && !path.includes('')) {
          router.push('/login');
        } else if (res.status === 200 && (path.includes('/login') || path.includes('/login/google') || path.includes('/register') || path.includes('/register/google'))) {
          router.push('/');
        }
        setIsLoggedIn(res.status === 200 && data.auth);
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsLoggedIn(false);
      }
    };
  
    checkAuth();
  }, [router, path, token]);
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export useContext directly
export const useAuth = () => useContext(AuthContext);
