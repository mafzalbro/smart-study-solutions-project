"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import Pagination from "@/app/(admin)/components/admin/Pagination";
import SearchInput from "@/app/(admin)/components/admin/SearchInput";
import GeneralExportButton from "@/app/(admin)/components/admin/GeneralExportButton";
import Skeleton from "react-loading-skeleton";
import { FiDownload } from "react-icons/fi";
import Link from "next/link";
import { removeOlderCacheAfterMutation } from "@/app/utils/caching";

export default function Notifications() {
  const count = 10; // Number of notifications per page
  const exportCount = 1000; // Export count for the general export
  const [notifications, setNotifications] = useState([]);
  const [totalResults, setTotalResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteLoading, setDeleteLoading] = useState(false); // Loading state for delete
  const [markAsReadLoading, setMarkAsReadLoading] = useState(false); // Loading state for marking as read

  const getNotifications = async (currentPage, query = "") => {
    currentPage === 1 ? setLoading(true) : setIsLoadingMore(true);

    const data = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/notifications?limit=${count}&page=${currentPage}&query=${query}`
    );

    setNotifications((prevNotifications) =>
      currentPage === 1 ? data.data : [...prevNotifications, ...data.data]
    );
    setTotalResults(data.totalResults);
    setLoading(false);
    setIsLoadingMore(false);
  };

  useEffect(() => {
    getNotifications(page, searchQuery);
  }, [page]);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setNotifications([]);
    getNotifications(1, query);
  };

  const requestData = async (resource, count) => {
    const data = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/notifications?limit=${count}`
    );
    return data.data;
  };

  const handleDeleteAll = async () => {
    setDeleteLoading(true); // Set loading state when delete is triggered

    // Call API to delete all notifications (example)
    await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/notifications/delete-all`,
      "DELETE"
    );

    removeOlderCacheAfterMutation(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/notifications`
    );

    // Fetch updated notifications after deletion
    getNotifications(page, searchQuery);

    setDeleteLoading(false); // Reset loading state after deletion
  };

  const handleMarkAllAsRead = async () => {
    setMarkAsReadLoading(true); // Set loading state when marking as read

    // Call API to mark all notifications as read (example)
    await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/notifications/mark-all-as-read`,
      "PATCH"
    );

    removeOlderCacheAfterMutation(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/notifications`
    );

    // Fetch updated notifications after marking as read
    getNotifications(page, searchQuery);

    setMarkAsReadLoading(false); // Reset loading state after marking as read
  };

  const categories = [
    "Message",
    "Status",
    "User",
    "Question ID",
    "Type",
    "Reason",
    "Created At",
    "Sent At",
  ];

  return (
    <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow overflow-auto">
      <div className="flex flex-col gap-2 sm:flex-row items-center justify-between mb-6">
        <div className="flex items-center justify-between w-full gap-4">
          <GeneralExportButton
            resource="notifications"
            count={exportCount}
            requestData={requestData}
            icon={<FiDownload className="text-blue-500 mr-2" />}
          />
        </div>
        <div className="flex items-center gap-2 w-full">
          <SearchInput onSearch={handleSearch} debounceDelay={1000} />
        </div>
      </div>

      {/* Action buttons for Mark as Read and Delete All */}
      <div className="mb-4 flex justify-between">
        <button
          onClick={handleMarkAllAsRead}
          disabled={markAsReadLoading}
          className="bg-green-500 rounded-lg text-white py-2 disabled:bg-gray-400 px-6"
        >
          {markAsReadLoading ? "Marking..." : "Mark All as Read"}
        </button>
        <button
          onClick={handleDeleteAll}
          disabled={deleteLoading}
          className="bg-red-500 text-white rounded-lg py-2 disabled:bg-gray-400 px-6"
        >
          {deleteLoading ? "Deleting..." : "Delete All"}
        </button>
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
            notifications.map((notification) => (
              <tr key={notification._id} className="text-center">
                <td className="p-4">{notification.message || "N/A"}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                      notification.read === false
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {notification.read === false ? "Unread" : "Already Read"}
                  </span>
                </td>
                <td className="p-4">{notification.user_id || "N/A"}</td>
                <td className="p-4">{notification.questionId || "N/A"}</td>
                <td className="p-4">{notification.type || "N/A"}</td>
                <td className="p-4">{notification.reason || "N/A"}</td>
                <td className="p-4">
                  {notification.created_at
                    ? new Date(notification.created_at).toLocaleString()
                    : "N/A"}
                </td>
                <td className="p-4">
                  {notification.sent_at
                    ? new Date(notification.sent_at).toLocaleString()
                    : "N/A"}
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
