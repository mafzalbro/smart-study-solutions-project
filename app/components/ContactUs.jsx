"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubmitButton from "@/app/components/SubmitButton";
import TextInputField from "@/app/components/TextInputField";
import TextAreaField from "@/app/components/TextAreaField";
import { useAuth } from "../customHooks/AuthContext";
import Skeleton from "react-loading-skeleton";
import { fetcher } from "../utils/fetcher";
import { AiOutlineMail, AiOutlineMessage, AiOutlineUser } from "react-icons/ai";

const ContactUs = () => {
  const { user } = useAuth();

  if (user !== null) {
    const [name, setName] = useState(user ? user.fullname : "");
    const [email, setEmail] = useState(user ? user.email : "");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [errors, setErrors] = useState({});

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSending(true);
      const newErrors = {};

      if (!name.trim()) {
        newErrors.name = "Name is required.";
      }

      if (!email.trim()) {
        newErrors.email = "Email is required.";
      } else if (!validateEmail(email)) {
        newErrors.email = "Email is not valid.";
      }

      if (!message.trim()) {
        newErrors.message = "Message is required.";
      } else if (message.trim().length < 10) {
        newErrors.message = "Message must be at least 10 characters long.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSending(false);
        return;
      }

      try {
        const data = await fetcher(
          `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/contact`,
          "POST",
          { name, email, message }
        );
        // const data = await response.json();

        if (data) {
          toast.success("Message sent successfully.");
          setName("");
          setEmail("");
          setMessage("");
          setErrors({});
        } else {
          toast.error("Failed to send message.");
        }
      } catch (error) {
        toast.error("Error sending message." + error.message);
      } finally {
        setIsSending(false);
      }
    };

    return (
      // <WhiteContainer>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <AiOutlineUser
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
            size={20}
          />
          <TextInputField
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            label="Name"
            className="pl-12"
            required={true}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div className="relative">
          <AiOutlineMail
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
            size={20}
          />
          <TextInputField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            label="Email"
            className="pl-12"
            required={true}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="relative">
          <AiOutlineMessage
            className="absolute left-4 top-1/3 transform -translate-y-1/4 text-gray-400 dark:text-gray-500"
            size={20}
          />
          <TextAreaField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your Message"
            label="Message"
            className="pl-12"
            rows="4"
            required={true}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
        </div>

        <SubmitButton
          onClick={handleSubmit}
          disabled={isSending || !name || !email || !message}
          processing={isSending}
        >
          {isSending ? "Sending..." : "Submit"}
        </SubmitButton>
      </form>
    );
    {
      /* </WhiteContainer> */
    }
  } else {
    return (
      <>
        <Skeleton height={50} className="my-10" />
        <label className="block dark:text-secondary font-bold my-2">Name</label>
        <Skeleton height={70} />
        <label className="block dark:text-secondary font-bold my-2">
          Email
        </label>
        <Skeleton height={70} />
        <label className="block dark:text-secondary font-bold my-2">
          Message
        </label>
        <Skeleton height={200} />
        <Skeleton height={50} className="rounded-full mt-4" />
      </>
    );
  }
};

export default ContactUs;
