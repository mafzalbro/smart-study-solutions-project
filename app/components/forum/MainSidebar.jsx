"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaTags, FaUser, FaHome, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import Dropdown from './Dropdown';
import { fetcher } from '@/app/utils/fetcher'; // Adjust path as needed

const defaultSidebarItems = [
  { href: '/forum/home', label: 'Home', icon: <FaHome className="mr-2" /> },
  { href: '/forum/profile', label: 'Profile', icon: <FaUser className="mr-2" /> },
  { href: '/forum/about', label: 'About', icon: <FaInfoCircle className="mr-2" /> },
  { href: '/forum/contact', label: 'Contact', icon: <FaEnvelope className="mr-2" /> },
];

const MainSidebar = () => {
  const [categories, setCategories] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/categories`);
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const sidebarItems = [
    ...defaultSidebarItems,
  ];

  const handleSelect = (href) => {
    setSelectedOption(href);
    window.location.href = href;
  };

  return (
    <>
      <aside className="w-full md:w-1/4 p-6 border-r border-neutral-300 dark:border-neutral-600 sticky top-0 h-screen md:block hidden">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Forum Navigation</h2>
        
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.href} className="mb-4">
              <Link href={item.href}>
                <span className="flex items-center text-accent-500 dark:text-accent-400 hover:text-accent-600 dark:hover:text-accent-300 transition duration-300 ease-in-out">
                  {item.icon}
                  <span className="text-base font-medium">{item.label}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Categories</h2>
          <ul>
            {categories.map((category) => (
              <li key={category.slug} className="mb-2">
                <Link href={`/forum/categories/${category.slug}`}>
                  <span className="flex items-center text-accent-500 dark:text-accent-400 hover:text-accent-600 dark:hover:text-accent-300 transition duration-300 ease-in-out">
                    <FaTags className="mr-2" />
                    <span className="text-base font-medium">{category.name}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className='md:hidden'>
        <Dropdown items={sidebarItems} categories={categories} onSelect={handleSelect} />
      </div>
    </>
  );
};

export default MainSidebar;
