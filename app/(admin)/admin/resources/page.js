"use client";

import { Suspense, useEffect, useState } from "react";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import AdminResourceCard from "../../components/resources/AdminResourceCard";
import Skeleton from "react-loading-skeleton";
import LinkButton from "@/app/components/LinkButton";
import { BiPlus } from "react-icons/bi";

export default function Resources() {
  const count = 2;
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(true);
  // const response = await (await fetch(
  //   `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources?showFullJSON=true&limit=2`
  // )).json();
  // const resources = response.results.data;

  const getResources = async () => {
    const data = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources?showFullJSON=true&limit=${count}`
    );
    setResources(data.results.data);
    setLoading(false);
    return;
  };

  useEffect(() => {
    getResources();
  }, []);

  console.log({ resources });

  // if (loading) {
  //   return <p>Loading (loading)...</p>;
  // }

  const categories = [
    "Image",
    "Title",
    // "Description",
    "Rating",
    "Rating Count",
    "Likes",
    "Dislikes",
    "Semester",
    "Degree",
    "Type",
    "Tags",
    "Created At",
    "Last",
    "Slug",
    "PDF Link",
    "Edit",
    "Delete",
  ];


  return (
    <>
    <LinkButton link={'/admin/resources/new'} text={'Add New'} icon={<BiPlus />} className="!mb-6"/>
    <table className="w-full overflow-x-scroll block">
      <tbody>
        <tr className="border text-center border-neutral-300 dark:border-neutral-600 bg-neutral-300 dark:bg-primary text-semibold">
          {categories.map((category, i) => {
            return (
              <td className="p-4" key={i}>{category}</td>
            )
          })
          }
        </tr>

        {loading &&
          Array.from({ length: count }).map((_, i) => (
            <tr key={i}>
              {categories.map((_, key) => <td key={key}>
                <Skeleton width={140} height={120}/>
              </td>
              )}
            </tr>
          ))}
        {!loading &&
          resources?.map((resource) => (
            <AdminResourceCard resource={resource} key={resource?._id} />
          ))}
      </tbody>
    </table>
    </>
  );
}
