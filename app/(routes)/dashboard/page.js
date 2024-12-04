"use client";

import Link from "next/link";
import { useAuth } from "@/app/customHooks/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { FaCrown } from "react-icons/fa";
import { FaGift } from "react-icons/fa";
import {
  AiOutlineEdit,
  AiOutlineLock,
  AiOutlineHeart,
  AiOutlineQuestion,
  AiOutlineBell,
} from "react-icons/ai";
import { RiQuestionAnswerLine } from "react-icons/ri";

import StylishTitle from "@/app/components/StylishTitle";

const quickLinks = [
  // { label: "Home", href: "/dashboard", key: "dashboard", icon: <AiOutlineHome /> },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    key: "notifications",
    icon: <AiOutlineBell />,
  },
  {
    label: "Update Profile",
    href: "/dashboard/profile",
    key: "profile",
    icon: <AiOutlineEdit />,
  },
  {
    label: "Change Password",
    href: "/dashboard/change-password",
    key: "change-password",
    icon: <AiOutlineLock />,
  },
  {
    label: "Liked Resources",
    href: "/dashboard/liked-resources",
    key: "liked-resources",
    icon: <AiOutlineHeart />,
  },
  {
    label: "Your Questions",
    href: "/dashboard/questions",
    key: "questions",
    icon: <AiOutlineQuestion />,
  },
  {
    label: "Your Answers",
    href: "/dashboard/answers",
    key: "answers",
    icon: <RiQuestionAnswerLine />,
  },
];

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-5">
      {/* Quick Links Section */}
      <StylishTitle
        className="text-white text-center"
        fontSize="3xl"
        tagName="h2"
        colored="Quick Links"
      />
      <div className="w-full mb-12 md:mt-0 flex flex-wrap gap-6 justify-center">
        {quickLinks.map((link) => (
          <Link key={link.key} href={link.href} passHref>
            <div className="group w-40 p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-transform transform hover:-translate-y-1 flex flex-col items-center justify-center text-center">
              <div className="text-3xl mb-2 text-accent-500 group-hover:text-accent-700">
                {link.icon}
              </div>
              <h3 className="text-md font-semibold text-neutral-800 dark:text-neutral-100 group-hover:text-accent-600">
                {link.label}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Profile Section */}
      <StylishTitle
        className="text-white text-center"
        fontSize="3xl"
        tagName="h2"
        colored="User Profile"
      />
      <div className="w-full min-h-[50vh] bg-my-bg-1 text-foreground flex items-center justify-center">
        <div className="relative w-full max-w-md p-6 bg-my-bg-2 rounded-lg border border-neutral-100 dark:border-neutral-700 mx-4 bg-secondary dark:bg-neutral-800">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="relative w-24 h-24">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile Picture"
                  className="w-full h-full rounded-full border-2 border-accent-500"
                />
              ) : (
                <FaUserCircle
                  size={96}
                  className="text-neutral-400 dark:text-neutral-600"
                />
              )}
            </div>
          </div>
          <div className="pt-12 pb-6 text-center">
            {" "}
            <div
              className={`inline-flex absolute top-2 right-2 md:top-4 md:right-4 z-10 items-center px-3 py-1 rounded-full font-semibold text-sm transition-all duration-300 ${
                user?.isMember
                  ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900"
                  : "text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900"
              }`}
            >
              {user?.isMember ? (
                <>
                  <FaCrown className="mr-1 text-green-500 dark:text-green-300" />
                  <span>Membership</span>
                </>
              ) : (
                <>
                  <FaGift className="mr-1 text-blue-500 dark:text-blue-300" />
                  <span>Free</span>
                </>
              )}
            </div>
            <h2 className="text-3xl font-bold mb-1">
              {user?.fullname || "Dear User"}
            </h2>
            <p className="text-md text-neutral-600 dark:text-neutral-300">
              {user?.email || "your-email@example.com"}
            </p>
          </div>
          <div className="mt-2 text-center">
            <p className="text-md font-medium text-neutral-700 dark:text-neutral-300">
              Welcome to your Dashboard!
            </p>
            <p className="text-sm mt-3 text-neutral-500 dark:text-neutral-400">
              Access and manage your account details here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
