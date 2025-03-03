"use client";

import React, { useState, useEffect } from "react";
import loginUser from "../api/loginUser";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { IoMdLock } from "react-icons/io";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubmitButton from "./SubmitButton";
import TextInputField from "./TextInputField";
import PasswordInput from "./PasswordInput";
import CardContainer from "./WhiteContainer";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const router = useRouter();
  // const pathname = usePathname();

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
      setEmail(username);
      // setUsername("");
      return true;
    }

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 5 characters long and contain both letters and numbers."
      );
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
      const userData = await loginUser(username, email, password, isRememberMe);
      setEmail("");
      setUsername("");
      setPassword("");
      toast.success(userData.message);
      if (userData.message.includes("successfully")) {
        //   const restrictedPaths = ['/register', '/reset-password', '/forgot-password', '/logout'];
        //   const previousPath = document.referrer;
        // console.log(previousPath)
        // Check if the previous path includes any of the restricted paths
        // const isRestrictedPath = restrictedPaths.some(path => previousPath.includes(path));

        // if (!isRestrictedPath) {
        // if(pathname.includes('/login')) router.push('/');
        // else
        // router.back();
        router.push("/");
        // } else {
        // }
      }
    } catch (error) {
      toast.error("Login failed: " + (error ? error : ""));
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = (checked) => setIsRememberMe(checked);

  return (
    <CardContainer>
      <h2 className="text-2xl font-bold mb-6 text-primary dark:text-secondary">
        Welcome Back to Login!
      </h2>
      <Link
        href="/login/google"
        className="flex justify-center items-center gap-5 w-full py-2 px-4 bg-accent-500font-semibold rounded-lg dark:bg-accent-900 dark:hover:bg-accent-800 dark:text-secondary bg-accent-50 hover:bg-accent-100 focus:outline-none focus:ring-2 focus:ring-accent-300 mt-4 text-center text-link"
      >
        <FcGoogle className="h-8 w-8" /> <span>Register with Google</span>
      </Link>

      <hr className="my-10 border-t border-accent-300 w-[50%] mx-auto" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="space-y-4"
      >
        <div className="relative">
          <MdEmail
            className="absolute left-4 top-1/3 transform -translate-y-1/4 text-gray-400 dark:text-gray-500"
            size={20}
          />
          <TextInputField
            value={username}
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username or Email"
            className="pl-12"
            required
          />
        </div>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <div className="mt-4 flex justify-between items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox text-accent-600"
              onChange={(e) => handleCheck(e.target.checked)}
              checked={isRememberMe}
            />
            <span className="ml-2 text-neutral-500 dark:text-neutral-300">
              Remember Me
            </span>
          </label>
        </div>
        <SubmitButton
          onClick={handleLogin}
          disabled={loading || username.trim() === "" || password.trim() === ""}
          processing={loading}
        />
      </form>
      <div className="mt-4 flex justify-between">
        <Link href="/register" className="text-link hover:underline">
          Register
        </Link>
        <Link href="/forgot-password" className="text-link hover:underline">
          Forgot Password?
        </Link>
      </div>
    </CardContainer>
  );
};

export default LoginForm;
