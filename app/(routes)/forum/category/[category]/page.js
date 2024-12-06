"use client";

import { fetcher } from "@/app/utils/fetcher";
import { useState, useEffect } from "react";
import Link from "next/link";
import Forum from "@/app/components/forum/forumPage";
import Skeleton from "react-loading-skeleton";
import { FaChevronLeft } from "react-icons/fa";
import StylishTitle from "@/app/components/StylishTitle";
const CategoryPage = ({ params: { category } }) => {
  const [categoryItem, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/category/${category}`
    )
      .then((data) => {
        setCategory(data);
      })
      .finally((_) => setLoading(false));
  }, []);

  if (loading) {
    return <Skeleton height={600} width={"100vw"} />;
  }
  return (
    <>
      <Link
        href="/forum/category"
        className="text-accent-600 dark:text-accent-300 inline-flex items-center pt-6 pl-6"
      >
        <FaChevronLeft className="mr-1" /> Back to All Categories Page
      </Link>
      <section className="min-h-screen text-center p-4 md:p-8 mt-10">
        <StylishTitle colored={categoryItem.name} noSpaces/>
        {/* <h1 className="text-5xl pb-4 capitalize">{categoryItem.name}</h1> */}
        <p className="text-neutral-600 dark:text-neutral-300 my-4">
          {categoryItem.description}
        </p>
        <Forum title={categoryItem.name} categoryItem={categoryItem} />
      </section>
    </>
  );
};

export default CategoryPage;
