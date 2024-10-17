import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaListUl, FaTags } from 'react-icons/fa';

const Dropdown = ({ items, onSelect, categories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Check Details');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setSelected(item.label);
    setIsOpen(false);
    onSelect(item.href);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-secondary dark:bg-primary border border-neutral-300 dark:border-neutral-700 rounded-lg py-4 px-6 flex items-center justify-between text-gray-800 dark:text-gray-100 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition duration-300 ease-in-out focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="flex items-center">
          {selected}
        </span>
        <FaListUl className={`ml-2 transition-all duration-300 ${isOpen ? 'text-neutral-300' : ''}`}/>
      </button>
      {isOpen && (
        <>
        <div
          className="absolute w-full bg-secondary dark:bg-primary border border-neutral-300 dark:border-neutral-700 mt-2 rounded-lg shadow-lg p-4 z-10 overflow-hidden"
          role="listbox"
        >
            <div className="p-3">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Subjects</h2>
            <ul>
              {categories.map((category) => (
                <li key={category.slug} className="mb-2">
                  <Link href={`/forum/category/${category.slug}`}>
                    <span className="flex items-center text-accent-500 dark:text-accent-400 hover:text-accent-600 dark:hover:text-accent-300 transition duration-300 ease-in-out">
                      <FaTags className="mr-2" />
                      <span className="text-base font-medium">{category.name}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-3">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Extra</h2>
          <ul>
          {items.map((item) => (
            <li
            key={item.href}
              onClick={() => handleSelect(item)}
              className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition duration-200 ease-in-out flex items-center gap-1"
              role="option"
              tabIndex="0"
              >
              {item.icon} {item.label}
            </li>
          ))}
          </ul>
          </div>
        </div>
       </>
      )}
    </div>
  );
};

export default Dropdown;
