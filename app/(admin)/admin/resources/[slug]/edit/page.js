"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ClickButton from "@/app/components/ClickButton";
import TextInputField from "@/app/(admin)/components/admin/TextInputField";
import TextAreaInputField from "@/app/(admin)/components/admin/TextAreaInputField";
import FileUploadComponent from "@/app/(admin)/components/admin/FileUploadComponent";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";
import { removeOlderCacheAfterMutation } from "@/app/utils/caching";

const EditResourcePage = ({ params: { slug } }) => {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Separate state variables for each resource property
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [semester, setSemester] = useState('');
  const [degree, setDegree] = useState('');
  const [type, setType] = useState('');
  const [imageBase64, setImageBase64] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await fetcher(
          `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/${slug}`
        );
        // Set state variables from fetched resource data
        setTitle(data.title);
        setDescription(data.description);
        setTags(data.tags);
        setSemester(data.semester);
        setDegree(data.degree);
        setType(data.type);
        setProfileImage(data.profileImage); // Set the profile image URL
      } catch (error) {
        console.error("Failed to fetch resource", error);
      }
    };
    fetchResource();
  }, [slug]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedResource = { 
        title, 
        description, 
        tags, 
        semester, 
        degree, 
        type, 
        profileImage: imageBase64 
      };

      await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/${slug}`,
        "PUT",
        updatedResource
      );
      removeOlderCacheAfterMutation("/api/resouces");
      toast.success("Resource updated successfully!");
      router.back();
    } catch (error) {
      toast.error("Failed to update resource.");
      console.error("Failed to update resource", error);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImageBase64(null);
    fileInputRef.current.value = "";
  };

  return (
    <>
      <ClickButton onClick={() => router.back()} text={"Go Back"} />

      <div className="my-10 px-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextInputField
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title"
          />

          <TextAreaInputField
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />

          <TextInputField
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags (comma separated)"
          />

          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
            Semester:
          </label>
          <select
            name="semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-neutral-600"
          >
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
          >
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
          >
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

          <button type="submit" className={`inline-flex cursor-pointer items-center space-x-2 py-2 px-4 text-accent-900 bg-accent-100 hover:bg-accent-200 dark:bg-accent-300 dark:hover:bg-accent-400 rounded-lg text-center`}>
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
};

export default EditResourcePage;
