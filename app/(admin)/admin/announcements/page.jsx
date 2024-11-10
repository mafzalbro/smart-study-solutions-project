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

export default function AnnouncementsPage() {
  const count = 10;
  const exportCount = 1000;
  const [announcements, setAnnouncements] = useState([]);
  const [totalResults, setTotalResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const getAnnouncements = async (currentPage, query = "") => {
    currentPage === 1 ? setLoading(true) : setIsLoadingMore(true);

    const data = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/announcements?limit=${count}&page=${currentPage}&query=${query}`
    );

    setAnnouncements((prevAnnouncements) =>
      currentPage === 1 ? data.data : [...prevAnnouncements, ...data.data]
    );
    setTotalResults(data.totalResults);
    setLoading(false);
    setIsLoadingMore(false);
  };

  useEffect(() => {
    getAnnouncements(page, searchQuery);
  }, [page]);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setAnnouncements([]);
    getAnnouncements(1, query);
  };

  const requestData = async (resource, count) => {
    const data = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/announcements?limit=${count}`
    );
    return data.data;
  };

  const columns = [
    "Image",
    "Title",
    "Description",
    "Button Text",
    "Button Link",
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
            resource="announcements"
            count={exportCount}
            requestData={requestData}
            icon={<FiDownload className="text-accent-500 mr-2" />}
          />
          <LinkButton
            link="/admin/announcements/new"
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
            announcements.map((announcement) => (
              <tr key={announcement._id}>
                <td className="p-4 w-80">
                  {announcement.image ? (
                    <img
                      src={announcement.image}
                      className="h-full w-full object-cover rounded-md"
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="p-3 text-center">{announcement.title}</td>
                <td className="p-3 text-center">
                  {announcement.description || "—"}
                </td>
                <td className="p-3 text-center">{announcement.btnText}</td>
                <td className="p-3 text-center">
                  <a
                    href={announcement.btnLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Link
                  </a>
                </td>
                <td className="p-3 text-center">
                  {announcement.createdAt
                    ? new Date(announcement.createdAt).toLocaleString()
                    : ""}
                </td>
                <td className="p-3 text-center">
                  {announcement.updatedAt
                    ? new Date(announcement.updatedAt).toLocaleString()
                    : ""}
                </td>
                <td className="p-3 text-center">
                  <Link
                    href={`/admin/announcements/${announcement._id}/edit`}
                    className="text-accent-500 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
                <td className="p-3 text-center">
                  <Link
                    href={`/admin/announcements/${announcement._id}/delete`}
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
