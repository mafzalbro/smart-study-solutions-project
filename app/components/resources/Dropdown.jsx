import React, { useState } from 'react';
import { HiChevronUpDown } from "react-icons/hi2";
import Directory from './Directory';

const Dropdown = ({ degree, selectedDegree, setSelectedDegree }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
    setSelectedDegree(degree.name);
  };

  return (
    <div>
      <button
        onClick={handleDropdownToggle}
        className="flex items-center justify-between w-full py-2 px-4 bg-white bg-opacity-90 dark:bg-neutral-700 rounded-full"
      >
        <span>{degree.name}</span>
        <HiChevronUpDown className={`h-5 w-5 transition-all ${isOpen ? 'text-accent-900' : ''}`} />
      </button>
      {isOpen && selectedDegree === degree.name && (
        <div className="mt-2 space-y-2">
          {degree.subDirs.map((semester, index) => (
            <Directory key={index} directory={semester} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
