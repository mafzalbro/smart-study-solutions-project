"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import AdminQuestionCard from "../../components/forum/AdminQuestionCard";
import Skeleton from "react-loading-skeleton";

export default function AdminForumPage() {
  const count = 20;
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const getForumQuestions = async () => {
    const data = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/questions?limit=${count}`
    );
    setQuestions(data.data);
    setLoading(false);
    return;
  };
  
  useEffect(() => {
    getForumQuestions();
  }, []);
  
  console.log({ questions });

  // if (loading) {
  //   return <p>Loading (loading)...</p>;
  // }

  const categories = [
    "Question",
    "Category",
    "Asked By",
    "Created At",
    "View Details",
    "Edit",
    "Delete",
  ];
  

  return (
      <>
        {/* <LinkButton link={'/admin/forum/new'} text={'Add New'} icon={<BiPlus />} className="!mb-6" /> */}
        <table className="w-full overflow-x-scroll block px-1 md:px-4">
          <tbody>
            <tr className="border text-center border-neutral-300 dark:border-neutral-600 bg-neutral-300 dark:bg-primary text-semibold">
              {categories.map((category, i) => {
                return (
                  <td className="p-4" key={i}>{category}</td>
                );
              })}
            </tr>
            {loading && (
              Array.from({ length: count }).map((_, i) => (
                <tr key={i}>
                  {categories.map((_, key) => (
                    <td key={key}>
                      <Skeleton width={140} height={120} />
                    </td>
                  ))}
                </tr>
              ))
            )}
            {!loading && questions?.map((question) => (
              <AdminQuestionCard question={question} key={question?._id} />
            ))}
          </tbody>
        </table>
      </>
    );
  }