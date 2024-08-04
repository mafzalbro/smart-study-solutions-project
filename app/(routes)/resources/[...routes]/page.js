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

export default function ResourcesPage({ params }) {
  const { routes } = params;

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
      let url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources?page=${newPage}&limit=${results}`;

      if (debouncedSearchTerm) {
        url += `&query=${encodeURIComponent(debouncedSearchTerm)}`;
      }

      if (sortBy) {
        url += `&sortBy=${sortBy}`;
      }

      const filterParams = Object.keys(filterBy).reduce((acc, key) => {
        if (filterBy[key]) {
          acc[key] = filterBy[key];
        }
        return acc;
      }, {});

      if (Object.keys(filterParams).length > 0) {
        url += `&filterBy=${encodeURIComponent(JSON.stringify(filterParams))}`;
      }

      if (routes[0] === 'type') {
        url += `&filterBy=${encodeURIComponent(JSON.stringify({ type: routes[1] }))}`;
      } else if (routes[0] === 'tag') {
        url += `&filterBy=${encodeURIComponent(JSON.stringify({ tags: routes[1] }))}`;
      } else if (routes[0] === 'category') {
        url += `&filterBy=${encodeURIComponent(JSON.stringify({ category: routes[1] }))}`;
      }

      const data = await fetcher(url);
      const { results: fetchedResources, totalResults } = data;

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
  }, [debouncedSearchTerm, routes, sortBy, filterBy]);

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
    fetchResources(1, true); // Fetch with new sort option
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterBy(prevFilters => ({
      ...prevFilters,
      [name]: value || undefined // Only include filter if value is not empty
    }));
    fetchResources(1, true); // Fetch with new filters
  };

  return (
    <section className="p-8 dark:text-white w-full">
      <ToastContainer />

      <StylishTitle colored='Books, Past Papers, Notes' simple='For Punjab University' className='text-center' />

      <div className="flex justify-center my-20 mx-10">
        <TextInputField
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="py-5 px-10 border border-neutral-300 rounded-full w-full max-w-md focus:outline-none ring-2 focus:ring-4 ring-accent-500"
          style={{ maxWidth: "600px" }}
        />
      </div>

      <div className="flex justify-center gap-4 mb-10">
        <select onChange={handleSortChange} value={sortBy} className="border border-neutral-300 rounded-full py-2 px-4">
          <option value="">Sort By</option>
          <option value="title:asc">Title Ascending</option>
          <option value="title:desc">Title Descending</option>
          {/* Add other sort options here */}
        </select>

        <select onChange={handleFilterChange} name="type" value={filterBy.type || ''} className="border border-neutral-300 rounded-full py-2 px-4">
          <option value="">Filter By Type</option>
          <option value="notes">notes</option>
          <option value="past papers">past papers</option>
          <option value="book">book</option>
        </select>

        <select onChange={handleFilterChange} name="tags" value={filterBy.tags || ''} className="border border-neutral-300 rounded-full py-2 px-4">
          <option value="">Filter By Tags</option>
          <option value="programming">programming</option>
          <option value="basics">basics</option>
          <option value="bsit">bsit</option>
          {/* Add other tag options here */}
        </select>

        <select onChange={handleFilterChange} name="category" value={filterBy.category || ''} className="border border-neutral-300 rounded-full py-2 px-4">
          <option value="">Filter By Category</option>
          <option value="science">science</option>
          <option value="arts">arts</option>
          {/* Add other category options here */}
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
            className="border border-neutral-300 rounded-full text-accent-500 hover:text-accent-700 font-bold py-4 px-6 dark:border-neutral-700"
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
