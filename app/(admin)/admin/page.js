"use client";

import Link from "next/link";
import StylishTitle from "@/app/components/StylishTitle";
import {
  AiOutlineHome,
  AiOutlineBell,
  AiOutlineFileText,
  AiOutlineMessage,
  AiOutlineUser,
  AiOutlineContacts,
  AiOutlineUserAdd,
  AiOutlineEdit,
  AiOutlineTeam,
} from "react-icons/ai";
import { useAuth } from "../customHooks/AdminAuthProvider";

const linkItems = [
  { label: "Home", href: "/admin", icon: <AiOutlineHome />, key: "admin" },
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: <AiOutlineBell />,
    key: "notifications",
  },
  {
    label: "Resources",
    href: "/admin/resources",
    icon: <AiOutlineFileText />,
    key: "resources",
  },
  {
    label: "Forum",
    href: "/admin/forum",
    icon: <AiOutlineMessage />,
    key: "forum",
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: <AiOutlineUser />,
    key: "users",
  },
  {
    label: "Contacts",
    href: "/admin/contacts",
    icon: <AiOutlineContacts />,
    key: "contacts",
  },
  {
    label: "Create Admin",
    href: "/admin/create-admin",
    icon: <AiOutlineUserAdd />,
    key: "create-admin",
  },
  {
    label: "Update Profile",
    href: "/admin/update-admin-profile",
    icon: <AiOutlineEdit />,
    key: "update-profile",
  },
  {
    label: "Admins List",
    href: "/admin/admins-list",
    icon: <AiOutlineTeam />,
    key: "admins-list",
  },
];

const restrictedItems = [
  "/admin/create-admin",
  "/admin/admins-list",
];

export default function Dashboard() {
  const { admin } = useAuth();
  return (
    admin && (
      <div className="flex flex-col gap-10 mt-10">
        {/* Dashboard Links Section */}
        <StylishTitle
          className="text-white text-center"
          fontSize="3xl"
          tagName="h2"
          colored={"Quick Links"}
        />
        <div className="w-full mt-12 md:mt-0 flex flex-wrap gap-6 justify-center">
          {linkItems.map((item) => {
            if (
              restrictedItems.includes(item.href) &&
              admin?.role === "admin"
            ) {
              return null; // Don't render restricted items for "admin"
            }
            return (
              <Link key={item.key} href={item.href} passHref>
                <div className="group w-40 p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-transform transform hover:-translate-y-1 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl mb-2 text-accent-500 group-hover:text-accent-700">
                    {item.icon}
                  </div>
                  <h3 className="text-md font-semibold text-neutral-800 dark:text-neutral-100 group-hover:text-accent-600">
                    {item.label}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    )
  );
}
