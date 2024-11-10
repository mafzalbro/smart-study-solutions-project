"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ClickButton from "@/app/components/ClickButton";
import TextInputField from "@/app/(admin)/components/admin/TextInputField";
import TextAreaInputField from "@/app/(admin)/components/admin/TextAreaInputField";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import { removeOlderCacheAfterMutation } from "@/app/utils/caching";

const AddCategoryPage = () => {
  const router = useRouter();

  // State variables
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update slug whenever the name changes (debounced)
  const handleSlugGeneration = () => {
    const slugifiedName = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setSlug(slugifiedName);
  };

  const handleValidation = () => {
    if (!name || !description || !slug) {
      toast.error("Please fill out all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!handleValidation()) return;

    setIsLoading(true);

    try {
      const newCategory = {
        name,
        description,
        slug,
      };

      await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/category`,
        "POST",
        newCategory
      );
      removeOlderCacheAfterMutation("/api/qna/categories")
      toast.success("Category added successfully!");
      router.push("/admin/forum-categories");
    } catch (error) {
      toast.error("Failed to add category.");
      console.error("Failed to add category", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ClickButton
        onClick={() => router.push("/admin/forum-categories")}
        text={"Go Back"}
      />

      <div className="my-10 px-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextInputField
            name="name"
            type="text"
            value={name}
            onChange={(e) => {
              handleSlugGeneration();
              setName(e.target.value);
            }}
            placeholder="Enter category name"
            required={true}
          />
          <TextInputField
            name="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Enter category slug"
            required={true}
          />
          <TextAreaInputField
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            required={true}
          />
          <button
            type="submit"
            className={`inline-flex text-black cursor-pointer text-center items-center space-x-2 py-2 px-4 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-accent-100 hover:bg-accent-200 dark:bg-accent-300 dark:hover:bg-accent-400"
            } rounded-lg text-center`}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Add Category"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddCategoryPage;
