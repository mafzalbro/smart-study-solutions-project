"use client";

import React, { useState } from 'react';
import registerUser from '../api/registerUser';
import useAlert from '../customHooks/useAlert';
import { useRouter } from 'next/navigation';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [favoriteGenre, setFavoriteGenre] = useState('');
  const [success, setSuccess] = useAlert('', 3000); // 3 seconds

  const router = useRouter()

  const handleRegister = async () => {
    try {
      const userData = await registerUser({ username, email, password, role, favoriteGenre });
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('');
      setFavoriteGenre('');
      setSuccess(userData.message);
      if(userData.message.includes('successfully')){
        router.push('/login');
      }
    } catch (error) {
      console.error('Registration failed:', error.message);
      // Handle registration failure (e.g., display error message)
    }
  };

  return (
    <div className="min-h-screen bg-my-bg-1 text-foreground flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-my-bg-2 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Register Form</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-2">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
          </div>
          <div>
            <label className="block mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
          </div>
          <div>
            <label className="block mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
          </div>
          <div>
            <label className="block mb-2">Role:</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
          </div>
          <div>
            <label className="block mb-2">Favorite Genre:</label>
            <input
              type="text"
              value={favoriteGenre}
              onChange={(e) => setFavoriteGenre(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
          >
            Register
          </button>
        </form>
        {success !== '' && (
          <div className="mt-6 bg-green-100 text-green-700 p-4 rounded-lg">
            <p>{success}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
