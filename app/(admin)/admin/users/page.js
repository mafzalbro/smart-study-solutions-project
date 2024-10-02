// pages/admin/users/index.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import Skeleton from "react-loading-skeleton";
// import LinkButton from "@/app/components/LinkButton";
// import { BiPlus } from "react-icons/bi";

export default function Users() {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const count = 6;

  const getUsers = async () => {
    try {
      const data = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/user?limit=${count}`
      );
      setUsers(data.data);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

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
    <div className="p-4">
      {/* <LinkButton
        link="/admin/users/new"
        text="Add New User"
        icon={<BiPlus />}
        className="mb-4"
      /> */}
      <table className="w-full overflow-x-scroll block">
        <thead>
          <tr className="border text-center border-neutral-300 dark:border-neutral-600 bg-neutral-300 dark:bg-primary text-semibold">
            {categories.map((category, i) => (
              <th className="p-4" key={i}>
                {category}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array(count)
                .fill()
                .map((_, i) => (
                  <tr key={i}>
                    {categories.map((category) => (
                      <td className="px-2 py-1" key={category}>
                        <Skeleton width={140} height={50} />
                      </td>
                    ))}
                  </tr>
                ))
            : users?.map((user) => (
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
                  {
                    <td className="p-4">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleString()
                        : "N/A"}
                    </td>
                  }
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
        </tbody>
      </table>
    </div>
  );
}
