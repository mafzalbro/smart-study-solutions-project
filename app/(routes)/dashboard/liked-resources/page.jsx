"use client";

import { useEffect, useState } from "react";
import { AiOutlineHeart } from "react-icons/ai"; // Liked icon
import ResourceCard from "@/app/components/resources/ResourceCard";
import Pagination from "@/app/components/dashboard/Pagination";
import { fetcher } from "@/app/utils/fetcher";
import { TfiFaceSad } from "react-icons/tfi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LikedResources = () => {
  const count = 1;
  const [likedResources, setLikedResources] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadResources = async (page) => {
    try {
      setLoading(true);
      const data = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/user/liked-resources?page=${page}&limit=${count}`
      );

      if (data?.data) {
        setLikedResources(
          page === 1 ? data.data : (prev) => [...prev, ...data.data]
        );
        setTotalResults(data.totalResults);
      } else {
        setLikedResources([]);
      }
    } catch (error) {
      console.error("Error loading resources", error);
      setError("Error fetching liked resources. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources(page);
  }, [page]);

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
  };

  return (
    <div className="container mx-auto my-8 p-4 space-y-8">
      <h1 className="text-3xl font-semibold mb-6 flex items-center gap-2">
        <AiOutlineHeart size={28} className="text-red-500" />
        Liked Resources
      </h1>

      {loading ? (
        // Display skeletons while loading
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <Skeleton height={20} width="80%" className="mb-2" />
              <Skeleton height={15} width="60%" />
              <Skeleton height={200} className="mt-4" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {!loading && likedResources.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-300 inline-flex gap-4">
              <TfiFaceSad size={24} className="inline-block mb-4" />
              You have no liked resources.
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {likedResources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
        </>
      )}

      <Pagination
        page={page}
        totalResults={totalResults}
        count={count}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default LikedResources;
