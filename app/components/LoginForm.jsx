"use client";

import React, { useState, useEffect } from 'react';
import loginUser from '../api/loginUser';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { IoMdLock } from "react-icons/io";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SubmitButton from './SubmitButton';
import TextInputField from './TextInputField';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleErrors = (error) => {
      if (error) {
        toast.error(error);
      }
    };

    handleErrors();
  }, []);

  const validateInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{5,}$/;

    if (emailRegex.test(username)) {
      toast.error('Username must not be an email address.');
      return false;
    }

    if (!passwordRegex.test(password)) {
      toast.error('Password must be at least 5 characters long and contain both letters and numbers.');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateInput()) {
      return;
    }
    
    setLoading(true);

    try {
      const userData = await loginUser(username, password);
      setUsername('');
      setPassword('');
      toast.success(userData.message);
      if (userData.message.includes('successfully')) {
        router.push('/');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-6 bg-secondary dark:bg-neutral-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-primary dark:text-secondary">Welcome Back to Login!</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <div className="relative">
            <MdEmail className="absolute left-4 top-1/3 transform -translate-y-1/4 text-gray-400 dark:text-gray-500" size={20} />
            <TextInputField
              value={username}
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="pl-12"
              required
            />
          </div>
          <div className="relative">
            <IoMdLock className="absolute left-4 top-1/3 transform -translate-y-1/4 text-gray-400 dark:text-gray-500 border-none outline-none" size={20} />
            <TextInputField
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="pl-12"
              required
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-4 top-1/3 transform -translate-y-1/4 text-gray-400 dark:text-gray-500"
            >
              {passwordVisible ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </button>
          </div>
          <SubmitButton
            onClick={handleLogin}
            disabled={loading || username.trim() === '' || password.trim() === ''}
            processing={loading}
          />
        </form>
        <div className="mt-4 flex justify-between">
          <Link href="/register" className="text-link hover:underline">Register</Link>
          <Link href="/forgot-password" className="text-link hover:underline">Forgot Password?</Link>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <label className="flex items-center">
            <input type="checkbox" className="form-checkbox text-accent-600" />
            <span className="ml-2">Remember Me</span>
          </label>
        </div>
        <hr className="my-10 border-t border-accent-300 w-[50%] mx-auto"/>
        <Link
          href="/login/google"
          className="flex justify-center items-center gap-5 w-full py-2 px-4 bg-blue-700 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 mt-4 text-center hover:bg-blue-800"
        >
          <FcGoogle className='h-8 w-8'/> <span>Login with Google</span>
        </Link>

      </div>
    </div>
  );
};

export default LoginForm;
