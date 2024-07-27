"use client";

import { useEffect, useState } from 'react';
import LinkButton from '../../components/LinkButton';
import ForumCard from '../../components/forum/ForumCard';
import Spinner from '../../components/Spinner';

const ForumPage = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

      const response = await fetch(url);
      const data = await response.json();

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
    <section className="p-8">
      <LinkButton text="Ask Question" link="/forum/submit" />
      <h1 className="text-5xl font-bold my-10 font-mono text-center"><span className="text-orange-600">Ask Anything</span> From Your Teachers</h1>
      <p className="text-lg text-center my-16 w-4/6 mx-auto">
          Welcome to our dynamic forum community! Discover, discuss, and learn with us. Join engaging conversations, ask questions, and share your knowledge across a wide range of topics. Start exploring and connecting today!
      </p>
      <div className="flex justify-center my-20">
        <input
          type="text"
          placeholder="Search questions?..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="py-5 px-10 border border-gray-300 rounded-full w-full max-w-md focus:outline-none ring-2 focus:ring-4 ring-orange-500"
          style={{ maxWidth: "600px" }}
        />
      </div>

      {isLoading && questions?.length === 0 ? (
        <div className="flex justify-center m-10">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 mt-5">
          Error fetching questions: {error.message}
        </p>
      ) : questions?.length === 0 ? (
        <p className="text-center text-gray-500 mt-5">No questions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions?.map(question => (
            <ForumCard key={question?._id} question={question} />
          ))}
        </div>
      )}

      {questions?.length !== 0 && !error && hasMore && !isLoadingMore && (
        <div className="flex justify-center m-10">
          <button
            onClick={handleLoadMore}
            className="text-orange-500 hover:text-orange-700 font-bold py-2 px-4 rounded"
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
