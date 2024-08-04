"use client";

import React, { useState, useEffect } from 'react';
import { fetcher } from '@/app/utils/fetcher';
import ResourceCard from '@/app/components/resources/ResourceCard';
import Spinner from '@/app/components/Spinner';
import StylishTitle from '@/app/components/StylishTitle';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResourceSubPage = ({ params }) => {
  const { routes } = params;
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchParams, setFetchParams] = useState({ type: null, tag: null, category: null });

  useEffect(() => {
    // Update fetch parameters based on route
    const updateFetchParams = () => {
      if (routes[0] === 'type') {
        setFetchParams({ type: routes[1], tag: null, category: null });
      } else if (routes[0] === 'tag') {
        setFetchParams({ type: null, tag: routes[1], category: null });
      } else if (routes[0] === 'category') {
        setFetchParams({ type: null, tag: null, category: routes[1] });
      }
    };

    updateFetchParams();
  }, [routes]);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources?`;

        if (fetchParams.type) {
          url += `type=${fetchParams.type}&`;
        }
        if (fetchParams.tag) {
          url += `tag=${fetchParams.tag}&`;
        }
        if (fetchParams.category) {
          url += `category=${fetchParams.category}&`;
        }

        const data = await fetcher(url);
        setResources(data.results.data);
      } catch (error) {
        setError(error);
        toast.error(`Error fetching resources: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [fetchParams]);

  return (
    <section className="p-8 dark:text-white w-full">
      <ToastContainer />
      <StylishTitle
        colored={`Showing resources for ${fetchParams.type || fetchParams.tag || fetchParams.category}`}
        simple=""
        className="text-center"
      />
      
      {isLoading ? (
        <div className="flex justify-center mt-10">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 mt-5">Error fetching resources: {error.message}</p>
      ) : resources.length === 0 ? (
        <p className="text-center text-gray-500 mt-5">No resources found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-10">
          {resources.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ResourceSubPage;
