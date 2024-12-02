"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic"; // Dynamically import ReactQuill
import { fetcher } from "@/app/(admin)/utils/fetcher";
import TextInputField from "@/app/(admin)/components/admin/TextInputField";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

// Dynamically import the Quill editor
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const SendNewsletter = () => {
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleSendNewsletter = async () => {
    setIsSubmitting(true);
    setResponseMessage("");

    try {
      const response = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/contact/send-newsletter`,
        "POST",
        { subject, htmlContent }
      );

      if (response) {
        setSubject("");
        setHtmlContent("");
        setResponseMessage(`Success: ${response.message}`);
      } else {
        setResponseMessage(`Error: ${response.message || "Something went wrong."}`);
      }
    } catch (error) {
      console.error(error);
      setResponseMessage("Error: Failed to send the newsletter.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto my-10 rounded-lg">
      <h1 className="text-2xl font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
        Send Newsletter
      </h1>

      {/* Subject Input */}
      <TextInputField
        label="Subject"
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Enter newsletter subject"
        required
        className="mb-4"
      />

      {/* Rich Text Editor */}
      <div className="mb-4">
        <label className="mb-2 inline-block text-neutral-800 dark:text-neutral-200">
          HTML Content
        </label>
        <ReactQuill
          value={htmlContent}
          onChange={setHtmlContent}
          placeholder="Compose your newsletter here..."
          className="bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
          theme="snow"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSendNewsletter}
        className="mt-4 w-full p-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 focus:ring-2 focus:ring-accent-600 disabled:bg-gray-400"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Newsletter"}
      </button>

      {/* Response Message */}
      {responseMessage && (
        <div
          className={`mt-4 text-sm p-2 rounded-lg ${
            responseMessage.startsWith("Success")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default SendNewsletter;
