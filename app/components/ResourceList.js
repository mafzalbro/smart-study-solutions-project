"use client";

import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import ResourceCard from "./ResourceCard";

export default function ResourcesList() {
  const [resources, setResources] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // State to track loading more items
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // State for pagination
  const [hasMore, setHasMore] = useState(true); // State to track if there are more resources to load
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const results = 5
  // Debounce function to delay search requests
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Adjust debounce delay as needed (e.g., 500ms)

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const fetchResources = async (newPage = 1, reset = false) => {
    setIsLoading(true);
    setError(null);

    try {
      let url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources?page=${newPage}&limit=${results}`;

      // Append search query if debouncedSearchTerm is not empty
      if (debouncedSearchTerm) {
        url += `&query=${debouncedSearchTerm}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      const { data: fetchedResources, totalResults } = data.results; // Destructure data

      // Update resources based on reset flag and search term presence
      if (reset || debouncedSearchTerm) {
        setResources(fetchedResources);
      } else {
        setResources((prevResources) => [...prevResources, ...fetchedResources]);
      }

      setPage(newPage);
      setHasMore(newPage * results < totalResults); // Adjust hasMore based on totalResults
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false); // Turn off loading more indicator
    }
  };

  useEffect(() => {
    fetchResources(1, true); // Initial fetch or when search term changes, reset resources
  }, [debouncedSearchTerm]); // Trigger fetchResources when debouncedSearchTerm changes

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setIsLoadingMore(true); // Set loading more indicator
    fetchResources(nextPage, false); // Pass false to append resources
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update searchTerm on input change
  };

  return (
    <div className="p-8">
    <h1 className="text-5xl font-bold text-center my-16 text-foreground font-mono mx-10">
      <span className="text-orange-600">Books, Past Papers, Notes</span> For Punjab University
    </h1>
    <p className="text-lg text-center my-16 w-4/6 mx-auto">
    Welcome to our comprehensive academic forum! Access past papers, university notes, books, and essential study materials for your BS 4-year program. Join a community dedicated to learning and sharing knowledge. Explore, download, and contribute to enrich your academic journey with us today!

</p>

    {/* Search input */}
    <div className="flex justify-center my-20 mx-10">
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="py-5 px-10 border border-gray-300 rounded-full w-full max-w-md focus:outline-none ring-2 focus:ring-4 ring-orange-500"
          style={{ maxWidth: "600px" }}
        />
      </div>

    {/* List of resources */}
    {isLoading && resources.length === 0 ? (
      <div className="flex justify-center m-10">
        <Spinner /> {/* Show spinner centered */}
      </div>
    ) : error ? (
      <p className="text-center text-red-500 mt-5">
        Error fetching resources: {error.message}
      </p>
    ) : resources.length === 0 ? (
      <p className="text-center text-gray-500 mt-5">Nothing here.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-10">
        {resources.map((resource) => (
          <ResourceCard key={resource._id} resource={resource} />
        ))}
      </div>
    )}

    {/* Load more button for infinite scroll */}
    {resources.length !== 0 && !error && hasMore && !isLoadingMore && (
      <div className="flex justify-center m-10">
        <button
          onClick={handleLoadMore}
          className="text-orange-500 hover:text-orange-700 font-bold py-2 px-4 rounded"
        >
          Load More
        </button>
      </div>
    )}

    {/* Loading more spinner */}
    {isLoadingMore && (
      <div className="flex justify-center mt-5">
        <Spinner />
      </div>
    )}
  </div>
  );
}
