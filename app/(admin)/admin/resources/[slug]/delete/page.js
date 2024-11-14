"use client";

import { useRouter } from "next/navigation";
import ClickButton from "@/app/components/ClickButton";
import Link from "next/link";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import { toast } from "react-toastify";
import { removeOlderCacheAfterMutation } from "@/app/utils/caching";
import { useState } from "react";

const DeleteResourcePage = ({ params: { slug } }) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async (e) => {
    setDeleting(true);
    e.preventDefault();
    try {
      const data = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/${slug}`,
        "DELETE"
      );

      removeOlderCacheAfterMutation("/api/resources");
      setDeleting(false);
      toast.success("Resource deleted successfully!");
      router.push("/admin/resources");
    } catch (error) {
      setDeleting(false);
      toast.error("Failed to delete resource. " + error?.message);
      console.error("Failed to delete resource", error);
    }
  };

  return (
    <>
      <ClickButton
        onClick={() => router.push("/admin/resources")}
        text={"Go Back"}
      />

      <div className="my-10 px-4">
        <h2 className="text-xl my-4">
          Are you sure to Delete ({slug?.toUpperCase()?.split(" ")}) ?
        </h2>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <button
            type="submit"
            disabled={deleting}
            className={`inline-flex cursor-pointer items-center space-x-2 py-2 px-4  text-accent-900 bg-red-600 hover:bg-red-700 rounded-lg text-center`}
          >
            {deleting ? "Deleting" : "Delete"}
          </button>
          <Link
            href="/admin/resources"
            className={`inline-flex cursor-pointer items-center space-x-2 py-2 px-4  text-accent-900 bg-accent-100 hover:bg-accent-200 dark:bg-accent-300 dark:hover:bg-accent-400 rounded-lg text-center`}
          >
            Cancel
          </Link>
        </form>
      </div>
    </>
  );
};

export default DeleteResourcePage;
