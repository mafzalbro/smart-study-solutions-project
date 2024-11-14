import React, { useEffect, useState } from "react";
import { FaUser, FaRobot, FaVideo } from "react-icons/fa";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // Light mode style
import "highlight.js/styles/github-dark.css"; // Dark mode style
import VideoSearchModal from "./VideoSearchModal";
import { SyncLoader } from "react-spinners";
const marked = require("marked");
const cheerio = require("cheerio");

// Function to apply Tailwind classes to HTML content using cheerio
const addTailwindClasses = (html) => {
  const $ = cheerio.load(html);

  // Map HTML tags to Tailwind classes
  const styles = {
    pre: "my-1 p-1 md:p-4 rounded-md max-w-[90vw] md:max-w-full mx-auto overflow-x-auto",
    code: "my-1 p-1 rounded-md",
    blockquote:
      "my-1 p-4 bg-blue-50 dark:bg-neutral-800 border-l-4 border-blue-500",
    table:
      "my-1 min-w-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700",
    th: "my-1 px-4 py-2 border-b border-gray-200 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-700",
    td: "px-4 py-2 border-b border-gray-200 dark:border-neutral-700",
    img: "my-1 max-w-full h-auto rounded-md",
    a: "my-1 text-blue-500 dark:text-blue-400 hover:underline",
  };

  Object.keys(styles).forEach((tag) => {
    $(tag).each((i, el) => {
      $(el).addClass(styles[tag]);
    });
  });

  return $.html();
};

export default function ChatMessage({ message, display }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderMarkdown = (text) => {
    if (!text) return { __html: "<span></span>" }; // Return empty HTML if text is null or undefined
    const html = marked.parse(text);
    const styledHtml = addTailwindClasses(html);
    return { __html: styledHtml };
  };

  useEffect(() => {
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightBlock(block);
    });
  }, [message]);

  return (
    <>
      {message && (
        <div
          className={`overflow-auto p-4 mb-2 rounded-lg dark:bg-neutral-900 dark:text-secondary ${
            display ? display : ""
          }`}
        >
          <div className="flex items-start mb-2">
            <FaUser
              className="text-accent-500 dark:text-accent-400 text-2xl mr-2"
              size={20}
            />
            <p
              className="text-accent-500 dark:text-accent-400 flex-1"
              dangerouslySetInnerHTML={renderMarkdown(message.user_query || "")}
            />
            {/what|how|why|when|where|who|\?/.test(
              (message.user_query || "").toLowerCase()
            ) && (
              <button
                className="ml-4 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={() => setIsModalOpen(true)}
                title="Search videos related to this message"
              >
                <FaVideo size={20} />
              </button>
            )}
          </div>

          <div className="flex items-start">
            <FaRobot
              className="text-accent-200 dark:text-accent-400 text-2xl mr-2"
              size={20}
            />
            {message.model_response ? (
              <p
                dangerouslySetInnerHTML={renderMarkdown(
                  message.model_response || ""
                )}
              />
            ) : (
              <div className="flex items-center">
                <SyncLoader color="#4a90e2" size={6} />
                <span className="ml-3 text-gray-600 dark:text-gray-400">
                  Generating response...
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      
      <VideoSearchModal
        query={message.model_response}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
