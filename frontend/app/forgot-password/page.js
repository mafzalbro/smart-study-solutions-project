"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAlert from '../customHooks/useAlert';
import forgotPassword from '../api/forgotPassword';

forgotPassword
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useAlert('', 3000); // 3 seconds
  const router = useRouter();

  const handleForgotPassword = async () => {
    try {
      const response = await forgotPassword(email)
      setEmail('');
      setSuccess(response.message);
      // Optionally redirect or update state after a successful email send
    } catch (error) {
      console.error('Failed to send reset email:', error.message);
      // Handle error (e.g., display error message)
    }
  };

  return (
    <div className="min-h-screen bg-my-bg-1 text-foreground flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-my-bg-2 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleForgotPassword();
          }}
          className="space-y-4"
        >
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
          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
          >
            Send Reset Email
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

export default ForgotPassword;
