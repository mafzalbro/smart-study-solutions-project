import React, { useState, useRef, useEffect } from 'react';
import { HiChevronUpDown } from "react-icons/hi2";

const CustomSelect = ({ label, options, selectedOption, onOptionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    onOptionChange(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener on mount
    document.addEventListener('mousedown', handleClickOutside);

    // Remove event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className="relative">
      <button
        onClick={handleDropdownToggle}
        className="flex items-center justify-between w-full px-6 py-4 bg-secondary bg-opacity-90 dark:bg-neutral-800 rounded-full"
      >
        <span className={`${isOpen ? 'text-neutral-500' : ''}`}>{selectedOption || label}</span>
        <HiChevronUpDown className={`h-5 w-5 transition-all ${isOpen ? 'text-neutral-500' : ''}`} />
      </button>
      {isOpen && (
        <ul className="absolute mt-2 p-4 w-full bg-secondary dark:bg-neutral-900 rounded-lg shadow-lg z-30">
          {options.map(option => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className="py-2 px-4 cursor-pointer hover:bg-accent-200 dark:hover:bg-accent-500"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
