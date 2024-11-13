"use client";

import React, { useState } from "react";
import registerUser from "../../api/registerUser";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubmitButton from "@/app/components/SubmitButton";
import TextInputField from "@/app/components/TextInputField";
import PasswordInput from "@/app/components/PasswordInput";
import CardContainer from "@/app/components/WhiteContainer";
import { MdEmail, MdFavorite } from "react-icons/md";
import { FaUser } from "react-icons/fa";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [favoriteGenre, setFavoriteGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // const handleForm = (formdata) => {
  //   // console.log({formdata});

  //   const data = formdata.entries();

  //   // console.log({data, data2: Object.fromEntries(data)});
  // }

  const validateInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{5,}$/;

    if (emailRegex.test(username)) {
      // setEmail(username);
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

  const handleRegister = async () => {
    if (!validateInput) {
      return;
    }

    setLoading(true);
    try {
      const userData = await registerUser({
        username,
        fullname,
        email,
        password,
        role,
        favoriteGenre,
      });
      if (userData.message && userData.message.includes("successfully")) {
        toast.success(userData.message);
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("student");
        setFavoriteGenre("");
        setFullName("");
        router.push("/login");
      } else {
        toast.error(
          userData.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      toast.error("An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center my-10">
      <CardContainer className="w-full max-w-md p-6 md:p-8 bg-secondary shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-primary dark:text-secondary">
          Create an Account
        </h2>

        <Link
          href="/register/google"
          className="flex justify-center items-center gap-5 w-full py-2 px-4 bg-accent-500font-semibold rounded-lg dark:bg-accent-900 dark:hover:bg-accent-800 dark:text-secondary bg-accent-50 hover:bg-accent-100 focus:outline-none focus:ring-2 focus:ring-accent-300 mt-4 text-center text-link"
        >
          <FcGoogle className="h-8 w-8" /> <span>Register with Google</span>
        </Link>

        <hr className="my-10 border-t border-neutral-300 w-[50%] mx-auto" />

        <form
          // action={
          //   handleForm
          // }
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
          className="space-y-4"
        >
          <TextInputField
            icon={FaUser}
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <TextInputField
            icon={FaUser}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextInputField
            icon={MdEmail}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full p-4 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 bg-transparent"
            >
              <option value="student" className="text-primary">
                Student
              </option>
              <option value="teacher" className="text-primary">
                Teacher
              </option>
            </select>
          </div>

          <TextInputField
            icon={MdFavorite}
            placeholder="Favorite Genre"
            value={favoriteGenre}
            onChange={(e) => setFavoriteGenre(e.target.value)}
            required
          />
          <SubmitButton
            type="submit"
            processing={loading}
            disabled={
              loading ||
              !username ||
              !email ||
              !password ||
              !fullname ||
              !favoriteGenre
            }
            className="w-full"
          >
            Register
          </SubmitButton>
        </form>

        <div className="mt-4 flex justify-between">
          <Link
            href="/login"
            className="hover:underline text-link hover:text-link-hover"
          >
            Login
          </Link>
          <Link
            href="/forgot-password"
            className="hover:underline text-link hover:text-link-hover"
          >
            Forgot Password?
          </Link>
        </div>
      </CardContainer>
    </div>
  );
};

export default RegisterForm;
