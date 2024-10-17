import { useEffect, useState } from 'react';
import LinkButton from "@/app/components/LinkButton";
import ForumItem from "@/app/components/forum/ForumItem";
import Spinner from "@/app/components/Spinner";
import "react-toastify/dist/ReactToastify.css";
import TextInputField from "@/app/components/TextInputField";
import { fetcher } from '@/app/utils/fetcher';
import Sidebar from "@/app/components/forum/MainSidebar";
import { FaQuestionCircle } from "react-icons/fa";
import { QuestionCardSkeleton } from "@/app/components/forum/skeletons/QuestionCardSkeleton";
import StylishTitle from '../StylishTitle';



function Forum({ categoryItem, title }) {
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
      let url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/questions?page=${newPage}&limit=${results}&filterBy={"category":["${categoryItem._id}"]}`;

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
      <section className="dark:text-white w-full">
        <main className="flex-1 lg:ml-6">
          <LinkButton text="Ask Question" link="/forum/submit" />
          {/* <StylishTitle
            colored={title}
            simple=": Category"
            className="text-center"
          /> */}

          {/* Search Bar */}
          <div className="mx-4 my-10">
            <TextInputField
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search questions..."
              className="py-5 px-10 border border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 outline-none focus:ring-accent-400 rounded-full focus:outline-none focus:ring-2 ring-accent-500"
              noMargin
              disabled={isLoading}
            />
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
              <div className="flex flex-col items-center justify-start mt-20 w-full">
                <FaQuestionCircle className="text-gray-500 text-4xl mb-3" />
                <p className="text-center text-gray-500">No questions found.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="md:space-x-6 flex flex-col md:flex-row">
                <Sidebar />
                <div className="md:w-3/4">
                  <div className="flex flex-wrap self-start">
                    {questions?.map((question) => (
                      <ForumItem key={question?._id} question={question} />
                    ))}
                  </div>
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

          {isLoadingMore && (
            <div className="flex justify-center mt-5">
              <Spinner />
            </div>
          )}
        </main>
      </section>
    </>
  );
}

export default Forum