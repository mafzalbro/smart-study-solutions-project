"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import Pagination from "@/app/(admin)/components/admin/Pagination";
import SearchInput from "@/app/(admin)/components/admin/SearchInput";
import GeneralExportButton from "@/app/(admin)/components/admin/GeneralExportButton";
import LinkButton from "@/app/components/LinkButton";
import Skeleton from "react-loading-skeleton";
import { BiPlus } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";
import Link from "next/link";

export default function Admins() {
  const count = 10; // Number of admins per page
  const exportCount = 1000; // Export count for the general export
  const [admins, setAdmins] = useState([]);
  const [totalResults, setTotalResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const getAdmins = async (currentPage, query = "") => {
    currentPage === 1 ? setLoading(true) : setIsLoadingMore(true);

    const data = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/admin?limit=${count}&page=${currentPage}&query=${query}`
    );

    setAdmins((prevAdmins) =>
      currentPage === 1 ? data.admins : [...prevAdmins, ...data.admins]
    );
    setTotalResults(data.totalAdmins);
    setLoading(false);
    setIsLoadingMore(false);
  };

  useEffect(() => {
    getAdmins(page, searchQuery);
  }, [page]);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setAdmins([]);
    getAdmins(1, query);
  };

  const requestData = async (resource, count) => {
    const data = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/admin?limit=${count}`
    );
    return data.admins;
  };

  const categories = [
    "Image",
    // "Name",
    "Username",
    "Email",
    "Role",
    "Joined Date",
    // "Edit",
    // "Delete",
  ];

  return (
    <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow overflow-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <div className="flex items-center justify-between w-full gap-4">
          <GeneralExportButton
            resource="admins"
            count={exportCount}
            requestData={requestData}
            icon={<FiDownload className="text-blue-500 mr-2" />}
          />
          <LinkButton
            link="/admin/admins/new"
            text="Add New Admin"
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
          {loading &&
            page === 1 &&
            Array.from({ length: count }).map((_, i) => (
              <tr key={i}>
                {categories.map((_, key) => (
                  <td key={key} className="p-5">
                    <Skeleton width={140} height={20} />
                  </td>
                ))}
              </tr>
            ))}
          {!loading &&
            admins.map((admin) => (
              <tr key={admin._id} className="text-center">
                <td className="p-2 h-20 w-20">
                  {admin?.profileImage && (
                    <img
                      src={admin?.profileImage}
                      alt={admin.username}
                      className="rounded-full overflow-hidden h-full w-full object-cover"
                    />
                  )}
                </td>
                {/* <td className="p-4">{admin.fullname}</td> */}
                <td className="p-4">{admin.username}</td>
                <td className="p-4">{admin.email}</td>
                <td className="p-4">{admin.role}</td>
                <td className="p-4">
                  {admin.createdAt
                    ? new Date(admin.createdAt).toLocaleString()
                    : "N/A"}
                </td>
                {/* <td className="p-4">
                  <Link
                    href={`/admin/admins/${admin.slug}/edit`}
                    className="text-blue-500"
                  >
                    Edit
                  </Link>
                </td> */}
                {/* <td className="p-4">
                  <Link
                    href={`/admin/admins/${admin.slug}/delete`}
                    className="dark:hover:text-red-700 hover:text-red-900 text-red-700 dark:text-red-400"
                  >
                    Delete
                  </Link>
                </td> */}
              </tr>
            ))}
          {isLoadingMore &&
            Array.from({ length: count }).map((_, i) => (
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
