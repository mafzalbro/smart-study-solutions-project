"use client";

import { useEffect, useState } from 'react';

const UpdateProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const userId = queryParams.get('user');

    if (userId) {
      // Fetch user details using userId
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/user/${userId}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data) {
            setUser(data);
          } else {
            // window.location.href = '/login';
          }
        })
        .catch(() => {
          // window.location.href = '/login';
        });
      } else {
      // window.location.href = '/login';
    }
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
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />
      </label>
      <label>
        Role:
        <select
          value={user.role}
          onChange={(e) => setUser({ ...user, role: e.target.value })}
          required
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </label>
      <label>
        Favorite Genre:
        <input
          type="text"
          value={user.favoriteGenre}
          onChange={(e) => setUser({ ...user, favoriteGenre: e.target.value })}
          required
        />
      </label>
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default UpdateProfile;
