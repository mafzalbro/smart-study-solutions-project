"use client";

import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { FaSortAlphaDown, FaSortAlphaUp, FaBook, FaStickyNote, FaFileAlt, FaTags, FaFilter } from "react-icons/fa";
import { HiChevronUpDown } from "react-icons/hi2";
import ClickButton from '../ClickButton';
// import { useRouter } from 'next/navigation';

const SideArea = ({ sortBy, handleSortChange, filterBy, handleFilterChange }) => {

  // const router = useRouter()
  const [isSortOpen, setSortOpen] = useState(false);
  const [isFilterTypeOpen, setFilterTypeOpen] = useState(false);
  const [isFilterCategoryOpen, setFilterCategoryOpen] = useState(false);
  const [isFilterTagsOpen, setFilterTagsOpen] = useState(false);
  const isMediumScreen = useMediaQuery({ minWidth: 768 });

  const [selectedFilters, setSelectedFilters] = useState({
    sort: sortBy,
    type: filterBy.type || [],
    category: filterBy.category || [],
    tags: filterBy.tags || []
  });

  const sortOptions = [
    { value: 'title:asc', label: 'Title Ascending', icon: <FaSortAlphaDown /> },
    { value: 'title:desc', label: 'Title Descending', icon: <FaSortAlphaUp /> }
  ];

  const filterTypeOptions = [
    { value: 'book', label: 'Books', icon: <FaBook /> },
    { value: 'past-paper', label: 'Past Papers', icon: <FaFileAlt /> },
    { value: 'note', label: 'Notes', icon: <FaStickyNote /> }
  ];

  const filterCategoryOptions = [
    { value: 'science', label: 'Science', icon: <FaFilter /> },
    { value: 'arts', label: 'Arts', icon: <FaFilter /> }
  ];

  const filterTagsOptions = [
    { value: 'programming', label: 'Programming', icon: <FaTags /> },
    { value: 'basics', label: 'Basics', icon: <FaTags /> },
    { value: 'bsit', label: 'BSIT', icon: <FaTags /> }
  ];

  const handleDropdownToggle = (type) => {
    switch (type) {
      case 'sort':
        setSortOpen(!isSortOpen);
        break;
      case 'type':
        setFilterTypeOpen(!isFilterTypeOpen);
        break;
      case 'category':
        setFilterCategoryOpen(!isFilterCategoryOpen);
        break;
      case 'tags':
        setFilterTagsOpen(!isFilterTagsOpen);
        break;
      default:
        break;
    }
  };

  const handleOptionSelect = (type, value) => {
    let updatedFilters = { ...selectedFilters };

    if (type === 'sort') {
      updatedFilters.sort = updatedFilters.sort === value ? '' : value;
      handleSortChange(updatedFilters.sort);
    } else {
      if (updatedFilters[type].includes(value)) {
        updatedFilters[type] = updatedFilters[type].filter(v => v !== value);
      } else {
        updatedFilters[type] = [...updatedFilters[type], value];
      }
      handleFilterChange({ target: { name: type, value: updatedFilters[type] } });
    }

    setSelectedFilters(updatedFilters);
  };

  const isOptionSelected = (type, value) => {
    if (type === 'sort') {
      return selectedFilters.sort === value;
    } else {
      return selectedFilters[type].includes(value);
    }
  };

  return (
    <aside className={`mb-10 md:mb-0  rounded-lg ${isMediumScreen ? 'w-64 h-screen sticky top-0' : 'w-full md:w-64 mt-4 md:mt-0'}`}>
      <ClickButton className="py-2 px-4 mb-4 bg-transparent hover:bg-transparent dark:hover:bg-transparent dark:bg-transparent text-center text-accent-500 hover:text-accent-600 shadow-none" text='Clear All' onClick={()=> window.location.reload()}/>
      <div className="space-y-4">
        <div>
          <button onClick={() => handleDropdownToggle('sort')} className="flex items-center justify-between w-full py-2 px-4 bg-white bg-opacity-90 dark:bg-neutral-700 rounded-full">
            <span>Sort By</span>
            <HiChevronUpDown className={`h-5 w-5 transition-all ${isSortOpen ? 'text-accent-900' : ''}`} />
          </button>
          {isSortOpen && (
            <div className="mt-2 space-y-2">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect('sort', option.value)}
                  className={`w-full flex items-center gap-2 py-2 px-4 rounded-full text-left ${isOptionSelected('sort', option.value) ? 'bg-blue-100 dark:bg-blue-600' : 'dark:bg-accent-900'} hover:bg-accent-200 dark:hover:bg-accent-500`}
                >
                  {option.icon} {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <button onClick={() => handleDropdownToggle('type')} className="flex items-center justify-between w-full py-2 px-4 bg-white bg-opacity-90 dark:bg-neutral-700 rounded-full">
            <span>Filter By Type</span>
            <HiChevronUpDown className={`h-5 w-5 transition-all ${isFilterTypeOpen ? 'text-accent-900' : ''}`} />
          </button>
          {isFilterTypeOpen && (
            <div className="mt-2 space-y-2">
              {filterTypeOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect('type', option.value)}
                  className={`w-full flex items-center gap-2 py-2 px-4 rounded-full text-left ${isOptionSelected('type', option.value) ? 'bg-blue-100 dark:bg-blue-600' : 'dark:bg-accent-900'} hover:bg-accent-200 dark:hover:bg-accent-500`}
                >
                  {option.icon} {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <button onClick={() => handleDropdownToggle('category')} className="flex items-center justify-between w-full py-2 px-4 bg-white bg-opacity-90 dark:bg-neutral-700 rounded-full">
            <span>Filter By Category</span>
            <HiChevronUpDown className={`h-5 w-5 transition-all ${isFilterCategoryOpen ? 'text-accent-900' : ''}`} />
          </button>
          {isFilterCategoryOpen && (
            <div className="mt-2 space-y-2">
              {filterCategoryOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect('category', option.value)}
                  className={`w-full flex items-center gap-2 py-2 px-4 rounded-full text-left ${isOptionSelected('category', option.value) ? 'bg-blue-100 dark:bg-blue-600' : 'dark:bg-accent-900'} hover:bg-accent-200 dark:hover:bg-accent-500`}
                >
                  {option.icon} {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <button onClick={() => handleDropdownToggle('tags')} className="flex items-center justify-between w-full py-2 px-4 bg-white bg-opacity-90 dark:bg-neutral-700 rounded-full">
            <span>Filter By Tags</span>
            <HiChevronUpDown className={`h-5 w-5 transition-all ${isFilterTagsOpen ? 'text-accent-900' : ''}`} />
          </button>
          {isFilterTagsOpen && (
            <div className="mt-2 space-y-2">
              {filterTagsOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect('tags', option.value)}
                  className={`w-full flex items-center gap-2 py-2 px-4 rounded-full text-left ${isOptionSelected('tags', option.value) ? 'bg-blue-100 dark:bg-blue-600' : 'dark:bg-accent-900'} hover:bg-accent-200 dark:hover:bg-accent-500`}
                >
                  {option.icon} {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SideArea;
