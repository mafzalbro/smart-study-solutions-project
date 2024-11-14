"use client";

import Spinner from "@/app/components/Spinner";
import { useAuth } from "@/app/customHooks/AuthContext";
import { useRouter } from "next-nprogress-bar";

export default function RootLayout({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
        <Spinner />
        <h2 className="text-lg font-semibold text-gray-300">
          We're setting things up for you!
        </h2>
        <p className="text-gray-400">Hang tight, loading your data...</p>
      </div>
    );
  }

  if (user?.message === "User Not Loaded") {
    router.push("/login");
  }

  if (!!user) return <>{children}</>;
}
