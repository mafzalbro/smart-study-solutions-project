"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdEmail } from 'react-icons/md';
import SubmitButton from '@/app/components/SubmitButton';
import TextInputField from '@/app/components/TextInputField';
import forgotPassword from '../../api/forgotPassword';

const ForgotPassword = (props) => {
  console.log({props});
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const router = useRouter();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate email format
  useEffect(() => {
    setIsValidEmail(emailRegex.test(email));
  }, [email]);

  const handleForgotPassword = async () => {
    if (!isValidEmail) return;

    setLoading(true);
    try {
      const response = await forgotPassword(email);
      setEmail('');
      toast.success(response.message);
      // Optionally redirect or update state after a successful email send
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
      console.error('Failed to send reset email:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-6 bg-secondary dark:bg-neutral-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-primary dark:text-secondary">Forgot Password</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleForgotPassword();
          }}
          className="space-y-4"
        >
          <div className="relative">
            <MdEmail className="absolute left-4 top-1/3 transform -translate-y-1/4 text-gray-400 dark:text-gray-500" size={20} />
            <TextInputField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              label="Email"
              className="pl-12"
              required
            />
          </div>
          <SubmitButton
            onClick={handleForgotPassword}
            disabled={!isValidEmail || loading}
            processing={loading}
          />
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ForgotPassword;
