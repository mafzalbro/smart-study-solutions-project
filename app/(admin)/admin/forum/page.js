"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import AdminQuestionCard from "@/app/(admin)/components/forum/AdminQuestionCard";
import Skeleton from "react-loading-skeleton";
import Pagination from "@/app/(admin)/components/admin/Pagination";
import SearchInput from "@/app/(admin)/components/admin/SearchInput";
import GeneralExportButton from "@/app/(admin)/components/admin/GeneralExportButton";
import {
  FiSearch,
  FiDownload,
  FiHelpCircle,
  FiUser,
  FiClock,
  FiEye,
  FiEdit,
  FiTrash,
} from "react-icons/fi";

export default function AdminForumPage() {
  const count = 10;
  const exportCount = 1000;
  const [questions, setQuestions] = useState([]);
  const [totalResults, setTotalResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const getForumQuestions = async (currentPage, query = "") => {
    currentPage === 1 ? setLoading(true) : setIsLoadingMore(true);

    const data = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/questions/admin?limit=${count}&page=${currentPage}&query=${query}`
    );

    setQuestions((prevQuestions) =>
      currentPage === 1 ? data.data : [...prevQuestions, ...data.data]
    );
    setTotalResults(data.totalResults);
    setLoading(false);
    setIsLoadingMore(false);
  };

  useEffect(() => {
    getForumQuestions(page, searchQuery);
  }, [page]);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setQuestions([]);
    getForumQuestions(1, query);
  };

  const requestData = async (resource, count) => {
    const data = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/${resource}?limit=${count}`
    );
    return data.data;
  };

  const categories = [
    { label: "Question", icon: <FiHelpCircle /> },
    { label: "Category", icon: <FiSearch /> },
    { label: "Asked By", icon: <FiUser /> },
    { label: "Created At", icon: <FiClock /> },
    { label: "View Details", icon: <FiEye /> },
    { label: "Edit", icon: <FiEdit /> },
    { label: "Delete", icon: <FiTrash /> },
  ];

  return (
    <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SearchInput onSearch={handleSearch} debounceDelay={1000} />
        </div>
        <GeneralExportButton
          resource="questions"
          count={exportCount}
          requestData={requestData}
          icon={<FiDownload className="text-blue-500 mr-2" />}
        />
      </div>

      <table className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden shadow">
        <thead>
          <tr className="bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold">
            {categories.map((category, i) => (
              <th key={i} className="py-3 px-5 text-center">
                <div className="flex items-center justify-center gap-1">
                  {category.icon}
                  <span>{category.label}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && page === 1 && Array.from({ length: count }).map((_, i) => (
            <tr key={i}>
              {categories.map((_, key) => (
                <td key={key} className="p-5">
                  <Skeleton width={140} height={20} />
                </td>
              ))}
            </tr>
          ))}
          {questions.map((question) => (
            <AdminQuestionCard
              question={question}
              key={question._id}
              className="transition duration-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
            />
          ))}
          {isLoadingMore && Array.from({ length: count }).map((_, i) => (
            <tr key={`load-more-${i}`}>
              {categories.map((_, key) => (
                <td key={key} className="p-5">
                  <Skeleton width={140} height={20} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        page={page}
        totalResults={totalResults}
        count={count}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
