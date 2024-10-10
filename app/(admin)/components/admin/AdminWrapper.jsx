"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../customHooks/AdminAuthProvider";

const AdminWrapper = ({ children }) => {
  const { admin } = useAuth();

  const router = useRouter();

  const path = usePathname();

  if (!admin) router.push("/admin/login");

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
