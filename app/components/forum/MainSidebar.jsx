"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AiOutlineTags,
  AiOutlineUser,
  AiOutlineHome,
  AiOutlineInfoCircle,
  AiOutlineMail,
} from "react-icons/ai";
import Dropdown from "./Dropdown";
import { fetcher } from "@/app/utils/fetcher"; // Adjust path as needed

const defaultSidebarItems = [
  {
    href: "/forum",
    label: "Home",
    icon: (
      <AiOutlineHome className="mr-3 text-xl transition-transform duration-300 ease-in-out transform hover:scale-110" />
    ),
  },
  {
    href: "/dashboard",
    label: "Profile",
    icon: (
      <AiOutlineUser className="mr-3 text-xl transition-transform duration-300 ease-in-out transform hover:scale-110" />
    ),
  },
  {
    href: "/about",
    label: "About",
    icon: (
      <AiOutlineInfoCircle className="mr-3 text-xl transition-transform duration-300 ease-in-out transform hover:scale-110" />
    ),
  },
  {
    href: "/contact",
    label: "Contact",
    icon: (
      <AiOutlineMail className="mr-3 text-xl transition-transform duration-300 ease-in-out transform hover:scale-110" />
    ),
  },
];

const MainSidebar = () => {
  const [categories, setCategories] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await fetcher(
          `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/categories`
        );
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const sidebarItems = [...defaultSidebarItems];

  const handleSelect = (href) => {
    setSelectedOption(href);
    window.location.href = href;
  };

  return (
    <>
      <aside className="w-full md:w-1/4 p-6 border-r border-neutral-300 dark:border-neutral-800 sticky top-0 h-screen md:block hidden bg-white dark:bg-gray-900 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Forum Navigation
        </h2>

        <ul className="space-y-4">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span
                  className={`flex items-center text-base font-medium transition-colors duration-300 ease-in-out ${
                    selectedOption === item.href
                      ? "text-accent-600 dark:text-accent-300"
                      : "text-accent-500 dark:text-accent-400"
                  } hover:text-accent-600 dark:hover:text-accent-300`}
                  onClick={() => setSelectedOption(item.href)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Categories Section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Categories
          </h2>
          <ul className="space-y-3">
            {loading ? (
              <li className="text-gray-500 dark:text-gray-400">
                Loading categories...
              </li>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/forum/category/${category.slug}`}>
                    <span
                      className={`flex items-center text-base font-medium transition-colors duration-300 ease-in-out ${
                        selectedOption === `/forum/category/${category.slug}`
                          ? "text-accent-600 dark:text-accent-300"
                          : "text-accent-500 dark:text-accent-400"
                      } hover:text-accent-600 dark:hover:text-accent-300`}
                      onClick={() =>
                        setSelectedOption(`/forum/category/${category.slug}`)
                      }
                    >
                      <AiOutlineTags className="mr-3 text-lg transition-transform duration-300 ease-in-out transform hover:scale-110" />
                      <span>{category.name}</span>
                    </span>
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-500 dark:text-gray-400">
                No categories available
              </li>
            )}
          </ul>
        </div>
      </aside>

      {/* Mobile View */}
      <div className="md:hidden">
        <Dropdown
          items={sidebarItems}
          categories={categories}
          onSelect={handleSelect}
        />
      </div>
    </>
  );
};

export default MainSidebar;
