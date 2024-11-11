"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { usePathname } from "next/navigation";
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
import { useAuth } from "../../customHooks/AdminAuthProvider";
import { BiCategoryAlt } from "react-icons/bi";
import { TfiAnnouncement } from "react-icons/tfi";

export default function Sidebar() {
  const { admin } = useAuth();
  const [loading, setLoading] = useState(true);
  const path = usePathname();
  const selectedData = path.split("admin/")[1]
    ? path.split("admin/")[1]
    : "admin";
  const restrictedPaths = ["/login", "/logout"];
  const isRestrictedPath = () =>
    restrictedPaths.some((restrictedPath) => path.includes(restrictedPath));

  // Ref for each sidebar item to enable scrolling into view
  const sidebarRefs = useRef({});

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Scroll the selected item into view
      if (sidebarRefs.current[selectedData]) {
        sidebarRefs.current[selectedData].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100); // Simulating loading time
  }, [path]);

  if (!admin) {
    return;
  }

  const sidebarItems = [
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
      label: "Forum Categories",
      href: "/admin/forum-categories",
      icon: <BiCategoryAlt />,
      key: "forum-categories",
    },
    {
      label: "Announcements",
      href: "/admin/announcements",
      icon: <TfiAnnouncement />,
      key: "announcements",
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
      key: "update-admin-profile",
    },
    {
      label: "Admins List",
      href: "/admin/admins-list",
      icon: <AiOutlineTeam />,
      key: "admins-list",
    },
  ];

  const restrictedItems = ["/admin/create-admin", "/admin/admins-list"];

  if (!isRestrictedPath())
    return (
      admin && (
        <div
          className={`top-14 z-50 shadow-2xl md:sticky sm:top-0 md:top-0 md:h-screen md:flex-col md:gap-4 flex flex-row gap-2 md:p-4 md:w-1/4 overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide rounded-lg bg-neutral-200 dark:bg-neutral-800 md:bg-transparent md:dark:bg-transparent my-8 w-[90vw] mx-auto md:mx-0 md:my-0 pl-2 py-2`}
        >
          {loading ? (
            <div className="flex md:flex-col gap-4">
              <Skeleton height={40} width={120} />
              <Skeleton height={40} width={120} />
              <Skeleton height={40} width={120} />
              <Skeleton height={40} width={120} />
              <Skeleton height={40} width={120} />
              <Skeleton height={40} width={120} />
            </div>
          ) : (
            <div className="flex flex-row md:flex-col gap-4 md:gap-2">
              {sidebarItems.map((item) => {
                if (
                  restrictedItems.includes(item.href) &&
                  admin?.role === "admin"
                ) {
                  return null; // Don't render restricted items for "admin"
                }

                return (
                  <Link key={item.key} href={item.href}>
                    <span
                      ref={(el) => (sidebarRefs.current[item.key] = el)}
                      className={`flex items-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      selectedData == item.key
                        ? "bg-accent-500 text-white shadow-lg"
                        : "text-neutral-700 dark:text-neutral-300 hover:bg-accent-700 hover:text-white"
                    }
                  `}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )
    );
}
