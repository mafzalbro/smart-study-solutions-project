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
import { removeOlderCacheAfterMutation } from "@/app/utils/caching";

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

  // Degree management state
  const [degrees, setDegrees] = useState([
    "BSIT",
    "BSCS",
    "BSSE",
    "BSEE",
    "BSME",
    "BSCE",
    "BSCE_Civil",
    "BSBio",
    "BSPhysics",
    "BSChemistry",
  ]);
  const [newDegree, setNewDegree] = useState("");

  // Add new degree dynamically
  const handleAddDegree = () => {
    if (newDegree && !degrees.includes(newDegree)) {
      setDegrees([...degrees, newDegree]);
      setNewDegree("");
      toast.success("Degree added successfully!");
    } else if (!newDegree) {
      toast.error("Please enter a valid degree.");
    } else {
      toast.error("Degree already exists.");
    }
  };

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
      removeOlderCacheAfterMutation("/api/resources");
      toast.success("Resource added successfully!");
      router.push("/admin/resources");
    } catch (error) {
      toast.error(
        "Failed to add resource." + (error ? JSON.stringify(error) : "")
      );
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
              setTitle(e.target.value);
              handleSlugGeneration();
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
          />
          <select
            name="semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-neutral-600"
            required
          >
            <option value="" disabled>
              Select Semester...
            </option>
            {[
              "1st Semester",
              "2nd Semester",
              "3rd Semester",
              "4th Semester",
              "5th Semester",
              "6th Semester",
              "7th Semester",
              "8th Semester",
            ].map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
          <div className="space-y-2">
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
              {degrees.map((deg, idx) => (
                <option key={idx} value={deg}>
                  {deg}
                </option>
              ))}
            </select>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newDegree}
                onChange={(e) => setNewDegree(e.target.value)}
                placeholder="Add new degree..."
                className="flex-grow p-2 border rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-neutral-600"
              />
              <button
                type="button"
                onClick={handleAddDegree}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
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
          <div className="flex items-center gap-2 my-4 border-t pt-4 dark:border-gray-500">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Want to publish?
            </label>
            <input
              type="checkbox"
              id="status"
              checked={status}
              onChange={() => setStatus((prev) => !prev)}
              className="w-4 h-4"
            />
          </div>
          <button
            type="submit"
            className={`inline-flex items-center space-x-2 py-2 px-4 rounded-lg ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
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
