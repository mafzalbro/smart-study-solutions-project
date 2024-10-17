"use client";

import { fetcher } from "@/app/utils/fetcher";
import { useState, useEffect } from "react";
import Link from "next/link";
import StylishSpan from "@/app/components/StylishSpan";

const CategoriesListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/categories`)
      .then((data) => {
        setCategories(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen select-none">
      <h1 className="text-center text-4xl mt-8">
        All Categories of{" "}
        <Link href={"/forum"}>
          <StylishSpan>Forum</StylishSpan>!
        </Link>
      </h1>
      {!loading ? (
        <div className="flex justify-center flex-wrap capitalize my-8">
          {categories?.data?.map((category) => {
            return (
              <Link
                key={category.slug}
                href={"/forum/category/" + category.slug}
                className="bg-secondary dark:bg-accent-900 px-4 py-6 hover:scale-95 hover:text-link transition-all duration-200 flex  flex-col justify-center items-center gap-4 text-center m-1 rounded-lg w-1/4"
              >
                <div className="bg-primary text-white rounded-full h-10 w-10 flex justify-center items-center text-2xl">
                  {category.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-2xl">{category.name}</h3>
                {category?.description && (
                  <p className="text-sm">
                    <span className="font-semibold">description</span>{" "}
                    {category.description}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center items-center h-96">
          <p>Loading...</p>
        </div>
      )}
    </section>
  );
};

export default CategoriesListPage;
