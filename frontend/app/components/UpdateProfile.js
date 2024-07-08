"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdOutlineCloudUpload } from "react-icons/md";
import Image from 'next/image';
import useAlert from '../customHooks/useAlert';

const UpdateProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [alertMessage, setAlertMessage] = useAlert('', 5000); // Use custom hook

  useEffect(() => {
    // Fetch user details using userId
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/user/get/one`, {
      credentials: 'include'
    })
      .then(response => {
        if (response.status == 401) router.push('/login');
        return response.json();
      })
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
  }, []);

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

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/user/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include'
        },
        body: JSON.stringify(updatedUserData)
      });

      const data = await response.json();

      if (response.ok) {
        setAlertMessage('Profile updated successfully');
      } else {
        setAlertMessage(`Error updating profile: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      setAlertMessage(`Error updating profile: ${error.message}`);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto mt-8">
      <label className="block mb-4">
        Profile Image:
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="flex items-center gap-4 w-full mt-1 py-2 px-4 border rounded-lg cursor-pointer focus:ring-2 focus:ring-orange-600 outline-none bg-white"
        >
          <MdOutlineCloudUpload /> <span>Choose File</span>
        </label>
        {profileImage ? (
          <Image
            src={profileImage}
            alt="Profile Preview"
            width={300}
            height={300}
            className="block my-10 rounded-lg border mx-auto"
            style={{ maxWidth: '300px' }}
          />
        ) : user.profileImage ? (
          <Image
            src={user.profileImage}
            alt="Profile"
            width={300}
            height={300}
            className="block my-10 rounded-lg border mx-auto"
            style={{ maxWidth: '300px' }}
          />
        ) : (
          <span>No profile image available</span>
        )}
      </label>
      <label className="block mb-4">
        Username:
        <input
          type="text"
          value={user.username || ''}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          required
          className="block w-full mt-1 py-2 px-4 border rounded-lg focus:ring-2 focus:ring-orange-600 outline-none"
        />
      </label>
      <label className="block mb-4">
        Email:
        <input
          type="email"
          value={user.email || ''}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
          className="block w-full mt-1 py-2 px-4 border rounded-lg focus:ring-2 focus:ring-orange-600 outline-none"
        />
      </label>
      <label className="block mb-4">
        Role:
        <select
          value={user.role || ''}
          onChange={(e) => setUser({ ...user, role: e.target.value })}
          required
          className="block w-full mt-1 py-2 px-4 border rounded-lg focus:ring-2 focus:ring-orange-600 outline-none"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </label>
      <label className="block mb-4">
        Favorite Genre:
        <input
          type="text"
          value={user.favoriteGenre || ''}
          onChange={(e) => setUser({ ...user, favoriteGenre: e.target.value })}
          required
          className="block w-full mt-1 py-2 px-4 border rounded-lg focus:ring-2 focus:ring-orange-600 outline-none"
        />
      </label>
      {alertMessage && ( alertMessage.includes('success') ? <div className="mb-4 p-4 text-white bg-green-500 rounded-md">Updated Successfully</div> : <div className="mb-4 p-4 text-white bg-red-500 rounded-md">Update Failed</div>
      )}
      <button type="submit" className="block md:inline-block py-2 px-4 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 dark:hover:bg-orange-700 dark:bg-orange-600 my-8">
        Update Profile
      </button>
    </form>
  );
};

export default UpdateProfile;
