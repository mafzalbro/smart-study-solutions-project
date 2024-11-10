"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import TextInputField from "@/app/(admin)/components/admin/TextInputField";
import TextAreaInputField from "@/app/(admin)/components/admin/TextAreaInputField";
import FileUploadComponent from "@/app/(admin)/components/admin/FileUploadComponent";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";
import { removeOlderCacheAfterMutation } from "@/app/utils/caching";

const AddAnnouncementPage = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // State for each form field
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [btnText, setBtnText] = useState("");
  const [btnLink, setBtnLink] = useState("");
  const [icon, setIcon] = useState("");
  const [imageBase64, setImageBase64] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedFile = await imageCompression(file, { maxSizeMB: 0.1 });
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageBase64(reader.result);
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
    if (!title || !description || !btnText || !btnLink) {
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
      const newAnnouncement = {
        title,
        description,
        btnText,
        btnLink,
        icon,
        image: imageBase64,
      };

      await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/announcements/create`,
        "POST",
        newAnnouncement
      );
      removeOlderCacheAfterMutation("/api/announcements");
      toast.success("Announcement added successfully!");
      router.push("/admin/announcements");
    } catch (error) {
      toast.error("Failed to add announcement.");
      console.error("Failed to add announcement", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-10 px-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInputField
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter the announcement title"
          label="Enter the announcement title"
          required={true}
        />
        <label>Enter the description </label>
        <TextAreaInputField
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter the description"
          required={true}
        />
        <TextInputField
          name="btnText"
          type="text"
          value={btnText}
          onChange={(e) => setBtnText(e.target.value)}
          placeholder="Button Text"
          label="Button Text"
          required={true}
        />
        <TextInputField
          name="btnLink"
          type="text"
          value={btnLink}
          onChange={(e) => setBtnLink(e.target.value)}
          placeholder="Button Link"
          label="Button Link"
          required={true}
        />
        <TextInputField
          name="icon"
          type="text"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          label="Icon (optional)"
          placeholder="Icon (optional)"
        />
        <FileUploadComponent
          profileImage={imageBase64}
          setProfileImage={setImageBase64}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
        />
        <button
          type="submit"
          className={`inline-flex items-center justify-center py-2 px-4 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white rounded-lg`}
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Add Announcement"}
        </button>
      </form>
    </div>
  );
};

export default AddAnnouncementPage;
