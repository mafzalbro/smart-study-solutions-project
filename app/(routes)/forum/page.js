"use client";

import { useEffect, useState } from 'react';
import LinkButton from '@/app/components/LinkButton';
import ForumItem from '@/app/components/forum/ForumItem';
import Spinner from '@/app/components/Spinner';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextInputField from '@/app/components/TextInputField';
import { fetcher } from '@/app/utils/fetcher';
import Sidebar from '@/app/components/forum/MainSidebar';
import StylishTitle from '@/app/components/StylishTitle';
import { FaQuestionCircle } from 'react-icons/fa';

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
    <>
    <section className="md:p-8 p-4 dark:text-white w-full">
      <main className="flex-1 lg:ml-6">
        <LinkButton text="Ask Question" link="/forum/submit" />
        <StylishTitle colored='Ask Anything' simple='From Your Teacher' className='text-center'/>
        
        {/* <p className="text-lg text-center my-16 w-4/6 mx-auto">
          Welcome to our dynamic forum community! Discover, discuss, and learn with us. Join engaging conversations, ask questions, and share your knowledge across a wide range of topics. Start exploring and connecting today!
        </p> */}
        
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
            <div className="flex h-full w-full gap-4">
                <div className='hidden md:flex flex-col md:w-1/4 h-full'>
                  <Skeleton height={500} width="100%" />
                </div>
                <div className='flex flex-col md:w-3/4 w-full h-full'>
                  <Skeleton height={500} width="100%" />
                </div>
              {/* <div className="absolute inset-0 flex items-center justify-center">
                <Spinner />
              </div> */}
            </div>
          ) : error ? (
          <p className="text-center text-red-500 mt-5">
            Error fetching questions: {error.message}
          </p>
        ) : questions?.length === 0 ? (
          <div className='md:space-x-6 flex flex-col md:flex-row'>
          <Sidebar />
              <div className="flex flex-col items-center justify-start mt-5 w-full">
              <FaQuestionCircle className="text-gray-500 text-4xl mb-3" />
              <p className="text-center text-gray-500">No questions found.</p>
            </div>
          </div>

        ) : (
          <div className='md:space-x-6 flex flex-col md:flex-row'>
            <Sidebar />
          <div className="flex flex-wrap md:w-3/4 self-start">
            {questions?.map(question => (
              <ForumItem key={question?._id} question={question} />
            ))}
          </div>
            </div>
        )}

        {questions?.length !== 0 && !error && hasMore && !isLoadingMore && (
          <div className="flex justify-center m-10">
            <button
              onClick={handleLoadMore}
              className="border border-neutral-300 rounded-full text-accent-500 hover:text-accent-700 font-bold py-4 px-6 dark:border-neutral-700"
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
      </main>
    </section>
    </>
  );
};

export default ForumPage;
