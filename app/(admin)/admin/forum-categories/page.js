"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import Skeleton from "react-loading-skeleton";
import Pagination from "@/app/(admin)/components/admin/Pagination";
import SearchInput from "@/app/(admin)/components/admin/SearchInput";
import GeneralExportButton from "@/app/(admin)/components/admin/GeneralExportButton";
import LinkButton from "@/app/components/LinkButton";
import { BiPlus } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";
import Link from "next/link";

export default function CategoriesPage() {
  const count = 10;
  const exportCount = 1000;
  const [categories, setCategories] = useState([]);
  const [totalResults, setTotalResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const getCategories = async (currentPage, query = "") => {
    currentPage === 1 ? setLoading(true) : setIsLoadingMore(true);

    const data = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/categories?limit=${count}&page=${currentPage}&query=${query}`
    );

    setCategories((prevCategories) =>
      currentPage === 1 ? data.data : [...prevCategories, ...data.data]
    );
    setTotalResults(data.totalResults);
    setLoading(false);
    setIsLoadingMore(false);
  };

  useEffect(() => {
    getCategories(page, searchQuery);
  }, [page]);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setCategories([]);
    getCategories(1, query);
  };

  const requestData = async (resouce, count) => {
    const data = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/categories?limit=${count}`
    );
    return data.data;
  };

  const columns = [
    "Name",
    "Description",
    "Slug",
    "Added Date",
    "Updated Date",
    "Edit",
    "Delete",
  ];

  return (
    <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow overflow-auto">
      <div className="flex flex-col items-center justify-between mb-6">
        <div className="flex w-full items-center justify-between gap-4">
          <GeneralExportButton
            resource="categories"
            count={exportCount}
            requestData={requestData}
            icon={<FiDownload className="text-accent-500 mr-2" />}
          />
          <LinkButton
            link="/admin/forum-categories/new"
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
            {columns.map((column, i) => (
              <th key={i} className="py-3 px-5 text-center">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading &&
            page === 1 &&
            Array.from({ length: count }).map((_, i) => (
              <tr key={i}>
                {columns.map((_, key) => (
                  <td key={key} className="p-5">
                    <Skeleton width={140} height={20} />
                  </td>
                ))}
              </tr>
            ))}
          {!loading &&
            categories.map((category) => (
              <tr key={category.slug}>
                <td className="p-3 text-center">{category.name}</td>
                <td className="p-3 text-center">
                  {category.description || "—"}
                </td>
                <td className="p-3 text-center">{category.slug}</td>
                <td className="p-3 text-center">
                  {category.createdAt
                    ? new Date(category.createdAt).toLocaleString()
                    : ""}
                </td>
                <td className="p-3 text-center">
                  {category.updatedAt
                    ? new Date(category.updatedAt).toLocaleString()
                    : ""}
                </td>
                <td className="p-3 text-center">
                  <Link
                    href={`/admin/forum-categories/${category.slug}/edit`}
                    className="text-accent-500 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
                <td className="p-3 text-center">
                  <Link
                    href={`/admin/forum-categories/${category.slug}/delete`}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))}

          {isLoadingMore &&
            Array.from({ length: count }).map((_, i) => (
              <tr key={`load-more-${i}`}>
                {columns.map((_, key) => (
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
