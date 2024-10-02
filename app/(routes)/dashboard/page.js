"use client";

import LinkButton from '@/app/components/LinkButton';
import { useAuth } from '@/app/customHooks/AuthContext';
import { FaUserCircle, FaPen } from 'react-icons/fa';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="w-full md:w-3/4 min-h-[65vh] bg-my-bg-1 text-foreground flex items-center justify-center">
      <div className="relative w-full max-w-md p-8 bg-my-bg-2 rounded-lg border border-neutral-100 dark:border-neutral-700 mx-4 bg-secondary dark:bg-neutral-800">
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <div className="relative w-32 h-32">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile Picture"
                className="w-full h-full rounded-full border-2 border-accent-500"
              />
            ) : (
              <FaUserCircle size={128} className="text-neutral-400 dark:text-neutral-600" />
            )}
          </div>
        </div>
        <div className="pt-16 pb-8 px-4 text-center">
          <LinkButton text={<FaPen size={18} />} link='/dashboard/profile' className="absolute top-4 right-4 p-2 rounded-full bg-primary text-white hover:bg-primary-dark transition duration-200" />
          <h2 className="text-4xl font-bold mb-2 text-center rounded-lg">
            {user?.fullname || "Dear User"}
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-4">
            {user?.email || "your-email@example.com"}
          </p>
        </div>
        <div className="mt-2 text-center">
          <p className="text-lg">
            Welcome to your dashboard! We're currently updating this area to better serve you.
          </p>
          <p className="text-sm mt-5">
            Thanks for your patience and for visiting!
          </p>
        </div>
      </div>
    </div>
  );
}
