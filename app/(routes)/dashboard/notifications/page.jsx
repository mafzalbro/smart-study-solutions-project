"use client";

import { useState, useEffect } from "react";
import { fetcher } from "@/app/utils/fetcher"; // Custom fetcher utility
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ClickButton from "@/app/components/ClickButton";
import { AiOutlineCheckCircle, AiOutlineDelete } from "react-icons/ai"; // Icons for actions
import { removeOlderCacheAfterMutation } from "@/app/utils/caching";

const Notifications = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if there are any unread notifications
  const hasUnreadNotifications = (
    Array.isArray(notifications) ? notifications : []
  )?.some((notification) => !notification.read);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/notifications/user`
      );
      setNotifications(response || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/notifications/user/mark-all-as-read`,
        "PATCH"
      );
      removeOlderCacheAfterMutation("/api/notifications");
      fetchNotifications();
      toast.success("All notifications marked as read!");
    } catch (error) {
      toast.error("Failed to mark all notifications as read.");
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/notifications/user/delete-all`,
        "DELETE"
      );
      setNotifications([]);
      toast.success("All notifications deleted!");
    } catch (error) {
      toast.error("Failed to delete notifications.");
    }
  };

  return (
    <div className="mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <ClickButton onClick={() => router.push("/dashboard")} text="Go Back" />

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6">
        Notifications
      </h2>

      <div className="overflow-hidden rounded-lg mt-6">
        <div className="px-2 py-5 sm:px-6">
          <div className="flex justify-between flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={markAllAsRead}
              disabled={!hasUnreadNotifications} // Disable if no unread notifications
              className={`${
                !hasUnreadNotifications
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              } mr-2 text-white px-4 py-2 rounded-lg focus:outline-none`}
            >
              <AiOutlineCheckCircle className="inline-block mr-2" />
              {hasUnreadNotifications
                ? "Mark All as Read"
                : "All Notifications Marked as Read"}
            </button>
            <button
              onClick={deleteAllNotifications}
              disabled={notifications.length === 0} // Disable if no notifications
              className={`${
                notifications.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              } text-white px-4 py-2 rounded-lg focus:outline-none`}
            >
              <AiOutlineDelete className="inline-block mr-2" />
              {notifications.length === 0
                ? "No Notifications to Delete"
                : "Delete All"}
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-600">
          {loading ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-300">
              Loading...
            </div>
          ) : (
            <ul>
              {notifications?.length > 0 ? (
                notifications?.map((notification) => (
                  <li
                    key={notification._id}
                    className={`flex justify-between items-center px-4 py-4 sm:px-6 ${
                      notification.read
                        ? "bg-gray-100 dark:bg-gray-900"
                        : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.message}
                        </p>
                        {notification?.questionId && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                            Related to question:{" "}
                            <a
                              href={`/forum/${notification.questionId}`}
                              className="text-blue-500 dark:text-blue-300"
                            >
                              View Question
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-center py-4 text-gray-500 dark:text-gray-300">
                  No notifications yet.
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
