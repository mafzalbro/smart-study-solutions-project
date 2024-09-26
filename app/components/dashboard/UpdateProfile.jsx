"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MdOutlineCloudUpload, MdDelete } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { fetcher } from '@/app/utils/fetcher';
import TextInputField from '../TextInputField'; // Import the custom TextInputField component
import imageCompression from 'browser-image-compression';
import { removeUserCacheHistory } from '@/app/utils/caching';


const UpdateProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false); // New state for loading
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch user details using fetcher function
    fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/user/get/one`)
      .then(data => {
        if (data) {
          setUser(data);
        } else {
          console.error('User data not found');
        }
      })
      .catch(() => {
        console.error('Error fetching user data');
      });
  }, [router]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoadingImage(true); // Start image loading
      try {
        // Set image compression options to target 20KB (0.02MB)
        const options = {
          maxSizeMB: 0.02, // Maximum size in MB (20KB = 0.02MB)
          maxWidthOrHeight: 500, // Reduce dimensions to help compress
          useWebWorker: true, // Use Web Worker for better performance
          fileType: 'image/jpeg', // Use JPEG format for better compression
        };

        // Compress the image
        const compressedFile = await imageCompression(file, options);

        // Check if the compressed file size is still over 20KB and reduce further if necessary
        let compressedFileSize = compressedFile.size / 1024; // Convert size to KB
        while (compressedFileSize > 20) {
          options.maxSizeMB = options.maxSizeMB * 0.9; // Further reduce size
          const furtherCompressedFile = await imageCompression(compressedFile, options);
          compressedFileSize = furtherCompressedFile.size / 1024;
        }

        // Convert the final compressed image to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageBase64(reader.result);
          setProfileImage(URL.createObjectURL(compressedFile));
          setLoadingImage(false); // Stop image loading
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        setLoadingImage(false); // Stop image loading in case of error
        console.error('Error compressing image:', error);
        toast.error('Error uploading image. Please try again.');
      }
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImageBase64(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input element
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const updatedUserData = {
        username: user.username,
        email: user.email,
        role: user.role,
        favoriteGenre: user.favoriteGenre,
        profileImage: imageBase64
      };

      const response = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/user/${user._id}`, 'PUT', updatedUserData);

      if (response) {
        removeUserCacheHistory()
        toast.success('Profile updated successfully');
      } else {
        toast.error(`Error updating profile: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error(`Error updating profile: ${error.message}`);
    }
  };

  if (!user) {
    return (
      <div className="text-foreground flex items-center justify-center">
        <div className="w-full md:w-3/4 max-w-sm p-8">
          <h2 className="text-2xl font-bold mb-6 text-primary dark:text-secondary">
            <Skeleton width={200} />
          </h2>
          <Skeleton height={300} className="my-10" />
          <Skeleton count={4} height={50} className="mb-4" />
          <Skeleton width={150} height={40} className="my-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="text-foreground flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full md:w-3/4 max-w-sm p-8">
        <h2 className="text-2xl font-bold mb-6 text-primary dark:text-secondary">Update Profile</h2>
        <label className="block mb-4">
          Profile Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="fileInput"
            ref={fileInputRef}
          />
          <label
            htmlFor="fileInput"
            className="flex items-center gap-4 w-full mt-1 py-4 px-4 border rounded-lg cursor-pointer focus:ring-2 focus:ring-accent-600 outline-none bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-300 border-neutral-300 dark:border-neutral-600"
          >
            <MdOutlineCloudUpload className="text-accent-600" /> <span>Choose File</span>
          </label>

          {loadingImage ? (
          <Skeleton height={300} className="my-10" />
        ) : profileImage ? (
            <div className="relative">
              <img
                src={profileImage}
                alt="Profile Preview"
                className="block my-10 rounded-lg border mx-auto h-auto w-[100%]"
                style={{ maxWidth: '300px' }}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <MdDelete />
              </button>
            </div>
          ) : user.profileImage ? (
            <div className="relative">
              <img
                src={user.profileImage}
                alt="Profile"
                className="block my-10 rounded-lg border border-neutral-300 dark:border-neutral-700 mx-auto h-auto w-[100%]"
                style={{ maxWidth: '300px' }}
              />
            </div>
          ) : (
            <span>No profile image available</span>
          )}
        </label>
        <TextInputField
          type="text"
          value={user.username || ''}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          placeholder="Username"
          required
        />
        <TextInputField
          type="email"
          value={user.email || ''}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
          required
        />
        <label className="block mb-4">
          Role:
          <select
            value={user.role || ''}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
            required
            className="block w-full mt-1 py-4 px-4 border rounded-lg focus:ring-2 focus:ring-accent-600 outline-none bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-300 border-neutral-300 dark:border-neutral-700"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </label>
        <TextInputField
          type="text"
          value={user.favoriteGenre || ''}
          onChange={(e) => setUser({ ...user, favoriteGenre: e.target.value })}
          placeholder="Favorite Genre"
          required
        />
        <button type="submit" className="w-full py-2 px-4 bg-accent-600 text-white rounded-lg shadow-md hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-600">
          Update Profile
        </button>
        <ToastContainer />
      </form>
    </div>
  );
};

export default UpdateProfile;
