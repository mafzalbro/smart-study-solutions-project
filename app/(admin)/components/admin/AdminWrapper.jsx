"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../customHooks/AdminAuthProvider";
import { useEffect } from "react";

const AdminWrapper = ({ children }) => {
  const { token } = useAuth();
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push(path.includes("/admin") ? path : "/admin");
    } else {
      router.replace("/admin/login");
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
