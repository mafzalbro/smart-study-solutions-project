"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import Pagination from "@/app/(admin)/components/admin/Pagination";
import SearchInput from "@/app/(admin)/components/admin/SearchInput";
import GeneralExportButton from "@/app/(admin)/components/admin/GeneralExportButton";
import LinkButton from "@/app/components/LinkButton";
import Skeleton from "react-loading-skeleton";
import { BiPlus } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";
// import Link from "next/link";

export default function Contacts() {
  const count = 10;
  const exportCount = 1000;
  const [contacts, setContacts] = useState([]);
  const [totalResults, setTotalResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const getContacts = async (currentPage, query = "") => {
    currentPage === 1 ? setLoading(true) : setIsLoadingMore(true);

    const data = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/contact?limit=${count}&page=${currentPage}&query=${query}`
    );

    console.log({ data: data.data });
    setContacts((prevContacts) =>
      currentPage === 1 ? data.data.data : [...prevContacts, ...data.data.data]
    );
    setTotalResults(data.data.totalResults);
    setLoading(false);
    setIsLoadingMore(false);
  };

  useEffect(() => {
    getContacts(page, searchQuery);
  }, [page]);

  console.log({ contacts });

  const handlePageChange = (newPage) => setPage(newPage);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setContacts([]);
    getContacts(1, query);
  };

  const requestData = async (resource, count) => {
    const data = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/contact`
    );
    return data.data.data;
  };

  const categories = [
    "Email",
    "Names",
    "Messages",
    "Subscribed",
    "Known",
    "User ID",
    "User Full Name",
  ];

  return (
    <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow overflow-auto">
        <div className="flex items-center justify-between w-full my-4 gap-4">
          <GeneralExportButton
            resource="contacts"
            count={exportCount}
            requestData={requestData}
            icon={<FiDownload className="text-blue-500 mr-2" />}
          />
          {/* <LinkButton
            link="/admin/contacts/new"
            text="Add New Contact"
            icon={<BiPlus />}
            className="!mb-6"
          /> */}
          <SearchInput onSearch={handleSearch} debounceDelay={1000} />
        </div>

      <table className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden shadow">
        <thead>
          <tr className="bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold">
            {categories?.map((category, i) => (
              <th key={i} className="py-3 px-5 text-center">
                {category}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading &&
            page === 1 &&
            Array.from({ length: count }).map((_, i) => (
              <tr key={i}>
                {categories.map((_, key) => (
                  <td key={key} className="p-5">
                    <Skeleton width={140} height={20} />
                  </td>
                ))}
              </tr>
            ))}
          {!loading &&
            contacts?.map((contact) => (
              <tr key={contact._id} className="text-center">
                <td className="p-4">{contact.email || "N/A"}</td>
                <td className="p-4">{contact.names?.join(", ") || "N/A"}</td>
                <td className="p-4">{contact.messages?.join(", ") || "N/A"}</td>
                <td className="p-4">{contact.subscribed ? "Yes" : "No"}</td>
                <td className="p-4">{contact.known ? "Yes" : "No"}</td>
                <td className="p-4">{contact.userId || "N/A"}</td>
                <td className="p-4">{contact.fullname || "N/A"}</td>
              </tr>
            ))}
          {isLoadingMore &&
            Array.from({ length: count }).map((_, i) => (
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
