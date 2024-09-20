"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MdOutlineCloudUpload, MdDelete } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { fetcher } from '@/app/utils/fetcher';
import TextInputField from './TextInputField'; // Import the custom TextInputField component

const UpdateProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch user details using fetcher function)
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
        setProfileImage(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
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

          {profileImage ? (
            <div className="relative">
              <img
                src={profileImage}
                alt="Profile Preview"
                className="block my-10 rounded-lg border mx-auto h-auto w-[100%] "
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
        {/* Additional Fields */}
        {/* <TextInputField
          type="tel"
          value={user.phone || ''}
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
          placeholder="Phone Number"
        />
        <TextInputField
          type="text"
          value={user.address || ''}
          onChange={(e) => setUser({ ...user, address: e.target.value })}
          placeholder="Address"
        /> */}
        <button type="submit" className="w-full py-2 px-4 bg-accent-600 text-white rounded-lg shadow-md hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-600">
          Update Profile
        </button>
        <ToastContainer />
      </form>
    </div>
  );
};

export default UpdateProfile;
