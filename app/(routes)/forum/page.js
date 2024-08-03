"use client";

import { useEffect, useState } from 'react';
import LinkButton from '../../components/LinkButton';
import ForumItem from '../../components/forum/ForumItem';
import Spinner from '../../components/Spinner';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextInputField from '@/app/components/TextInputField';

const fetcher = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Failed to fetch data');
    throw error;
  }
};

const ForumPage = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const results = 5;

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
        setQuestions((prevQuestions) => [...prevQuestions, ...fetchedQuestions]);
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
      <section className="p-8 dark:bg-neutral-900 dark:text-white w-full">
        <ToastContainer />
        <LinkButton text="Ask Question" link="/forum/submit" />
        <h1 className="text-5xl my-10 text-center">
          <span className="text-accent-500">Ask Anything</span> From Your Teachers
        </h1>
        <p className="text-lg text-center my-16 w-4/6 mx-auto">
          Welcome to our dynamic forum community! Discover, discuss, and learn with us. Join engaging conversations, ask questions, and share your knowledge across a wide range of topics. Start exploring and connecting today!
        </p>
        <div className="flex justify-center my-20">
          <TextInputField
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search questions..."
            className="w-full max-w-md"
            noMargin
          />
        </div>

        {isLoading && questions?.length === 0 ? (
          <SkeletonTheme>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(results).fill().map((_, i) => (
                <Skeleton key={i} height={250} />
              ))}
            </div>
          </SkeletonTheme>
        ) : error ? (
          <p className="text-center text-red-500 mt-5">
            Error fetching questions: {error.message}
          </p>
        ) : questions?.length === 0 ? (
          <p className="text-center text-gray-500 mt-5">No questions found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions?.map(question => (
              <ForumItem key={question?._id} question={question} />
            ))}
          </div>
        )}

        {questions?.length !== 0 && !error && hasMore && !isLoadingMore && (
          <div className="flex justify-center m-10">
            <button
              onClick={handleLoadMore}
              className="text-accent-500 hover:text-accent-700 font-bold py-2 px-4 rounded"
            >
              Load More
            </button>
          </div>
        )}

        {isLoadingMore && (
          <div className="flex justify-center mt-5">
            <Spinner />
          </div>
        )}
      </section>
  );
};

export default ForumPage;
