"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/app/utils/fetcher"; // Helper for fetching data
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify"; // Toasts for success/error messages
import { removeOlderCacheAfterMutation } from "@/app/utils/caching";
import TextInputField from "@/app/components/TextInputField";
import TextAreaField from "@/app/components/TextAreaField";
import FileUploadComponent from "@/app/(admin)/components/admin/FileUploadComponent";

// Edit Announcement Page
const EditAnnouncementPage = ({ params: { id } }) => {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // State for announcement fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [btnText, setBtnText] = useState("");
  const [btnLink, setBtnLink] = useState("");
  const [icon, setIcon] = useState("");
  const [imageBase64, setImageBase64] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const data = await fetcher(
          `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/announcements/${id}`
        );
        // Set state variables from fetched announcement data
        setTitle(data.title);
        setDescription(data.description);
        setBtnText(data.btnText);
        setBtnLink(data.btnLink);
        setIcon(data.icon);
        setProfileImage(data.image); // Set the image URL
      } catch (error) {
        console.error("Failed to fetch announcement", error);
      }
    };
    fetchAnnouncement();
  }, [id]);

  // Handle image upload and compression
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

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedAnnouncement = {
        title,
        description,
        btnText,
        btnLink,
        icon,
        image: imageBase64,
      };

      await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/announcements/${id}`,
        "PUT",
        updatedAnnouncement
      );
      removeOlderCacheAfterMutation("/api/announcements");
      toast.success("Announcement updated successfully!");
      router.back();
    } catch (error) {
      toast.error("Failed to update announcement.");
      console.error("Failed to update announcement", error);
    }
  };

  // Handle removing image
  const handleRemoveImage = () => {
    setProfileImage(null);
    setImageBase64(null);
    fileInputRef.current.value = "";
  };

  return (
    <div className="my-10 px-4">
      <button
        onClick={() => router.back()}
        className="text-accent-500 dark:text-accent-300 mb-8"
      >
        Go Back
      </button>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-medium">Title:</label>
          <TextInputField
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded-lg"
            placeholder="Enter title"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Description:</label>
          <TextAreaField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded-lg"
            placeholder="Enter description"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Button Text:</label>
          <TextInputField
            type="text"
            value={btnText}
            onChange={(e) => setBtnText(e.target.value)}
            className="p-2 border rounded-lg"
            placeholder="Enter button text"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Button Link:</label>
          <TextInputField
            type="url"
            value={btnLink}
            onChange={(e) => setBtnLink(e.target.value)}
            className="p-2 border rounded-lg"
            placeholder="Enter button link"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Icon:</label>
          <TextInputField
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="p-2 border rounded-lg"
            placeholder="Enter icon URL or icon name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Image:</label>
          <FileUploadComponent
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            setImageBase64={setImageBase64}
            fileInputRef={fileInputRef}
            handleImageUpload={handleImageUpload}
            handleRemoveImage={handleRemoveImage}
          />
          {/* <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="p-2 border rounded-lg"
          />
          {profileImage && (
            <div className="mt-2">
              <img
                src={profileImage}
                alt="Preview"
                className="w-32 h-32 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-red-500 mt-2"
              >
                Remove Image
              </button>
            </div>
          )} */}
        </div>

        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-lg mt-4"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditAnnouncementPage;
