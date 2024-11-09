"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import Spinner from "@/app/components/Spinner";

export const AuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const path = usePathname();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();

  if (path.includes("/admin")) {
    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem("admin_token");
        setToken(token);

        try {
          const res = await fetcher(
            `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/admin/check-auth`
          );
          if (res.auth) {
            setIsAdminLoggedIn(true);
            setAdmin(res.admin);
            // Fetch admin data separately
          } else if (!res.auth) {
            router.push("/admin/login");
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

  if (!isAdminLoggedIn && !admin && !token) {
    router.push("/admin/login");
    return (
      <div className="h-screen flex justify-center items-center gap-4 bg-primary text-secondary">
        <Spinner loading={true} /> Checking Access...
      </div>
    );
  }

  const restrictedPaths = [
    "/admin/create-admin",
    "/admin/admins-list",
  ];

  if (
    restrictedPaths.some(
      (pathname) => pathname === path && admin?.role === "admin"
    )
  ) {
    console.log("WOW", path, restrictedPaths);
    router.push("/admin");
    return (
      <div className="h-screen flex justify-center items-center gap-4 bg-primary text-secondary">
        Cannot Access
      </div>
    );
  }

  return (
    (isAdminLoggedIn || path == "/admin/login") && (
      <AuthContext.Provider
        value={{ isAdminLoggedIn, setIsAdminLoggedIn, admin, token }}
      >
        {children}
      </AuthContext.Provider>
    )
  );
};

// Export the useAuth hook
export const useAuth = () => useContext(AuthContext);
