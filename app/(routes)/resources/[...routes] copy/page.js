"use client";

import React, { useState, useEffect } from 'react';
import { fetcher } from '@/app/utils/fetcher';
import ResourceCard from '@/app/components/resources/ResourceCard';
import Spinner from '@/app/components/Spinner';
import StylishTitle from '@/app/components/StylishTitle';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import TextInputField from '@/app/components/TextInputField';
import { useRouter } from 'next/router';
import Sidebar from '@/app/components/resources/Sidebar';

export default function ResourcesPage({ params }) {
  const routes = params?.routes || [];

  const [resources, setResources] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(""); // For sorting options
  const [filterBy, setFilterBy] = useState({}); // For filtering options
  const results = 5;

  // Debounce search term
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const fetchResources = async (newPage = 1, reset = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      queryParams.append('page', newPage);
      queryParams.append('limit', results);

      if (debouncedSearchTerm) {
        queryParams.append('query', debouncedSearchTerm);
      }

      if (sortBy) {
        queryParams.append('sortBy', sortBy);
      }

      const filterParams = { ...filterBy };

      if (routes.length > 0) {
        if (routes[0] === 'type') {
          filterParams.type = routes[1].split("-").join(" ");
        } else if (routes[0] === 'tag') {
          filterParams.tags = routes[1].split("-").join(" ");
        } else if (routes[0] === 'category') {
          filterParams.category = routes[1].split("-").join(" ");
        }
      }

      if (Object.keys(filterParams).length > 0) {
        queryParams.append('filterBy', JSON.stringify(filterParams));
      }

      const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources?${queryParams.toString()}`;

      const data = await fetcher(url);
      const { data: fetchedResources, totalResults } = data.results;

      // Handle fetched resources
      if (reset || debouncedSearchTerm) {
        setResources(fetchedResources);
      } else {
        setResources((prevResources) => [...prevResources, ...fetchedResources]);
      }

      setPage(newPage);
      setHasMore(newPage * results < totalResults);
    } catch (error) {
      setError(error);
      toast.error(`Error fetching resources: ${error.message}`);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchResources(1, true);
  }, [debouncedSearchTerm, sortBy, filterBy]);
  // }, [debouncedSearchTerm, routes, sortBy, filterBy]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setIsLoadingMore(true);
    fetchResources(nextPage, false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterBy(prevFilters => ({
      ...prevFilters,
      [name]: value || undefined // Only include filter if value is not empty
    }));
  };

  return (
    <section className="p-8 dark:text-secondary w-full">
      <ToastContainer />

      <StylishTitle colored='Books, Past Papers, Notes' simple='For Punjab University' className='text-center' />

      <div className="flex justify-center my-20 mx-10">
        <TextInputField
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="py-5 px-10 border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 outline-none focus:ring-accent-400  rounded-full w-full max-w-md focus:outline-none ring-2 focus:ring-4 ring-accent-500"
          style={{ maxWidth: "600px" }}
        />
      </div>

      <div className="flex justify-center gap-4 mb-10">
        <select onChange={handleSortChange} value={sortBy} className="border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-accent-400  rounded-full py-2 px-4">
          <option value="">Sort By</option>
          <option value="title:asc">Title Ascending</option>
          <option value="title:desc">Title Descending</option>
        </select>

        <select onChange={handleFilterChange} name="type" value={filterBy.type || ''} className="border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-accent-400  rounded-full py-2 px-4">
          <option value="">Filter By Type</option>
          <option value="notes">notes</option>
          <option value="past papers">past papers</option>
          <option value="book">book</option>
        </select>

        <select onChange={handleFilterChange} name="tags" value={filterBy.tags || ''} className="border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-accent-400  rounded-full py-2 px-4">
          <option value="">Filter By Tags</option>
          <option value="programming">programming</option>
          <option value="basics">basics</option>
          <option value="bsit">bsit</option>
        </select>

        <select onChange={handleFilterChange} name="category" value={filterBy.category || ''} className="border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-accent-400  rounded-full py-2 px-4">
          <option value="">Filter By Category</option>
          <option value="science">science</option>
          <option value="arts">arts</option>
        </select>
      </div>

      {isLoading && resources.length === 0 ? (
        <SkeletonTheme>
          <div className="flex flex-col gap-4 p-10">
            <Skeleton height={250} />
            <Skeleton height={250} />
            <Skeleton height={250} />
          </div>
        </SkeletonTheme>
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

      {resources.length !== 0 && !error && hasMore && !isLoadingMore && (
        <div className="flex justify-center m-10">
          <button
            onClick={handleLoadMore}
            className="border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-accent-400  rounded-full text-accent-500 hover:text-accent-700 font-bold py-4 px-6 dark:border-neutral-700"
          >
            Load More
          </button>
        </div>
      )}

      {isLoadingMore && (
        <div className="flex justify-center mt-5">
          <Spinner />
        </div>
      )}
    </section>
  );
}
