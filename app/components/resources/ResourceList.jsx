"use client";

import React, { useState, useEffect } from "react";
import Spinner from "../Spinner";
import ResourceCard from "./ResourceCard";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { ToastContainer, toast } from 'react-toastify';
import { fetcher } from '@/app/utils/fetcher';
import TextInputField from '@/app/components/TextInputField';
import 'react-toastify/dist/ReactToastify.css';
import StylishTitle from "../StylishTitle";

export default function ResourcesList() {
  const [resources, setResources] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
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
        url += `&query=${debouncedSearchTerm}`;
      }

      const data = await fetcher(url);
      const { data: fetchedResources, totalResults } = data.results;
      
      
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
  }, [debouncedSearchTerm]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setIsLoadingMore(true);
    fetchResources(nextPage, false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <section className="p-8 dark:text-white w-full">
      <ToastContainer />

      <StylishTitle colored='Books, Past Papers, Notes' simple='For Punjab University' className='text-center'/>

      {/* <p className="text-lg text-center my-16 w-4/6 mx-auto">
        Welcome to our comprehensive academic forum! Access past papers, university notes, books, and essential study materials for your BS 4-year program. Join a community dedicated to learning and sharing knowledge. Explore, download, and contribute to enrich your academic journey with us today!
      </p> */}

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

      
      {isLoading && resources?.length === 0 ? (
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
      ) : resources?.length === 0 ? (
        <p className="text-center text-gray-500 mt-5">Nothing here.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-10">
          {resources?.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} />
          ))}
        </div>
      )}

      {resources?.length !== 0 && !error && hasMore && !isLoadingMore && (
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
