// pages/admin/users/[slug]/edit.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import TextInputField from "@/app/(admin)/components/admin/TextInputField";
import { toast } from "react-toastify";

const EditUserPage = ({ params: { slug } }) => {
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [favoriteGenre, setFavoriteGenre] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/user/${slug}`);
        setUsername(userData.username);
        setEmail(userData.email);
        setFavoriteGenre(userData.favoriteGenre);
        setRole(userData.role);
        setFullName(userData.fullname);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = { username, fullname, email, favoriteGenre, role };
      await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/user/${slug}`, "PUT", updatedUser);
      toast.success("User updated successfully!");
      router.push("/admin/users");
    } catch (error) {
      toast.error("Failed to update user");
      console.error("Error updating user", error);
    }
  };

  return (
    <div className="p-4">
      <button onClick={() => router.back()} className="text-blue-500 mb-4">Go Back</button>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {loading ? (
          <p>Loading user data...</p>
        ) : (
          <>
            <TextInputField
              name="fullname"
              placeholder="Enter Full Name"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
            />
            <TextInputField
              name="username"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextInputField
              name="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInputField
              name="favoriteGenre"
              placeholder="Favorite Genre"
              value={favoriteGenre}
              onChange={(e) => setFavoriteGenre(e.target.value)}
            />
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Role:
            </label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-neutral-600"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>

            <button
              type="submit"
              className="py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Save Changes
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default EditUserPage;
