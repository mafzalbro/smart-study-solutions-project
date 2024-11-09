"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { usePathname } from "next/navigation";
import { AiOutlineHome, AiOutlineUser, AiOutlineLock, AiOutlineHeart, AiOutlineQuestion } from "react-icons/ai";
import { RiQuestionAnswerLine } from "react-icons/ri";

export default function Sidebar({ height }) {
  const [loading, setLoading] = useState(true);
  const path = usePathname();
  const selectedData = path.split("dashboard/")[1]
    ? path.split("dashboard/")[1]
    : "dashboard";

  const scrollRef = useRef(null);
  let isDragging = false;
  let startPos = 0;
  let scrollLeft = 0;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100); // Simulating loading time
  }, [path]);

  const sidebarItems = [
    { label: "Home", href: "/dashboard", key: "dashboard", icon: <AiOutlineHome /> },
    { label: "Update Profile", href: "/dashboard/profile", key: "profile", icon: <AiOutlineUser /> },
    { label: "Change Password", href: "/dashboard/change-password", key: "change-password", icon: <AiOutlineLock /> },
    { label: 'Liked Resources', href: '/dashboard/liked-resources', key: 'liked-resources', icon: <AiOutlineHeart /> },
    { label: 'Your Questions', href: '/dashboard/questions', key: 'questions', icon: <AiOutlineQuestion /> },
    { label: 'Your Answers', href: '/dashboard/answers', key: 'answers', icon: <RiQuestionAnswerLine />
      },
  ];
  

  const handleMouseDown = (e) => {
    isDragging = true;
    startPos = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging = false;
  };

  const handleMouseUp = () => {
    isDragging = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startPos) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={scrollRef}
      className={`md:flex-col md:gap-4 flex flex-row gap-2 md:p-4 md:w-1/3 lg:w-1/4 overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide rounded-lg bg-neutral-200 dark:bg-neutral-800 md:bg-transparent md:dark:bg-transparent my-8 w-[90vw] mx-auto md:mx-0 md:my-0 pl-2 py-2`}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {loading ? (
        <>
          <div className="hidden md:block">
            <Skeleton height={40} width="80vw" className="mx-auto" />
            <Skeleton height={40} count={6} className="mb-10" />
          </div>
          <div className="md:hidden flex flex-row">
            <Skeleton height={40} width={80} />
            <Skeleton height={40} width={100} />
            <Skeleton height={40} width={120} />
          </div>
        </>
      ) : (
        <div className="flex md:flex-col">
          {sidebarItems.map((item) => (
            <Link key={item.key} href={item.href}>
              <span
                className={`flex items-center gap-2 py-2 px-4 mr-2 md:mr-0 md:my-2 rounded-lg ${
                  selectedData === item.key
                    ? "bg-accent-500 text-secondary"
                    : "bg-secondary dark:bg-neutral-700 text-neutral-400 hover:bg-neutral-50 dark:hover:text-secondary dark:hover:bg-accent-700 md:bg-transparent md:dark:bg-transparent"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
