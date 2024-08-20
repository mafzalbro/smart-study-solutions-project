"use client";

import React, { useState, useEffect } from 'react';
import verifyToken from '@/app/api/verifyToken';
import resetPassword from '@/app/api/resetPassword';
import useAlert from '@/app/customHooks/useAlert';
import { useRouter, useSearchParams } from 'next/navigation';
import PasswordInput from '@/app/components/PasswordInput';
import SubmitButton from '@/app/components/SubmitButton';
import WhiteContainer from '@/app/components/WhiteContainer';
import Link from 'next/link'; // Import Link

const ResetPassword = () => {
  const params = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useAlert('', 5000); // 5 seconds
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Please wait while we verify your token...');
  const [errorMessage, setErrorMessage] = useState(''); // State to hold error message

  useEffect(() => {
    const tokenFromParams = params.get('token');
    if (tokenFromParams) {
      setToken(tokenFromParams);
      handleVerifyToken(tokenFromParams);
    } else {
      // If no token is found in the URL, show an error message
      setErrorMessage('No verification token found. Please request a new password reset email.');
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
        setErrorMessage('Invalid or Expired token found. Please request a new password reset email.');
      }
    } catch (error) {
      console.error('Token verification failed:', error.message);
      setSuccess('Token verification failed');
      setLoadingMessage('Token verification failed');
      setErrorMessage('Invalid or Expired token found. Please request a new password reset email.');
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
    <WhiteContainer>
      <h2 className="text-2xl font-bold mb-6 text-primary dark:text-secondary">Reset Password</h2>
      {errorMessage ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          <p>{errorMessage}</p>
          <Link href="/forgot-password" className="text-link hover:underline">Go to forgot password to get email verification Link</Link>
        </div>
      ) : showPasswordField ? (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="relative">
            <label className="block mb-2 text-accent-300">Enter Your New Password:</label>
            <div className="relative">
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                required
              />
            </div>
          </div>
          <SubmitButton
            type="submit"
            className="w-full py-2 px-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-300"
            processing={false}
          >
            Change Password
          </SubmitButton>
        </form>
      ) : (
        <p className="text-neutral-700">{loadingMessage}</p>
      )}
      {success && (
        <div className={`mt-6 p-4 rounded-lg ${success.includes('failed') || success.includes('Invalid') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          <p>{success}</p>
        </div>
      )}
    </WhiteContainer>
  );
};

export default ResetPassword;
