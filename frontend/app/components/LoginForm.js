"use client";

import React, { useState, useEffect } from 'react';
import loginUser from '../api/loginUser';
import useAlert from '../customHooks/useAlert';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useAlert('', 1000); // 1000ms = 1 second
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000); // Clear error after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validateInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{5,}$/;

    if (emailRegex.test(username)) {
      setValidationError('Username must not be an email address.');
      return false;
    }

    if (!passwordRegex.test(password)) {
      setValidationError('Password must be at least 5 characters long and contain both letters and numbers.');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleLogin = async () => {
    if (!validateInput()) {
      return;
    }

    try {
      const userData = await loginUser(username, password);
      setUsername('');
      setPassword('');
      setSuccess(userData.message);
      setError('');
      if (userData.message.includes('successfully')) {
        router.push('/');
      }
    } catch (error) {
      setError('Login failed'); // Set the error message
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
          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
          >
            Login
          </button>
        </form>
        <div className="mt-4 flex justify-between">
          <Link href="/forgot-password" className="text-orange-600 hover:underline">Forgot Password?</Link>
          <Link href="/register" className="text-orange-600 hover:underline">Register</Link>
        </div>
        <hr className="my-10 border-t border-orange-300 w-[50%] mx-auto"/>
        <a
          href="/login/google"
          className="flex justify-center items-center gap-5 w-full py-2 px-4 text-blue-700 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 mt-4 text-center"
        >
          <FcGoogle className='h-8 w-8'/> <span>Login with Google</span>
        </a>

        {success !== '' && (
          <div className="mt-6 bg-green-100 text-green-700 p-4 rounded-lg">
            <p>{success}</p>
          </div>
        )}
        {error !== '' && (
          <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        )}
        {validationError !== '' && (
          <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg">
            <p>{validationError}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
