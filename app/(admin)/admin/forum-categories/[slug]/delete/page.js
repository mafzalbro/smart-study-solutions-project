"use client";

import { useRouter } from "next/navigation";
import ClickButton from "@/app/components/ClickButton";
import Link from "next/link";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import { toast } from "react-toastify";
import { removeOlderCacheAfterMutation } from "@/app/utils/caching";

const DeleteForumCategoriesPage = ({ params: { slug } }) => {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/category/${slug}`,
        "DELETE"
      );
      removeOlderCacheAfterMutation("/api/qna/categories");
      toast.success("Category deleted successfully!");
      router.push("/admin/forum-categories");
    } catch (error) {
      toast.error("Failed to delete category. " + error);
      console.error("Failed to delete category", error);
    }
  };

  return (
    <>
      <ClickButton
        onClick={() => router.push("/admin/forum-categories")}
        text={"Go Back"}
      />

      <div className="my-10 px-4">
        <h2 className="text-xl my-4">Are you sure to Delete this Category?</h2>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <button
            type="submit"
            className={`inline-flex cursor-pointer items-center space-x-2 py-2 px-4 text-accent-900 bg-red-600 hover:bg-red-700 rounded-lg text-center`}
          >
            Delete
          </button>
          <Link
            href="/admin/forum/categories"
            className={`inline-flex cursor-pointer items-center space-x-2 py-2 px-4 text-accent-900 bg-accent-100 hover:bg-accent-200 dark:bg-accent-300 dark:hover:bg-accent-400 rounded-lg text-center`}
          >
            Cancel
          </Link>
        </form>
      </div>
    </>
  );
};

export default DeleteForumCategoriesPage;
