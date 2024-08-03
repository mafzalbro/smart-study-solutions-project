"use client";

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import changePassword from '../../../api/changePassword';
import SubmitButton from '@/app/components/SubmitButton';
import PasswordInput from '@/app/components/PasswordInput';

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

  return (
    <div className='mt-16 w-full flex justify-center md:w-3/4'>
      <div>
        <h2 className="text-2xl font-bold mb-6 text-primary dark:text-secondary">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
        <PasswordInput
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Password"
            required
          />
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
