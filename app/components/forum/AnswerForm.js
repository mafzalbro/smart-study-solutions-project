import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { fetcher } from "@/app/utils/fetcher";
import ReactQuill from "react-quill";
import { FaRegTimesCircle } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import "./react-quill.css";
import { removeOlderCacheAfterMutation } from "@/app/utils/caching";

const AnswerForm = ({ questionSlug, onSuccess, onClose }) => {
  const [editorHtml, setEditorHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${questionSlug}/answer`,
        "POST",
        { answerText: editorHtml }
      );
      removeOlderCacheAfterMutation(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${questionSlug}`
      );
      toast.success("Question answered successfully!");
      setEditorHtml(""); // Reset editor content
      onSuccess && onSuccess();
      onClose && onClose(); // Close the modal after submission
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error(error.message || "Failed to answer question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center w-full dark:bg-shade-800 rounded-lg bg-neutral-50">
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div className="relative bg-neutral-100 dark:bg-shade-700 border-accent-300 dark:border-accent-600 rounded-lg overflow-auto h-[80vh]">
          {loading ? (
            <Skeleton height="200px" />
          ) : (
            <ReactQuill
              theme="snow"
              value={editorHtml}
              onChange={setEditorHtml}
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ size: [] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                  [{ align: [] }],
                ],
              }}
              placeholder="Type your answer here..."
              className="h-full"
            />
          )}
        </div>
        <div className="flex justify-center mt-4 space-x-4">
          <button
            type="submit"
            className={`bg-accent-500 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-accent-600 transition-colors ${
              !editorHtml ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!editorHtml} // Disable button if no content
          >
            Submit Answer
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg shadow-sm hover:bg-gray-300 transition-colors"
          >
            <FaRegTimesCircle className="inline-block mr-2" /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerForm;
