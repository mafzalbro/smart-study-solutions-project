"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiX, FiMoon, FiSun } from "react-icons/fi";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/customHooks/AuthContext";
// import NavBarAdmin from "../../(admin)/components/navbar/NavBarAdmin";
import Skeleton from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";
import StylishSpan from "../StylishSpan";
import HoverLine from "./HoverLine";

const NavBar = () => {
  const pathname = usePathname();
  if (!pathname.includes("/admin")) {
    const [adminToken, setAdminToken] = useState("");
    const [scrollDirection, setScrollDirection] = useState("up");
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const { isLoggedIn, user } = useAuth(); // Get isLoggedIn and user from AuthContext
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [darkMode, setDarkMode] = useState("light");
    const router = useRouter();
    const query = useSearchParams();
    const token = query.get("token");

    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
      const savedToken = localStorage.getItem("token");
      const savedAdminToken = localStorage.getItem("admin_token");

      if (!savedToken && token && pathname === "/") {
        localStorage.setItem("token", token);
        router.push("/");
      }

      savedAdminToken ? setAdminToken(savedAdminToken) : setAdminToken("");
    }, [token]);

    useEffect(() => {
      const savedTheme = localStorage.getItem("theme");

      if (savedTheme) {
        setDarkMode(savedTheme);
        document.documentElement.classList.toggle(
          "dark",
          savedTheme === "dark"
        );
      } else {
        const prefersDarkMode = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        const defaultTheme = prefersDarkMode ? "dark" : "light";
        setDarkMode(defaultTheme);
        document.documentElement.classList.toggle("dark", prefersDarkMode);
        localStorage.setItem("theme", defaultTheme);
      }
    }, []);

    useEffect(() => {
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsDropdownOpen(false);
        }
        if (
          mobileMenuRef.current &&
          !mobileMenuRef.current.contains(event.target)
        ) {
          setIsMobileMenuOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleProfileClick = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };

    const handleMobileMenuToggle = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleDarkMode = () => {
      const newDarkMode = darkMode === "dark" ? "light" : "dark";

      setDarkMode(newDarkMode);
      document.documentElement.classList.toggle("dark", newDarkMode === "dark");
      localStorage.setItem("theme", newDarkMode);
    };

    useEffect(() => {
      const chatScroll = document.querySelector(".chat-scroll");
      const handleScroll = () => {
        const currentScrollTop = document.documentElement.scrollTop;

        if (chatScroll) {
          const currentChatScrollTop = chatScroll.scrollTop;
          if (currentChatScrollTop > 100) {
            if (currentChatScrollTop > lastScrollTop) {
              setScrollDirection("down");
            } else {
              setScrollDirection("up");
            }
          } else {
            setScrollDirection("up");
          }
          setLastScrollTop(
            currentChatScrollTop <= 0 ? 0 : currentChatScrollTop
          );
        } else {
          if (currentScrollTop > 100) {
            if (currentScrollTop > lastScrollTop) {
              setScrollDirection("down");
            } else {
              setScrollDirection("up");
            }
          } else {
            setScrollDirection("up");
          }
          // Update lastScrollTop, ensuring it's never negative
          setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
        }
      };

      window.addEventListener("scroll", handleScroll);
      chatScroll?.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        chatScroll?.removeEventListener("scroll", handleScroll);
      };
    }, [lastScrollTop]);
    

    if (user === null) {
      return (
        <nav
          className={`sticky top-0 translate-y-0 z-50 bg-opacity-80 dark:bg-opacity-80 transition-transform backdrop-blur-sm bg-secondary dark:bg-neutral-800 p-3 px-4 md:p-4 text-primary dark:text-secondary ${
            scrollDirection === "down" ? "translate-y-[-100%]" : "translate-y-0"
          }`}
        >
          <div className="container mx-auto flex justify-between items-center">
            <Skeleton width={100} height={30} />
            <div className="space-x-6 items-center hidden md:flex">
              <Skeleton width={80} height={30} />
              <Skeleton width={80} height={30} />
              <Skeleton width={80} height={30} />
              <Skeleton circle={true} height={40} width={40} />
              <Skeleton circle={true} height={30} width={30} />
            </div>
            <div className="md:hidden flex items-center gap-4">
              <Skeleton circle={true} height={35} width={35} />
              <Skeleton circle={true} height={27} width={27} />
              <Skeleton height={20} width={30} />
            </div>
          </div>
        </nav>
      );
    }
    const getActiveLinkClass = (linkPath, isHome) => {
      if (isHome)
        return pathname === linkPath
          ? "text-blue-500 dark:text-blue-300 pointer-events-none"
          : "";
      return pathname.includes(linkPath)
        ? "text-blue-500 dark:text-blue-300"
        : "";
      // return pathname.includes(linkPath) ? 'text-blue-500 dark:text-blue-300 pointer-events-none' : '';
    };

    return (
      <nav
        className={`sticky top-0 z-50 bg-opacity-80 dark:bg-opacity-50 transition-transform backdrop-blur-sm bg-secondary dark:bg-neutral-800 p-2 px-4 md:p-4 text-primary dark:text-secondary ${lastScrollTop < 100 ? "": "shadow-lg"} ${
          scrollDirection === "down" ? "translate-y-[-100%]" : "translate-y-0"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <h2 className="text-base md:text-2xl font-bold cursor-pointer">
              <StylishSpan>Smart Study</StylishSpan> Solutions
            </h2>
          </Link>
          <div className="flex items-center">
            <ul
              ref={mobileMenuRef}
              className={`${
                isMobileMenuOpen
                  ? "block z-0 top-14 opcity-100 md:opacity-100 pointer-events-auto"
                  : "pointer-events-none opacity-0 md:opacity-100 top-8"
              } md:pointer-events-auto md:flex md:space-x-6 p-6 md:p-0 md:items-center absolute md:static bg-secondary dark:bg-neutral-800 md:dark:bg-transparent md:bg-transparent left-0 w-full md:w-auto shadow-lg md:shadow-none text-center transition-all duration-300 ease-in-out`}
            >
              <li>
                <Link
                  href="/"
                  passHref
                  className={`inline-block relative group py-2 md:py-0 ${getActiveLinkClass(
                    "/",
                    true
                  )}`}
                >
                  Home
                  <HoverLine hide={pathname === "/"} />
                </Link>
              </li>
              {adminToken && (
                <li>
                  <Link
                    href="/admin"
                    passHref
                    className={`inline-block relative group py-2 md:py-0 ${getActiveLinkClass(
                      "/admin"
                    )}`}
                  >
                    Admin
                    <HoverLine hide={pathname.includes("/admin")} />
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/resources"
                  passHref
                  className={`inline-block relative group py-2 md:py-0 ${getActiveLinkClass(
                    "/resources"
                  )}`}
                >
                  Resources
                  <HoverLine hide={pathname.includes("/resources")} />
                </Link>
              </li>
              <li>
                <Link
                  href="/forum"
                  passHref
                  className={`inline-block relative group py-2 md:py-0 ${getActiveLinkClass(
                    "/forum"
                  )}`}
                >
                  Forum
                  <HoverLine hide={pathname.includes("/forum")} />
                </Link>
              </li>
              {isLoggedIn && (
                <li>
                  <Link
                    href="/chat"
                    passHref
                    className={`inline-block relative group py-2 md:py-0 ${getActiveLinkClass(
                      "/chat"
                    )}`}
                  >
                    Ask AI
                    <HoverLine hide={pathname.includes("/chat")} />
                  </Link>
                </li>
              )}
              {(pathname.includes("/forum") && isLoggedIn) && (
                <li>
                  <Link href="/forum/submit" passHref>
                    <button className="my-4 md:my-0 py-2 px-4 bg-link text-white rounded-lg shadow-md hover:bg-link-hover dark:bg-link-hover dark:hover:bg-link">
                      Add Question
                    </button>
                  </Link>
                </li>
              )}
            </ul>
            {isLoggedIn ? (
              <div ref={dropdownRef} className="relative ml-4 text-xs sm:text-base">
                <div
                  className="cursor-pointer w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-neutral-800"
                  onClick={handleProfileClick}
                >
                  {user && user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="User Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle size={40} />
                  )}
                </div>
                {/* {isDropdownOpen && ( */}
                <div
                  className={`absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg py-2 z-50 transition-all duration-200 ${
                    isDropdownOpen
                      ? "mt-2 opacity-100 pointer-events-auto"
                      : "-mt-4 opacity-0 pointer-events-none"
                  }`}
                >
                  <Link href="/dashboard" passHref>
                    <span className="block px-4 py-2 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                      User Dashboard
                    </span>
                  </Link>
                  <Link href="/logout" passHref>
                    <span className="block px-4 py-2 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                      Logout
                    </span>
                  </Link>
                </div>
                {/* )} */}
              </div>
            ) : (
              <Link href="/login" passHref>
                <button className="ml-4 py-2 px-4 bg-link text-white rounded-lg shadow-md hover:bg-link-hover dark:bg-link-hover dark:hover:bg-link text-xs sm:text-base">
                  Log In
                </button>
              </Link>
            )}
            <button
              onClick={toggleDarkMode}
              className="ml-4 p-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg focus:outline-none"
            >
              {darkMode === "dark" ? (
                <FiSun className="text-yellow-500" />
              ) : (
                <FiMoon className="text-neutral-800 dark:text-neutral-200" />
              )}
            </button>
            <button
              className="block md:hidden ml-4"
              onClick={handleMobileMenuToggle}
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <HiOutlineMenuAlt3 className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>
    );
  }
};

export default NavBar;
