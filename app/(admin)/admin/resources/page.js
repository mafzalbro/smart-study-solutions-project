"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import AdminResourceCard from "../../components/resources/AdminResourceCard";
import Skeleton from "react-loading-skeleton";
import Pagination from "@/app/(admin)/components/admin/Pagination";
import SearchInput from "@/app/(admin)/components/admin/SearchInput";
import GeneralExportButton from "@/app/(admin)/components/admin/GeneralExportButton";
import LinkButton from "@/app/components/LinkButton";
import { BiPlus } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";

export default function Resources() {
  const count = 10;  // Number of resources per page
  const exportCount = 1000;  // Export count for the general export
  const [resources, setResources] = useState([]);
  const [totalResults, setTotalResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const getResources = async (currentPage, query = "") => {
    currentPage === 1 ? setLoading(true) : setIsLoadingMore(true);

    const data = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/admin?showFullJSON=true&limit=${count}&page=${currentPage}&query=${query}`
    );

    setResources((prevResources) =>
      currentPage === 1 ? data.results.data : [...prevResources, ...data.results.data]
    );
    setTotalResults(data.results.totalResults);
    setLoading(false);
    setIsLoadingMore(false);
  };

  useEffect(() => {
    getResources(page, searchQuery);
  }, [page]);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setResources([]);
    getResources(1, query);
  };

  const requestData = async (resource, count) => {
    const data = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/admin?limit=${count}&showFullJSON=true`
    );
    return data.results.data;
  };

  const categories = [
    "Image",
    "Title",
    "Rating",
    "Rating Count",
    "Likes",
    "Dislikes",
    "Semester",
    "Degree",
    "Type",
    "Tags",
    "Created At",
    "Last Updated",
    "Slug",
    "PDF Link",
    "Edit",
    "Delete",
  ];

  return (
    <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow overflow-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <div className="flex w-full items-center justify-between gap-4">
          <GeneralExportButton
            resource="resources"
            count={exportCount}
            requestData={requestData}
            icon={<FiDownload className="text-blue-500 mr-2" />}
          />
          <LinkButton
            link="/admin/resources/new"
            text="Add New"
            icon={<BiPlus />}
            className="!mb-6"
          />
        </div>
        <div className="flex items-center gap-2 w-full">
          <SearchInput onSearch={handleSearch} debounceDelay={1000} />
        </div>
      </div>

      <table className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden shadow">
        <thead>
          <tr className="bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold">
            {categories.map((category, i) => (
              <th key={i} className="py-3 px-5 text-center">
                {category}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && page === 1 && Array.from({ length: count }).map((_, i) => (
            <tr key={i}>
              {categories.map((_, key) => (
                <td key={key} className="p-5">
                  <Skeleton width={140} height={20} />
                </td>
              ))}
            </tr>
          ))}
          {!loading && resources.map((resource) => (
            <AdminResourceCard
              key={resource?._id}
              resource={resource}
              className="transition duration-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
            />
          ))}
          {isLoadingMore && Array.from({ length: count }).map((_, i) => (
            <tr key={`load-more-${i}`}>
              {categories.map((_, key) => (
                <td key={key} className="p-5">
                  <Skeleton width={140} height={20} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        page={page}
        totalResults={totalResults}
        count={count}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
