"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { fetcher } from "@/app/(admin)/utils/fetcher";

export const AuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const path = usePathname();
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(null);
    const [admin, setAdmin] = useState(null);
    const router = useRouter();

    if(path.includes('/admin')){
    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem("admin_token");

          try {
            const res = await fetcher(
              `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/admin/check-auth`
            );

            console.log({res})
            if (res.auth) {
              setIsAdminLoggedIn(true);
              setAdmin(res.admin);
              // Fetch admin data separately
            } else if (!res.auth) {
              setAdmin({ message: "Admin Not Loaded" });
              setIsAdminLoggedIn(false);
              localStorage.removeItem("admin_token");
            }
          } catch (error) {
            setAdmin({ message: "Admin Not Loaded" });
            console.error("Error checking auth:", error);
          }
      };

      checkAuth();

      const handleTokenUpdate = () => {
        const token = localStorage.getItem("admin_token");
        if (token) {
          setIsAdminLoggedIn(true);
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
      <AuthContext.Provider
      value={{ isAdminLoggedIn, setIsAdminLoggedIn, admin }}
      >
        {children}
      </AuthContext.Provider>
    );
};

// Export the useAuth hook
export const useAuth = () => useContext(AuthContext);
