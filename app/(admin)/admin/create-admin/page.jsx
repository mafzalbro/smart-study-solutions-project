"use client";

import React, { useState, useEffect } from "react";
import TextInputField from "@/app/components/TextInputField";
import PasswordInput from "@/app/components/PasswordInput";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import { useRouter } from "next/navigation";
import Spinner from "@/app/components/Spinner";
import gravatarUrl from "gravatar-url";
import { toast } from "react-toastify";

const CreateAdmin = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState("");

  // Update avatar URL whenever the email changes
  useEffect(() => {
    if (email.includes("@")) {
      const url = gravatarUrl(email, {
        size: 200,
        default: "retro", // Fallback avatar style
      });
      setAvatarUrl(url);
    }
  }, [email]);

  const handleSubmit = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    try {
      const data = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/admin/create`,
        "POST",
        {
          username,
          email,
          password,
          avatar: avatarUrl,
        }
      );
      setSubmitting(false);
      toast.success("Admin created successfully!"); // Success toast
      router.push("/admin/admins-list");
    } catch (error) {
      setSubmitting(false);
      toast.error(`Error creating admin: ${error.message}`); // Error toast
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
        <TextInputField
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter admin username"
          required
        />
        <TextInputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter admin email"
          required
        />
        {/* Show the avatar preview if available */}
        {avatarUrl && (
          <div className="flex justify-center mt-4">
            <img
              src={avatarUrl}
              alt="Generated Avatar"
              className="rounded-full border border-gray-300"
            />
          </div>
        )}
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />
        <button
          type="submit"
          disabled={
            submitting || email === "" || username === "" || password === ""
          }
          className="btn-primary bg-accent-600 dark:bg-accent-700 rounded-full py-4 px-6 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? <Spinner /> : "Create Admin"}
        </button>
      </form>
    </>
  );
};

export default CreateAdmin;
