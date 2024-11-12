"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdEmail } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubmitButton from "./SubmitButton";
import TextInputField from "./TextInputField";
import PasswordInput from "./PasswordInput";
import loginAdmin from "@/app/(admin)/api/loginAdmin";
import { useAuth } from "../../customHooks/AdminAuthProvider";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (!!token) {
      router.back();
    }
  }, [token]);

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
      const adminData = await loginAdmin(
        username,
        email,
        password,
        isRememberMe
      );
      setEmail("");
      setUsername("");
      setPassword("");
      toast.success(adminData.message);
      if (adminData.message.includes("successfully")) {
        router.push("/admin");
      }
    } catch (error) {
      toast.error("Login failed: " + (error ? error : ""));
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = (checked) => setIsRememberMe(checked);
  
  
  return (
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

        <ToastContainer />
      </form>
    );
};

export default LoginForm;
