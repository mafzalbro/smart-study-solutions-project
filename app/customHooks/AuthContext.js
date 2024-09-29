"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { fetcher } from "@/app/utils/fetcher";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const path = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [user, setUser] = useState(null);
    const router = useRouter();

    if(!path.includes('/admin')){
    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem("token");

        if (token) {
          try {
            const res = await fetcher(
              `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/check-auth`
            );

            if (res.auth) {
              setIsLoggedIn(true);
              // Fetch user data separately
              try {
                const userRes = await fetcher(
                  `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/user/get/one`
                );

                setUser(userRes);
              } catch (userError) {
                console.error("Error fetching user data:", userError);
              }
            } else if (!res.auth) {
              setUser({ message: "User Not Loaded" });
              setIsLoggedIn(false);
              localStorage.removeItem("token");
            }
          } catch (error) {
            setUser({ message: "User Not Loaded" });
            console.error("Error checking auth:", error);
            // setIsLoggedIn(false);
            // localStorage.removeItem('token');
          }
        } else {
          setUser({ message: "User Not Loaded" });
          setIsLoggedIn(false);
        }
      };

      checkAuth();

      const handleTokenUpdate = () => {
        const token = localStorage.getItem("token");
        if (token) {
          setIsLoggedIn(true);
          checkAuth();
        }
      };

      window.addEventListener("tokenUpdated", handleTokenUpdate);

      return () => {
        window.removeEventListener("tokenUpdated", handleTokenUpdate);
      };
    }, [router, path]);
  }
    return (
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user }}>
        {children}
      </AuthContext.Provider>
    );
};

// Export the useAuth hook
export const useAuth = () => useContext(AuthContext);
