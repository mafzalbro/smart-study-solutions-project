"use client";

import React, { useState } from 'react';
import changePassword from '../../api/changePassword';
import useAlert from '../../customHooks/useAlert';
import { useRouter } from 'next/navigation';

const ChangePassword = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useAlert('', 5000); // 5 seconds
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setSuccess(response.message);
      if (response.message.includes('successfully')) {
      }
    } catch (error) {
      console.error('Password change failed:', error.message);
      setError('Password change failed: ' + error.message);
    }
  };

  return (
    <div className="w-3/4 min-h-screen bg-my-bg-1 text-foreground flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-my-bg-2 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block mb-2">Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
          </div>
          <div>
            <label className="block mb-2">New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
          >
            Change Password
          </button>
        </form>
        {success && (
          <div className={`mt-6 p-4 rounded-lg ${success.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            <p>{success}</p>
          </div>
        )}
        {error && (
          <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
