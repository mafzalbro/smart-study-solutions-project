"use client"

import React, { useState } from 'react';
import loginUser from '../api/loginUser';
import useAlert from '../customHooks/useAlert';


const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useAlert('', 1000); // 3000ms = 3 seconds

  const handleLogin = async () => {
    try {
      const userData = await loginUser(username, password);
      setUsername('');
      setPassword('');
      setSuccess(userData.message)
      // Perform actions after successful login (e.g., redirect, update state)
    } catch (error) {
      console.error('Login failed:', error.message);
      // Handle login failure (e.g., display error message)
    }
  };

  return (
    <div className="min-h-screen bg-my-bg-1 text-foreground flex items-center justify-center">
    <div className="w-full max-w-md p-8 bg-my-bg-2 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Login Form</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
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

export default LoginForm;
