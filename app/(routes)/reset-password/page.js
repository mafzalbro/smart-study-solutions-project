"use client";

import React, { useState, useEffect } from 'react';
import verifyToken from '../../api/verifyToken';
import resetPassword from '../../api/resetPassword';
import useAlert from '../../customHooks/useAlert';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPassword = () => {
  const params = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useAlert('', 5000); // 3 seconds
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Please wait while we verify your token...');

  useEffect(() => {
    const tokenFromParams = params.get('token');
    if (tokenFromParams) {
      setToken(tokenFromParams);
      handleVerifyToken(tokenFromParams);
    }
  }, [params]);

  const handleVerifyToken = async (token) => {
    try {
      const response = await verifyToken(token);
      if (response.token) {
        setShowPasswordField(true);
      } else {
        setSuccess('Invalid or expired token');
        setLoadingMessage('Token verification failed');
      }
    } catch (error) {
      console.error('Token verification failed:', error.message);
      setSuccess('Token verification failed');
      setLoadingMessage('Token verification failed');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await resetPassword(token, newPassword);
      setNewPassword('');
      setSuccess(response.message);
      if (response.message.includes('successfully')) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Password change failed:', error.message);
      setSuccess('Password change failed');
    }
  };

  return (
    <div className="min-h-screen bg-my-bg-1 text-foreground flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-my-bg-2 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        {showPasswordField ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block mb-2">Enter Your New Password:</label>
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
        ) : (
          <p>{loadingMessage}</p>
        )}
        {success && (
          <div className={`mt-6 p-4 rounded-lg ${success.includes('failed') || success.includes('Invalid') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            <p>{success}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
