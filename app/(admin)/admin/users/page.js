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

export default function Users() {
  const count = 10; // Number of users per page
  const exportCount = 1000; // Export count for the general export
  const [users, setUsers] = useState([]);
  const [totalResults, setTotalResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const getUsers = async (currentPage, query = "") => {
    currentPage === 1 ? setLoading(true) : setIsLoadingMore(true);

    const data = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/user/admin?limit=${count}&page=${currentPage}&query=${query}`
    );

    setUsers((prevUsers) =>
      currentPage === 1
        ? data.data
        : [...prevUsers, ...data.results.data]
    );
    setTotalResults(data.totalResults);
    setLoading(false);
    setIsLoadingMore(false);
  };

  useEffect(() => {
    getUsers(page, searchQuery);
  }, [page]);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setUsers([]);
    getUsers(1, query);
  };

  const requestData = async (resource, count) => {
    const data = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/user/admin?limit=${count}`
    );
    return data.results.data;
  };

  const categories = [
    "Image",
    "Name",
    "User Name",
    "Email",
    "Role",
    "Favorite Genre",
    "Created At",
    "Edit",
    "Delete",
  ];

  return (
    <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow overflow-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <div className="flex items-center justify-between w-full gap-4">
          <GeneralExportButton
            resource="users"
            count={exportCount}
            requestData={requestData}
            icon={<FiDownload className="text-blue-500 mr-2" />}
          />
          <LinkButton
            link="/admin/users/new"
            text="Add New User"
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
            users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="p-2 h-20 w-20">
                  {user?.profileImage && (
                    <img
                      src={user?.profileImage}
                      alt={user.username}
                      className="rounded-full overflow-hidden h-full w-full object-cover"
                    />
                  )}
                </td>
                <td className="p-4">{user.fullname}</td>
                <td className="p-4">{user.username}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">{user.favoriteGenre}</td>
                <td className="p-4">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : "N/A"}
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/users/${user.slug}/edit`}
                    className="text-blue-500"
                  >
                    Edit
                  </Link>
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/users/${user.slug}/delete`}
                    className="dark:hover:text-red-700 hover:text-red-900 text-red-700 dark:text-red-400"
                  >
                    Delete
                  </Link>
                </td>
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
