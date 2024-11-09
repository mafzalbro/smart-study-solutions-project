"use client";

import { useEffect, useState } from "react";
import LinkButton from "@/app/components/LinkButton";
import ForumItem from "@/app/components/forum/ForumItem";
import Spinner from "@/app/components/Spinner";
import Skeleton from "react-loading-skeleton";
import "react-toastify/dist/ReactToastify.css";
import TextInputField from "@/app/components/TextInputField";
import { fetcher } from "@/app/utils/fetcher";
import Sidebar from "@/app/components/forum/MainSidebar";
import StylishTitle from "@/app/components/StylishTitle";
import { FaQuestionCircle } from "react-icons/fa";
import { QuestionCardSkeleton } from "@/app/components/forum/skeletons/QuestionCardSkeleton";

const ForumPage = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const results = 10;

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const fetchQuestions = async (newPage = 1, reset = false) => {
    setIsLoading(true);
    setError(null);

    try {
      let url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/questions?page=${newPage}&limit=${results}`;

      if (debouncedSearchTerm) {
        url += `&query=${debouncedSearchTerm}`;
      }

      const data = await fetcher(url);
      const { data: fetchedQuestions, totalResults } = data;

      if (reset || debouncedSearchTerm) {
        setQuestions(fetchedQuestions);
      } else {
        setQuestions((prevQuestions) => [
          ...prevQuestions,
          ...fetchedQuestions,
        ]);
      }

      setPage(newPage);
      setHasMore(newPage * results < totalResults);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchQuestions(1, true);
  }, [debouncedSearchTerm]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setIsLoadingMore(true);
    fetchQuestions(nextPage, false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <section className="md:p-8 p-4 dark:text-white w-full">
        <main className="flex-1 lg:ml-6">
          <LinkButton text="Ask Question" link="/forum/submit" />
          <StylishTitle
            colored="Ask Anything"
            simple="From Your Teacher"
            className="text-center"
          />

          {/* Search Bar Skeleton or Input */}
          <div className="mx-4 my-20">
            {isLoading ? (
              <div className="flex items-center justify-between">
                <Skeleton circle={true} height={24} width={24} />
                <Skeleton
                  height={50}
                  width={200}
                  className="rounded-full w-full"
                />
              </div>
            ) : (
              <TextInputField
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search questions..."
                className="py-5 px-10 border border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 outline-none focus:ring-accent-400 rounded-full focus:outline-none focus:ring-2 ring-accent-500"
                noMargin
                disabled={isLoading}
              />
            )}
          </div>

          {isLoading && questions?.length === 0 ? (
            <QuestionCardSkeleton />
          ) : error ? (
            <p className="text-center text-red-500 mt-5">
              Error fetching questions: {error.message}
            </p>
          ) : questions?.length === 0 ? (
            <div className="md:space-x-6 flex flex-col md:flex-row">
              <Sidebar />
              <div className="flex flex-col items-center justify-start mt-5 w-full">
                <FaQuestionCircle className="text-gray-500 text-4xl mb-3" />
                <p className="text-center text-gray-500">No questions found.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="md:space-x-6 flex flex-col md:flex-row">
                <Sidebar />
                <div className="md:w-3/4">
                  {/* Questions Skeletons */}
                  <div className="flex flex-wrap self-start">
                    {isLoading
                      ? [...Array(5)].map((_, idx) => (
                          <div
                            key={idx}
                            className="w-full mb-6 border-b border-gray-200 pb-6"
                          >
                            <div className="flex items-center space-x-4">
                              <Skeleton circle={true} height={50} width={50} />
                              <div className="flex flex-col w-full space-y-3">
                                <Skeleton height={24} width="60%" />
                                <Skeleton height={16} width="40%" />
                                <Skeleton height={12} width="30%" />
                              </div>
                            </div>
                            <Skeleton
                              height={100}
                              width="100%"
                              className="mt-4 rounded-md"
                            />
                          </div>
                        ))
                      : questions?.map((question) => (
                          <ForumItem key={question?._id} question={question} />
                        ))}
                  </div>

                  {/* Load More Skeleton */}
                  {questions?.length !== 0 &&
                    !error &&
                    hasMore &&
                    !isLoadingMore && (
                      <div className="flex justify-center m-10">
                        <button
                          onClick={handleLoadMore}
                          className="border border-neutral-300 rounded-full text-accent-500 hover:text-accent-700 font-bold py-4 px-6 dark:border-neutral-700"
                        >
                          Load More
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </>
          )}

          {/* Spinner when loading more */}
          {isLoadingMore && (
            <div className="flex justify-center mt-5">
              <Spinner />
            </div>
          )}
        </main>
      </section>
    </>
  );
};

export default ForumPage;
