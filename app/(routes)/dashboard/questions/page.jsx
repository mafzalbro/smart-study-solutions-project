"use client";

import { useEffect, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai"; // Icon for questions
import Pagination from "@/app/components/dashboard/Pagination";
import { fetcher } from "@/app/utils/fetcher";

const UserQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadQuestions = async (page) => {
    try {
      setLoading(true);
      const data = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/user/asked-questions?page=${page}&limit=${count}`
      );

      if (data?.data) {
        setQuestions(
          page === 1 ? data.data : (prev) => [...prev, ...data.data]
        );
        setTotalResults(data.totalResults);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error loading questions", error);
      setError("Error fetching questions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions(page);
  }, [page]);

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
  };

  return (
    <div className="container mx-auto my-8 p-4 space-y-8">
      <h1 className="text-3xl font-semibold mb-6 flex items-center gap-2">
        <AiOutlineQuestionCircle size={28} className="text-accent-500 dark:text-accent-300" />
        Your Questions
      </h1>

      {loading && (
        <div className="text-center text-gray-500 dark:text-gray-300">
          Loading your questions...
        </div>
      )}

      {/* {error && (
        <div className="text-center text-red-500 mb-4">
          <AiOutlineQuestionCircle size={20} className="inline-block mr-2" />
          {error}
        </div>
      )} */}

      {!loading && questions.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-300">
          <AiOutlineQuestionCircle size={24} className="inline-block mb-4" />
          You haven't asked any questions yet.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && !error && questions.length > 0
          ? questions.map((question) => (
              <div
                key={question._id}
                className="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg"
              >
                <h3 className="text-lg font-medium mb-2">
                  {question.question}
                </h3>
                <span className="text-neutral-500 dark:text-neutral-400">{new Date(question.createdAt).toLocaleString()}</span>
                <a
                  href={`/forum/${question.slug}`}
                  className="text-accent-500 dark:text-accent-300 hover:underline flex items-center gap-2"
                >
                  View Details
                </a>
              </div>
            ))
          : Array.from({ length: count }).map((_, index) => (
              <div
                key={index}
                className="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg"
              >
                <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            ))}
      </div>

      <Pagination
        page={page}
        totalResults={totalResults}
        count={count}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default UserQuestions;
