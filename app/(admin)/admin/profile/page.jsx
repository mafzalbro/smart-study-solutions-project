"use client";

import Link from "next/link";
import { useAuth } from "@/app/(admin)/customHooks/AdminAuthProvider";
import { FaUserCircle } from "react-icons/fa";
import StylishTitle from "@/app/components/StylishTitle";

export default function Profile() {
  const { admin } = useAuth();

  return (
    <div className="flex flex-col gap-10 mt-10">
      <StylishTitle
        className="text-white text-center"
        fontSize="3xl"
        tagName="h2"
        colored={"Admin Profile"}
      />
      <div className="w-full min-h-[65vh] bg-my-bg-1 text-foreground flex items-center justify-center">
        <div className="relative w-full max-w-md p-8 bg-my-bg-2 rounded-lg border border-neutral-100 dark:border-neutral-700 mx-4 bg-secondary dark:bg-neutral-800">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="relative w-32 h-32">
              {admin?.profileImage ? (
                <img
                  src={admin.profileImage}
                  alt="Profile Picture"
                  className="w-full h-full rounded-full border-2 border-accent-500"
                />
              ) : (
                <FaUserCircle
                  size={128}
                  className="text-neutral-400 dark:text-neutral-600"
                />
              )}
            </div>
          </div>
          <div className="pt-16 pb-8 px-4 text-center">
            <h2 className="text-4xl font-bold mb-2 text-center rounded-lg">
              {admin?.username || "Admin"}
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-4">
              {admin?.email || "admin@example.com"}
            </p>
          </div>
          <div className="mt-2 text-center">
            <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
              Welcome to your Dashboard!
            </p>
            <p className="text-sm mt-3 text-neutral-500 dark:text-neutral-400">
              Access all your management tools here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
