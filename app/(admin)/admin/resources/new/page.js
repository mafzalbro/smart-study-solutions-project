"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ClickButton from "@/app/components/ClickButton";
import TextInputField from "@/app/(admin)/components/admin/TextInputField";
import TextAreaInputField from "@/app/(admin)/components/admin/TextAreaInputField";
import FileUploadComponent from "@/app/(admin)/components/admin/FileUploadComponent";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";

const AddResourcePage = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Individual state variables for each field
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [slug, setSlug] = useState("");
  const [source, setSource] = useState("");
  const [semester, setSemester] = useState("");
  const [degree, setDegree] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState(false);
  const [imageBase64, setImageBase64] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update slug whenever the title changes (debounced)
  const handleSlugGeneration = () => {
    const slugifiedTitle = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    setSlug(slugifiedTitle);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedFile = await imageCompression(file, { maxSizeMB: 0.1 });
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageBase64(reader.result);
          setProfileImage(URL.createObjectURL(compressedFile));
        };
        reader.readAsDataURL(compressedFile);
        toast.success("Image loaded successfully!");
      } catch (error) {
        toast.error("Error loading image.");
        console.error("Error loading image", error);
      }
    }
  };

  const handleValidation = () => {
    if (!title || !description || !semester || !degree || !slug || !type) {
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
      const newResource = {
        title,
        author,
        description,
        tags,
        source,
        semester,
        degree,
        type,
        slug,
        status,
        profileImage: imageBase64,
      };

      await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/add`,
        "POST",
        newResource
      );
      toast.success("Resource added successfully!");
      router.push("/admin/resources");
    } catch (error) {
      toast.error("Failed to add resource.");
      console.error("Failed to add resource", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImageBase64(null);
    fileInputRef.current.value = "";
  };

  return (
    <>
      <ClickButton
        onClick={() => router.push("/admin/resources")}
        text={"Go Back"}
      />

      <div className="my-10 px-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextInputField
            name="title"
            type="text"
            value={title}
            onChange={(e) => {
              handleSlugGeneration();
              setTitle(e.target.value);
            }}
            placeholder="Enter the title"
            required={true}
          />
          <TextInputField
            name="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter the author (optional)"
          />
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            You can't change slug later so be carefull in setting up...
          </label>
          <TextInputField
            name="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Enter the slug"
            required={true}
          />
          <TextAreaInputField
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
          <TextInputField
            name="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags (comma separated)"
          />
          <TextInputField
            name="source"
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Enter source e.g., Google Drive Link"
            required={true}
          />
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
            Semester:
          </label>
          <select
            name="semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-neutral-600"
            required={true}
          >
            <option value="" disabled>
              Select Semester...
            </option>
            <option value="semester 1">1st Semester</option>
            <option value="semester 2">2nd Semester</option>
            <option value="semester 3">3rd Semester</option>
            <option value="semester 4">4th Semester</option>
            <option value="semester 5">5th Semester</option>
            <option value="semester 6">6th Semester</option>
            <option value="semester 7">7th Semester</option>
            <option value="semester 8">8th Semester</option>
          </select>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
            Degree:
          </label>
          <select
            name="degree"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-neutral-600"
            required
          >
            <option value="" disabled>
              Select Degree...
            </option>
            <option value="bsit">BSIT</option>
            <option value="bscs">BSCS</option>
            <option value="bsbio">BSBIO</option>
          </select>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
            Type:
          </label>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-neutral-600"
            required
          >
            <option value="" disabled>
              Select Type...
            </option>
            <option value="notes">Notes</option>
            <option value="past papers">Past Papers</option>
            <option value="books">Books</option>
          </select>
          <FileUploadComponent
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            setImageBase64={setImageBase64}
            fileInputRef={fileInputRef}
            handleImageUpload={handleImageUpload}
            handleRemoveImage={handleRemoveImage}
          />
          <div className="flex gap-2 my-4 border-t pt-4 dark:border-gray-500">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Want to publish?
            </label>

            <input
              type="checkbox"
              id="status"
              value={status}
              onChange={() => setStatus((prev) => !prev)}
            />
          </div>
          <button
            type="submit"
            className={`inline-flex text-black cursor-pointer text-center items-center space-x-2 py-2 px-4 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-accent-100 hover:bg-accent-200 dark:bg-accent-300 dark:hover:bg-accent-400"
            } rounded-lg text-center`}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Add Resource"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddResourcePage;
