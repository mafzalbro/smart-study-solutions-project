"use client";

import { useEffect, useState } from "react";
import { AiOutlineComment } from "react-icons/ai";
import AnswerCard from "@/app/components/dashboard/AnswerCard";
import Pagination from "@/app/components/dashboard/Pagination";
import { fetcher } from "@/app/utils/fetcher";

const UserAnswers = () => {
  const [answers, setAnswers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnswers = async (page) => {
    try {
      setLoading(true);
      const data = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/user/given-answers?page=${page}&limit=${count}`
      );

      if (data?.data) {
        setAnswers(page === 1 ? data.data : (prev) => [...prev, ...data.data]);
        setTotalResults(data.totalResults);
      } else {
        setAnswers([]);
      }
    } catch (error) {
      console.error("Error loading answers", error);
      setError("Error fetching answers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnswers(page);
  }, [page]);

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
  };

  return (
    <div className="container mx-auto my-8 p-4 space-y-8">
      <h1 className="text-3xl font-semibold mb-6 flex items-center gap-2">
        <AiOutlineComment size={28} className="text-accent-500 dark:text-accent-300" />
        Your Answers
      </h1>

      {loading && (
        <div className="text-center text-gray-500 dark:text-gray-300">
          <p className="mb-6">Loading your answers...</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, index) => (
              <div
                key={index}
                className="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg"
              >
                <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* {error && (
        <div className="text-center text-red-500 mb-4">
          <AiOutlineComment size={20} className="inline-block mr-2" />
          {error}
        </div>
      )} */}

      {!loading && answers.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-300 flex gap-4 justify-center items-center">
          <AiOutlineComment size={24} className="inline-block mb-4" />
          You haven't answered any questions yet.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && !error && answers.length > 0
          ? answers.map((answer) => (
              <AnswerCard key={answer._id} answer={answer} />
            ))
          : ""}
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

export default UserAnswers;
