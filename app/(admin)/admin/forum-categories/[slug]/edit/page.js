"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ClickButton from "@/app/components/ClickButton";
import TextInputField from "@/app/(admin)/components/admin/TextInputField";
import TextAreaInputField from "@/app/(admin)/components/admin/TextAreaInputField";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import { toast } from "react-toastify";
import { removeOlderCacheAfterMutation } from "@/app/utils/caching";

const EditCategoryPage = ({ params: { slug } }) => {
  const router = useRouter();

  // State variables for category properties
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slugDisabled, setSlugDisabled] = useState(true);  // Slug should be disabled

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await fetcher(
          `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/category/${slug}`
        );
        setName(data.name);
        setDescription(data.description);
        setSlugDisabled(data.slug)
      } catch (error) {
        console.error("Failed to fetch category", error);
      }
    };
    fetchCategory();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedCategory = { 
        name, 
        description
      };

      await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/category/${slug}`,
        "PUT",
        updatedCategory
      );
      removeOlderCacheAfterMutation("/api/qna/categories");
      toast.success("Category updated successfully!");
      router.push("/admin/forum-categories");
    } catch (error) {
      toast.error("Failed to update category.");
      console.error("Failed to update category", error);
    }
  };

  return (
    <>
      <ClickButton onClick={() => router.push("/admin/forum-categories")} text={"Go Back"} />

      <div className="my-10 px-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextInputField
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
          />

          <TextAreaInputField
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Slug (Cannot be changed)
            </label>
            <input
              type="text"
              name="slug"
              value={slug}
              disabled={slugDisabled}
              className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-neutral-600 disabled:opacity-50"
            />
            <p className="text-sm text-gray-500 dark:text-gray-300">
              The slug cannot be changed once set.
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex cursor-pointer items-center space-x-2 py-2 px-4 text-accent-900 bg-accent-100 hover:bg-accent-200 dark:bg-accent-300 dark:hover:bg-accent-400 rounded-lg text-center"
          >
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
};

export default EditCategoryPage;
