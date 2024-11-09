"use client";

import React, { useState, useEffect } from "react";
import TextInputField from "@/app/components/TextInputField";
import gravatarUrl from "gravatar-url";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import Spinner from "@/app/components/Spinner";
import { toast } from "react-toastify";

const UpdateAdminProfile = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [gravatar, setGravatar] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Update gravatar URL whenever email changes
  useEffect(() => {
    setGravatar(
      gravatarUrl(email.includes("@") ? email : "example@gmail.com", {
        size: 200,
        default: "retro",
      })
    );
  }, [email]);

  const handleSubmit = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    try {
      const data = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/admin/update-admin`,
        "PUT",
        {
          email,
          username,
          profileImage: gravatar,
        }
      );
      setSubmitting(false);
      toast.success("Profile updated successfully!"); // Success toast
    } catch (error) {
      setSubmitting(false);
      toast.error(`Error updating profile: ${error.message}`); // Error toast
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
          placeholder="Enter new username"
          required
        />
        <TextInputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email for gravatar"
          required
        />
        {/* Show the gravatar preview if available */}
        {gravatar && (
          <div className="flex justify-center mt-4">
            <img
              src={gravatar}
              alt="Gravatar"
              className="rounded-full border border-gray-300"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={submitting || email === "" || username === ""}
          className="btn-primary bg-accent-600 dark:bg-accent-700 rounded-full py-4 px-6 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? <Spinner /> : "Update Admin"}
        </button>
      </form>
    </>
  );
};

export default UpdateAdminProfile;
