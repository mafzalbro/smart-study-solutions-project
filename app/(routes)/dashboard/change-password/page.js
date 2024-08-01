"use client";

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineLock } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import changePassword from '../../../api/changePassword';
import SubmitButton from '@/app/components/SubmitButton';
import TextInputField from '@/app/components/TextInputField';

const ChangePassword = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      toast.success(response.message);
    } catch (error) {
      console.error('Password change failed:', error.message);
      toast.error('Password change failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 px-4 sm:px-6 lg:px-8">
    {/* <div className="w-full max-w-md p-6 bg-secondary dark:bg-neutral-800 rounded-lg shadow-lg"> */}
  return (
    <div className='flex items-center justify-center basis-2/3'>
    <div className='w-full'>
        <h2 className="text-2xl font-bold mb-6 text-primary dark:text-secondary">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="relative">
            <AiOutlineLock className="absolute left-4 top-1/3 transform -translate-y-1/4 text-gray-400 dark:text-gray-500" size={20} />
            <TextInputField
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              label="Current Password"
              className="pl-12"
              required
            />
          </div>
          <div className="relative">
            <AiOutlineLock className="absolute left-4 top-1/3 transform -translate-y-1/4 text-gray-400 dark:text-gray-500" size={20} />
            <TextInputField
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              label="New Password"
              className="pl-12"
              required
            />
          </div>
          <SubmitButton
            onClick={handleChangePassword}
            disabled={loading || !currentPassword.trim() || !newPassword.trim()}
            processing={loading}
          >
            Change Password
          </SubmitButton>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
