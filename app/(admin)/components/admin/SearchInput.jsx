import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import TextInputField from "./TextInputField";
import { FiSearch } from "react-icons/fi";

export default function SearchInput({ onSearch, debounceDelay = 1000 }) {
  const [inputValue, setInputValue] = useState("");

  // Debounced callback for the search input
  const debouncedSearch = useDebouncedCallback((value) => {
    onSearch(value); // Call the parent’s search function with the debounced value
  }, debounceDelay);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value); // Trigger debounced search callback
  };

  return (
    <div className="flex items-center rounded-lg border-neutral-300 dark:border-neutral-700 w-full max-w-md">
      <TextInputField
        icon={FiSearch}
        searchCenter
        noMargin
        type="text"
        placeholder="Search here..."
        value={inputValue}
        onChange={handleChange}
        className="flex-grow bg-transparent outline-none text-neutral-700 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400 !mb-0"
      />
    </div>
  );
}
