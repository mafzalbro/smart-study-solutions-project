"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../customHooks/AdminAuthProvider";
import { useEffect } from "react";

const AdminWrapper = ({ children }) => {
  // const { admin } = useAuth();
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.push("/admin");
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  if (["login", "logout"].some((pathname) => path.includes(pathname))) {
    return (
      <>
        <div className="md:w-full">{children}</div>
      </>
    );
  } else {
    return (
      <>
        <div className="md:w-3/4">{children}</div>
      </>
    );
  }
};

export default AdminWrapper;
