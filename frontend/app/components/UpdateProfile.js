"use client"

import { useEffect, useState } from 'react';
  
const UpdateProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user details using userId
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/user/get/one`, {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          setUser(data);
        } else {
          // Handle case where user data is not found
          console.error('User data not found');
        }
      })
      .catch(() => {
        // Handle fetch error
        console.error('Error fetching user data');
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Update user details
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/user/${user._id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const redirectUrl = `${process.env.FRONTEND_ORIGIN}/update-profile?user=${user._id}`;
          window.location.href = redirectUrl;
        }
      });
  };

  if (!user) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto mt-8">
      <label className="block mb-4">
        Username:
        <input
          type="text"
          value={user.username || ''}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          required
          className="block w-full mt-1 p-2 border rounded"
        />
      </label>
      <label className="block mb-4">
        Email:
        <input
          type="email"
          value={user.email || ''}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
          className="block w-full mt-1 p-2 border rounded"
        />
      </label>
      <label className="block mb-4">
        Role:
        <select
          value={user.role || ''}
          onChange={(e) => setUser({ ...user, role: e.target.value })}
          required
          className="block w-full mt-1 p-2 border rounded"
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
          className="block w-full mt-1 p-2 border rounded"
        />
      </label>
      {/* Example of handling profileImage */}
      <label className="block mb-4">
        Profile Image:
        {user.profileImage ? (
          <img src={user.profileImage} alt="Profile" className="block mt-1 rounded border" style={{ maxWidth: '100px' }} />
        ) : (
          <span>No profile image available</span>
        )}
      </label>
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
        Update Profile
      </button>
    </form>
  );
};

export default UpdateProfile;